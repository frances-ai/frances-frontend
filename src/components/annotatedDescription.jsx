import PropTypes from "prop-types";
import {Link, Typography} from "@mui/material";
import React from "react";
import Box from "@mui/material/Box";
import MapForDescription from "./maps/mapForDescription.jsx";

function AnnotatedDescriptionWithMap(props) {
    const { description, locations } = props;
    const location_highlighted_style = {
        fontWeight: "bold",
        backgroundColor: "rgba(0,217,255,0.5)"
    }
    const [clickedIndex, setClickedIndex] = React.useState(0);
    const [focusLocationIndex, setFocusLocationIndex] = React.useState(0);

    const findLocationIndex = (location_uri) => {
        console.log(location_uri);
        for (const location_index in locations) {
            if (location_uri === locations[location_index].uri) {
                return location_index;
            }
        }
        return -1;
    }

    const findFocusLocationIndex = (location_uri) => {
        let location_index = findLocationIndex(location_uri);
        if (location_index === -1) {
            location_index = 0;
        }
        return location_index;
    }

    function hasCoordinates(desc_index) {
        const location_index = findLocationIndex(description[desc_index].uri)
        return location_index > -1;
    }

    function handleLocationClick (event, index)  {
        setClickedIndex(index);
        const new_focused_location_index = findFocusLocationIndex(description[index].uri)
        setFocusLocationIndex(new_focused_location_index);
        console.log("location clicked!");
        console.log(index);
        console.log(new_focused_location_index);
    }

    return (
        <>
            <Box sx={{maxHeight: 700, overflowY: "scroll"}} p={2}>
                {
                    description.map((chunk, index) =>
                        {
                            return chunk.type === "location"?
                                <Link
                                    key={index}
                                    component="button"
                                    onClick={ (event) => handleLocationClick(event, index)}
                                    underline="none"
                                    disabled={!hasCoordinates(index)}
                                    variant="body2"
                                    style={clickedIndex === index ? location_highlighted_style : null}
                                >
                                    {chunk.value}
                                </Link>
                                :
                                <Typography
                                    key={index}
                                    component="span"
                                    variant="body2"
                                >
                                    {chunk.value}
                                </Typography>

                        }
                    )
                }
            </Box>
            {
                locations.length > 0 ?
                    <MapForDescription
                        locations={locations}
                        focused_location={locations[focusLocationIndex]}
                    />
                    : null
            }
        </>
    )
}

AnnotatedDescriptionWithMap.propTypes = {
    description: PropTypes.arrayOf(PropTypes.shape({
        type: PropTypes.string.isRequired,
        uri: PropTypes.string,
        value: PropTypes.string.isRequired,
    })).isRequired
}

export default AnnotatedDescriptionWithMap;