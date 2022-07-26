import React from "react";
import {Container, Divider, Typography} from "@mui/material";

function TermSimilarityPage() {

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                Exploring the Encyclopaedia Britannica (1768-1860)
            </Typography>
            <Typography component="div" gutterBottom variant="h5" sx={{mt: 5}}>
                Term Similarity
            </Typography>
            <Divider/>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Enter <b>some text</b> that you would like to search similar terms for. If not term is introduced,
                it will search for the first term in the Encyclopaedia.
            </Typography>

        </Container>
    )
}

export default TermSimilarityPage;