import React, {useState} from 'react'
import {Container, Divider, Grid, TextField, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import LoadingButton from "@mui/lab/LoadingButton";
import {Search} from "@mui/icons-material";
import QueryAPI from "../apis/query";
import TopicModellingResult from "../components/topicModellingResult";

function TopicModellingPage() {

    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState();

    const handleSearchSubmit = (event) => {
        setIsSearching(true);
        event.preventDefault();
        const model = new FormData(event.currentTarget).get("model");
        console.log(model);
        QueryAPI.searchTopicModels(model).then(response => {
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
                Topic Modelling Search
            </Typography>
            <Divider/>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Enter a <b>topic name</b> or just the <b>ID</b> of a topic model to see all the
                terms within the same topic. All topics modelling names start with a number. If not topic is introduced.
                it will use the first topic modelling, which name starts with '0'.
            </Typography>

            <Box component="form" onSubmit={handleSearchSubmit} noValidate sx={{ mt: 1 }}>
                <Grid container spacing={2} alignItems={"center"}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            margin="normal"
                            id="model"
                            fullWidth
                            label="Topic Name or ID"
                            name="model"
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
                    <TopicModellingResult result={searchResult}/> :
                    null
            }
        </Container>
    )
}

export default TopicModellingPage;