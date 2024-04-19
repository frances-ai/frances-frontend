import Box from "@mui/material/Box";
import {Button, Container, Grid, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {Search} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";

function SearchPage() {

    const navigate = useNavigate();
    const [searchType, setSearchType] = useState("full_text");


    const handleSearchSubmit = (event) => {
        event.preventDefault();
        const keyword = new FormData(event.currentTarget).get("keyword");
        navigate("/searchResult", {state: {keyword: keyword, search_type: searchType}});
    }


    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h2" sx={{mt: 10}} textAlign={"center"}>
                Explore the digital textual heritage
            </Typography>

            <Box component="form" onSubmit={handleSearchSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems={"center"}>
                    <Grid item sm={6}>
                        <TextField
                            margin="normal"
                            id="keyword"
                            fullWidth
                            label={searchType==="full_text"? "Search for everything - Full Text Search" : "Search for everything - Semantic Search"}
                            name="keyword"
                        />
                    </Grid>
                    <Grid item sm={2}>
                        <Button
                            type="submit"
                            variant="contained"
                        >
                            <Search sx={{fontSize: 32}}/>
                        </Button>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ mt: 1 }}>
                <Grid container spacing={2} direction="row" justifyContent="center" alignItems={"center"}>
                    <Grid item sm={6} textAlign={"right"}>
                        {
                            searchType === "full_text" ? <Button onClick={() => setSearchType("semantic")}>
                                Semantic Search
                            </Button> : <Button onClick={() => setSearchType("full_text")}>
                                Full Text Search
                            </Button>
                        }
                    </Grid>
                    <Grid item sm={2}>
                    </Grid>
                </Grid>
            </Box>

        </Container>
    )
}

export default SearchPage;