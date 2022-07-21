import React from "react";
import {Container, createTheme, CssBaseline, Divider, ThemeProvider, Typography} from "@mui/material";
import Header from "../components/header";

const theme = createTheme();

function TermSearchPage() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header index={0}/>
            <Container maxWidth="lg" sx={{mt: 2}}>
                <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                    Exploring the Encyclopaedia Britannica (1768-1860)
                </Typography>
                <Typography component="div" gutterBottom variant="h5" sx={{mt: 5}}>
                    Term Search
                </Typography>
                <Divider/>
                <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                    Enter <b>some text</b> that you would like to search similar terms for. If not term is introduced,
                    it will search for the first term in the Encyclopaedia.
                </Typography>
            </Container>
        </ThemeProvider>
    )
}

export default TermSearchPage