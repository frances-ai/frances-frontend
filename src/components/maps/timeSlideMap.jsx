import React, {useEffect, useRef, useState} from "react";
import "./timeSlideMap.css"
import mapboxgl from "mapbox-gl";
import Box from "@mui/material/Box";
import Slider from '@mui/material/Slider';
import {IconButton, Paper, Stack} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestoreIcon from '@mui/icons-material/Restore';

function TimeSlideMap(props) {
    const {geoJson, years} = props;
    const mapContainerRef = useRef(null);
    const min_year = parseInt(years[0])
    const max_year= parseInt(years[years.length-1]);
    const [map, setMap] = useState();
    const [selectedYear, setSelectedYear] = useState(min_year);
    const intervalIdRef = useRef(0);
    const [isRunning, setIsRunning] = useState(false);

    const marks = years.map((year) => ({
        value: parseInt(year)
    }))

    function valuetext(value) {
        return `${value}`;
    }


    function filterBy(year, map) {
        if (map !== undefined) {
            const filters = ['==', 'Year', year + ""];
            map.setFilter('frequency-circles', filters);
            map.setFilter('frequency-labels', filters);
        }
    }

    // Initialize map when component mounts
    useEffect(() => {
        console.log("init");
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/light-v11',
            projection: 'winkelTripel',
            center: [0, 0],
            zoom: 1
        });

        map.on('load', () => {
            map.addSource('geo', {
                type: 'geojson',
                data: geoJson
            })

            map.addLayer({
                'id': 'frequency-circles',
                'type': 'circle',
                'source': 'geo',
                'paint': {
                    'circle-color': [
                        'interpolate',
                        ['linear'],
                        ['get', 'count'],
                        geoJson.metadata.min_frequency,
                        '#046ffa',
                        geoJson.metadata.max_frequency,
                        '#f1071b'
                    ],
                    'circle-opacity': 0.75,
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['get', 'count'],
                        geoJson.metadata.min_frequency,
                        10,
                        geoJson.metadata.max_frequency,
                        20
                    ]
                }
            });

            map.addLayer({
                'id': 'frequency-labels',
                'type': 'symbol',
                'source': 'geo',
                'layout': {
                    'text-field': ['concat', ['to-string', ['get', 'count']]],
                    'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
                    'text-size': 15
                },
                'paint': {
                    'text-color': 'rgba(0,0,0,0.5)'
                }
            });
            filterBy(selectedYear, map);
        })

        setMap(map);

        return () => map.remove();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (map !== undefined) {
            filterBy(selectedYear, map);
        }
        if (selectedYear === max_year) {
            setIsRunning(false);
        }

    }, [selectedYear])

    useEffect(() => {
        if (map !== undefined && isRunning) {
            console.log("play")
            intervalIdRef.current = setInterval(() => {
                console.log(selectedYear);
                if (selectedYear === max_year) {
                    setSelectedYear(min_year);
                } else {
                    setSelectedYear((year) =>  {
                        console.log(year);
                        return marks[marks.findIndex((mark) => mark.value === year) + 1].value
                    });
                }
            }, 1000);
        }
        return () => clearInterval(intervalIdRef.current);
    }, [isRunning])

    const handlePlayPauseClick = () => {
        if (!isRunning && selectedYear < max_year) {
            setIsRunning(true);
        } else {
            setIsRunning(false);
        }
    }

    return (
        <Box component={Paper} position={"relative"} width={"100%"} height={600}>
            <div className="map-container" ref={mapContainerRef} />
            <div className="title">Performances Places Frequency</div>
            <div className="frequency-side">
                <Stack direction={"row"} height={'100%'} spacing={1}>
                    <div className="frequency-bar"/>
                    <Stack direction={"column"} justifyContent={"space-between"}>
                        <div>{geoJson.metadata.max_frequency}</div>
                        <div>{Math.round(geoJson.metadata.max_frequency / 2)}</div>
                        <div>{geoJson.metadata.min_frequency}</div>
                    </Stack>
                </Stack>
            </div>
            <div className="slider-box">
                <Stack direction={"row"} spacing={2} alignItems="flex-start" justifyContent="center">
                    <IconButton color="primary" onClick={handlePlayPauseClick} >
                        {
                            isRunning?
                                <PauseIcon />
                                : <PlayArrowIcon />
                        }
                    </IconButton>
                    <IconButton color="secondary" onClick={() => setSelectedYear(min_year)}>
                        <RestoreIcon/>
                    </IconButton>
                    <Box className="slider">
                        <Slider
                            key={'time-slider'}
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            getAriaValueText={valuetext}
                            step={null}
                            valueLabelDisplay="auto"
                            marks={marks}
                            min={min_year}
                            max={max_year}
                        />
                    </Box>
                </Stack>
            </div>
        </Box>
    )
}

export default TimeSlideMap;