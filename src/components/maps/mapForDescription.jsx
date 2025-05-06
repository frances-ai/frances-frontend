import {useEffect, useRef} from "react";
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

function MapForDescription(props) {
    const mapRef = useRef(null);
    const map = useRef(null);
    const popupRef = useRef(null); // Ref for popup container
    const { locations, focused_location } = props
    const zoom = 5;
    const apiKey = config.OPENLAYER_API_KEY;

    useGeographic();

    useEffect(() => {
        // Define tile sources
        const osmLayer = new TileLayer({
            source: new OSM(),
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
        const lowZoomLayer = new TileLayer({
            source: sourceLowZoom,
            visible: true, // Default visibility for low zoom
        });

        const highZoomLayer = new TileLayer({
            source: sourceHighZoom,
            visible: false, // Initially hidden, only visible at high zoom
        });

        // Define vector source and layer
        const vectorSource = new VectorSource();

        const markerLayer = new VectorLayer({
            source: vectorSource,
        });

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
                        anchor: [0.5, 1], // Center bottom of the icon
                        scale: 0.05, // Adjust size
                        src: mapMarker,
                        crossOrigin: 'anonymous',
                        color: 'rgba(0,217,255,0.5)',
                    }),
                })
            );

            vectorSource.addFeature(feature);
        });

        // Create map
        map.current = new Map({
            layers: new LayerGroup({
                layers: [osmLayer,  markerLayer],
            }),
            target: mapRef.current,
            view: new View({
                center: [focused_location.long, focused_location.lat],
                zoom: zoom,
            }),
        });

        // Change visibility based on zoom
        map.current.getView().on("change:resolution", () => {
            const currentZoom = map.current.getView().getZoom();
            //console.log("Current Zoom Level:", currentZoom);
            if (currentZoom <= 14) {
                lowZoomLayer.setVisible(true);
                highZoomLayer.setVisible(false);
            } else {
                lowZoomLayer.setVisible(false);
                highZoomLayer.setVisible(true);
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

        return () => map.current.setTarget(null);
    }, []);

    useEffect(() => {
        map.current.getView().setCenter([focused_location.long, focused_location.lat]);
    }, [focused_location]);

    return (
        <div>
            <div ref={mapRef} className="map"></div>
            <div ref={popupRef} className="popup-container" style={{display: "none", position: "absolute"}}></div>
        </div>

    )
}

export default MapForDescription;