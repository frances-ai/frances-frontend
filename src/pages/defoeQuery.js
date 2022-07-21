import React from "react";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "../components/header";

const theme = createTheme();

function DefoeQueryPage() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header index={3}/>
            <Container maxWidth="xl">
                Defoe Query
            </Container>
        </ThemeProvider>
    )
}

export default DefoeQueryPage;