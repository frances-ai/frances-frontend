import SiteStats from "./siteStats";
import Copyright from "./copyright";
import React from "react";
import {Grid} from "@mui/material";

function Footer() {
    return (
        <>
            <Grid container spacing={1}
                  sx={{mt: 2, mb: 2, alignItems: "center"}}>
                <Grid item xs={6} md={4}>
                    <SiteStats/>
                </Grid>
                <Grid item xs={6} md={4}>
                    <Copyright color={'text.secondary'}/>
                </Grid>
            </Grid>
        </>
    )
}
export default Footer;