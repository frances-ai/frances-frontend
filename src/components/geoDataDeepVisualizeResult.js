import Box from "@mui/material/Box";
import * as dfd from "danfojs"
import Plot from "react-plotly.js";
import TimeSlideMap from "./maps/timeSlideMap";

function GeoDataDeepVisualizeResult(props) {
    const {result} = props;

    function get_geo_resolution_dataframe() {
        let dfs = []
        for (const year in result) {
            for (const record of result[year]) {
                const locs = record["georesolution"]
                const volume_id = record["volumeId"]
                const title = record["title"]
                const page = record["page number"]
                const serie = record["serie"]
                const uri = record["uri"]
                if (Object.keys(locs).length > 0) {
                    let data = []
                    for (const place_name in locs) {
                        let c_locs = []
                        c_locs.push(locs[place_name]["lat"])
                        c_locs.push(locs[place_name]["long"])
                        c_locs.push(place_name.split("-")[0])
                        c_locs.push(locs[place_name]["snippet"])
                        c_locs.push(page)
                        c_locs.push(serie)
                        c_locs.push(year)
                        c_locs.push(volume_id)
                        c_locs.push(title)
                        c_locs.push(uri)
                        data.push(c_locs)
                    }

                    if (data) {
                        const df_page = new dfd.DataFrame(data, {
                            columns: ['Latitude', 'Longitude', 'Place', 'Snippet', 'Page', 'Serie', 'Year', 'Volume_ID', 'Title', 'URI']
                        })
                        dfs.push(df_page)
                    }
                }
            }
        }
        return dfd.concat({dfList: dfs});
    }

    const df_total = get_geo_resolution_dataframe();
    const df_resolved = df_total.query(df_total["Latitude"].ne(""));

    function get_top_n_geo_locations(n) {
        const df_top_geo_locations = df_resolved.groupby(["Place"])
            .col(["URI"])
            .count()
        df_top_geo_locations.rename({URI_count: "count"}, {inplace: true})
        df_top_geo_locations.sortValues("count", {ascending: false, inplace: true})
        const df_top_n_geo_locations = df_top_geo_locations.head(n);
        return Object.assign(
            dfd.toJSON(df_top_n_geo_locations.column("Place")),
            dfd.toJSON(df_top_n_geo_locations.column("count")));
    }


    const top_n_geo_locations = get_top_n_geo_locations(15);
    console.log(top_n_geo_locations);



    /**
     * Convert result to a GeoJson object.
     * Details about GeoJson Object can be found here https://www.rfc-editor.org/rfc/rfc7946
     */
    function get_GeoJson_Object() {
        let df_frequency_by_year_place = df_resolved.groupby(["Year", "Place", "Latitude", "Longitude"])
            .col(["URI"])
            .count();
        df_frequency_by_year_place.rename({URI_count: "count"}, {inplace: true});

        let geoJson = dfd.toJSON(df_frequency_by_year_place, {format: "column"});
        geoJson = geoJson.map((geo) => (
            {
                type: "Feature",
                properties: geo,
                geometry: {
                    type: "Point",
                    coordinates: [geo["Longitude"], geo["Latitude"]]
                }
            }
        ))

        const min_frequency = df_frequency_by_year_place["count"].min();
        const max_frequency = df_frequency_by_year_place["count"].max();

        geoJson = {
            "type": "FeatureCollection",
            "metadata": {
                min_frequency: min_frequency,
                max_frequency: max_frequency
            },
            "features": geoJson
        }
        return geoJson;
    }


    const geoJson = get_GeoJson_Object();
    console.log(geoJson);


    return (
        <Box>
            <Plot
                data={[{
                x: top_n_geo_locations.Place,
                y: top_n_geo_locations.count,
                type: 'bar'
            }]}
                  layout={
                      {
                          title: '15 Places most mentioned and geo-resolved',
                          xaxis: {
                              title: 'Places'
                          },
                          yaxis: {
                              title: 'Frequency'
                          },
                          autosize: true
                      }
                  }
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
            />
            <TimeSlideMap geoJson={geoJson} years={Object.keys(result)}/>
        </Box>
    )
}

export default GeoDataDeepVisualizeResult;