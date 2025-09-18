import {useEffect, useRef, useState} from "react";
import "ol/ol.css"
import {Feature, Map, Overlay, View} from "ol"
import {TileJSON} from "ol/source"
import {useGeographic} from "ol/proj.js";
import "./mapForDescription.css"
import OSM from 'ol/source/OSM.js';

import TileLayer from "ol/layer/Tile"
import LayerGroup from "ol/layer/Group.js";
import {Point} from "ol/geom.js";
import {Icon, Style} from "ol/style.js";
import VectorSource from "ol/source/Vector.js";
import VectorLayer from "ol/layer/Vector.js";
import mapMarker from "./map-marker.svg"
import config from "../../config.json"
import {Control} from "ol/control.js";
import {defaults as defaultControls} from 'ol/control/defaults.js';


function MapForDescription(props) {
    const mapRef = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(null); // Ref for popup container
    const { locations, focused_location } = props
    const zoom = 5;
    const [mode, setMode] = useState("OSM");
    const apiKey = config.OPENLAYER_API_KEY;
    // Define tile sources
    const osmLayer = new TileLayer({
        source: new OSM(),
        visible: true
    })

    const sourceLowZoom = new TileJSON({
        url: `https://api.maptiler.com/tiles/uk-osgb1919/tiles.json?key=${apiKey}`,
        tileSize: 512,
        crossOrigin: "anonymous",
    });

    const sourceHighZoom = new TileJSON({
        url: `https://api.maptiler.com/tiles/uk-osgb10k1888/tiles.json?key=${apiKey}`,
        tileSize: 512,
        crossOrigin: "anonymous",
    });

    // Define layers
    const histLowZoomLayer = new TileLayer({
        source: sourceLowZoom,
        visible: false, // Default visibility for low zoom
    });

    const histHighZoomLayer = new TileLayer({
        source: sourceHighZoom,
        visible: false, // Initially hidden, only visible at high zoom
    });

    // Define vector source and layer
    const vectorSource = new VectorSource();

    const markerLayer = new VectorLayer({
        source: vectorSource,
    });

    const layers = [osmLayer,  histHighZoomLayer, histLowZoomLayer, markerLayer];

    //
    // Define map mode control.
    //

    class ModeControl extends Control {
        /**
         * @param {Object} [opt_options] Control options.
         */
        constructor(opt_options) {
            const options = opt_options || {};

            const hist_button = document.createElement('button');
            hist_button.innerHTML = 'Historical';

            const osm_button = document.createElement('button');
            osm_button.innerHTML = 'OpenStreet';

            const mode_nav = document.createElement('div');
            mode_nav.className = 'ol-unselectable ol-control mode-nav';

            mode_nav.append(osm_button)
            mode_nav.append(hist_button)

            super({
                element: mode_nav,
                target: options.target,
            });

            this.osm_button = osm_button;
            this.hist_button = hist_button;

            osm_button.addEventListener('click', this.handleOSMButtonClick.bind(this), false);
            hist_button.addEventListener('click', this.handleHistButtonClick.bind(this), false);
        }

        handleHistButtonClick() {
            // Set active button
            this.hist_button.className = 'active';
            this.osm_button.className = '';
            setMode("Historical");
        }

        handleOSMButtonClick() {
            this.hist_button.className = '';
            this.osm_button.className = 'active';
            setMode("OSM");
        }
    }


    useGeographic();

    useEffect(() => {
        if (map?.current) {
            // Change visibility based on zoom
            if (mode === "OSM") {
                //console.log("OSM")
                map.current.getLayers().item(0).setVisible(true)
            } else {
                map.current.getLayers().item(0).setVisible(false)
            }
            if (mode === "Historical") {
                const currentZoom = map.current.getView().getZoom();
                //console.log("Current Zoom Level:", currentZoom);
                if (currentZoom <= 14) {
                    //console.log("Change to historical")
                    map.current.getLayers().item(1).setVisible(false)
                    map.current.getLayers().item(2).setVisible(true)
                } else if (currentZoom > 14) {
                    //console.log("Change to historical")
                    map.current.getLayers().item(1).setVisible(true)
                    map.current.getLayers().item(2).setVisible(false)
                }
            } else {
                map.current.getLayers().item(1).setVisible(false)
                map.current.getLayers().item(2).setVisible(false)
            }
        }

    }, [mode]);

    useEffect(() => {
        // Add markers to the vector source
        locations.forEach((location) => {
            const feature = new Feature({
                geometry: new Point([location.long, location.lat]),
                name: location.name, // Store name for popup
            });

            // Marker icon style
            feature.setStyle(
                new Style({
                    image: new Icon({
                        anchor: [0.5, 0.5], // Center bottom of the icon
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'fraction',
                        scale: 1, // Adjust size
                        src: mapMarker,
                        crossOrigin: 'anonymous',
                        color: 'rgba(25,118,210,0.8)',
                    }),
                })
            );

            vectorSource.addFeature(feature);
        });

        // Create map
        map.current = new Map({
            controls: defaultControls().extend([new ModeControl()]),
            layers: new LayerGroup({
                layers: layers,
            }),
            target: mapRef.current,
            view: new View({
                center: [focused_location.long, focused_location.lat],
                zoom: zoom,
            }),
        });

        map.current.getView().on("change:resolution", () => {
            const currentZoom = map.current.getView().getZoom();
            const osm_visiable = map.current.getLayers().item(0).getVisible();
            //console.log("Current Zoom Level:", currentZoom);
            if (!osm_visiable) {
                if (currentZoom <= 14) {
                    //console.log("Change to historical")
                    map.current.getLayers().item(1).setVisible(false)
                    map.current.getLayers().item(2).setVisible(true)
                } else {
                    //console.log("Change to historical")
                    map.current.getLayers().item(1).setVisible(true)
                    map.current.getLayers().item(2).setVisible(false)
                }
            }
        });

        // Popup overlay setup
        const popup = new Overlay({
            element: popupRef.current,
            positioning: "bottom-center",
            stopEvent: false,
            offset: [0, -15],
        });
        map.current.addOverlay(popup);

        // Click event to show popup
        map.current.on("singleclick", (event) => {
            const feature = map.current.forEachFeatureAtPixel(event.pixel, (feat) => feat);
            if (feature) {
                const coordinates = feature.getGeometry().getCoordinates();
                const name = feature.get("name");
                popup.setPosition(coordinates);
                popupRef.current.innerHTML = `<div class="popup">${name}</div>`;
                popupRef.current.style.display = "block";
            } else {
                popupRef.current.style.display = "none"; // Hide popup if clicking elsewhere
            }
        });

        // change mouse cursor when over marker
        map.current.on('pointermove', function (e) {
            const hit = map.current.hasFeatureAtPixel(e.pixel);
            map.current.getTargetElement().style.cursor = hit ? 'pointer' : '';
        });


    }, []);


    useEffect(() => {
        const coordinates = [focused_location.long, focused_location.lat]
        map.current.getView().setCenter(coordinates);
        map.current.getView().setZoom(9);
        const name = focused_location.name;
        map.current.getOverlays().item(0).setPosition(coordinates);
        popupRef.current.innerHTML = `<div class="popup">${name}</div>`;
        popupRef.current.style.display = "block";
    }, [focused_location]);

    return (
        <div>
            <div ref={mapRef} className="map"></div>
            <div ref={popupRef} className="popup-container" style={{display: "none", position: "absolute"}}></div>
        </div>

    )
}

export default MapForDescription;