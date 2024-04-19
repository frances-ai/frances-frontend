import GeoLocationAPI from "./geoLocation"

const params = {
    q: "UK",
    format: "geojson"
}
GeoLocationAPI.searchLocation(params).then( response => {
    console.log(response.data)
    expect(response.status).toBe(200)
})