import React from "react";
import {Container, createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import Header from "../components/header";

const theme = createTheme();

function PrivatePage() {

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header index={0}/>
            <Container maxWidth="xl">
                Private Page
            </Container>
        </ThemeProvider>
    )
}

export default PrivatePage;