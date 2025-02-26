import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import config from "../../config.json"
import "./basicMap.css"
mapboxgl.accessToken = config.MAPBOX_ACCESS_TOKEN;

function BasicMap(props) {
    const mapContainerRef = useRef(null);
    const {coordinates, popupHtml} = props;


    // Initialize map when component mounts
    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [coordinates[0], coordinates[1]],
            zoom: 8
        });

        // create the popup
        const popup = new mapboxgl.Popup({ offset: 20, className: 'pop-up'})
            .setHTML(popupHtml);


        // Create the marker
        new mapboxgl.Marker()
            .setLngLat(coordinates)
            .setPopup(popup) // sets a popup on this marker
            .addTo(map)

        // Add navigation control (the +/- zoom buttons)
        map.addControl(new mapboxgl.NavigationControl(), 'top-right');


        // Clean up on unmount
        return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="map-container" ref={mapContainerRef} />
    );
}

export default BasicMap