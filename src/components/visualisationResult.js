import React from 'react'
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import {findTermLinkFromUri} from "../utils/stringUtil";

function VisualisationResult(props) {
    const result = props.result;

    return (
        <Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Visualisation RDF graph for the resource <b>{findTermLinkFromUri(result.result.uri)}</b>
            </Typography>
        </Box>
    )
}

export default VisualisationResult;