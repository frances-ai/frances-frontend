import React, {useState} from "react";
import {Container, Divider, Grid, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import {Search} from "@mui/icons-material";
import TermSimilarityResult from "../components/termSimilarityResult";
import QueryAPI from "../apis/query";

function TermSimilarityPage() {
    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState();
    const [searchText, setSearchText] = useState();

    const handleSearchSubmit = (event) => {
        setIsSearching(true);
        event.preventDefault();
        const text = new FormData(event.currentTarget).get("text");
        setSearchText(text);
        console.log(text);
        QueryAPI.searchSimilarTerms(text).then(response => {
            const result = response?.data;
            setSearchResult({result})
            setIsSearching(false);
        })
    }

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
            <Box component="form" onSubmit={handleSearchSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            id="text"
                            fullWidth
                            label="Place some text"
                            name="text"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <LoadingButton
                            type="submit"
                            variant="contained"
                            loading={isSearching}
                        >
                            <Search sx={{fontSize: 32}}/>
                        </LoadingButton>
                    </Grid>
                </Grid>
            </Box>

            {/* Search Result */}
            {
                !isSearching && searchResult?
                    <TermSimilarityResult result={searchResult} uri_or_text={searchText}/> :
                    null
            }
        </Container>
    )
}

export default TermSimilarityPage;