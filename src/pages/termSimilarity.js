import React from "react";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "../components/header";

const theme = createTheme();

function TermSimilarityPage() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header index={1}/>
            <Container maxWidth="xl">
                Term Similarity
            </Container>
        </ThemeProvider>
    )
}

export default TermSimilarityPage;