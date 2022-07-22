import React, {useState} from "react";
import {
    Button, CircularProgress,
    Container,
    createTheme,
    CssBaseline,
    Divider, Grid,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Header from "../components/header";
import Box from "@mui/material/Box";
import QueryAPI from "../apis/query"
import {Search} from "@mui/icons-material";

const theme = createTheme();

function TermSearchPage() {

    const [isSearching, setIsSearching] = useState(false);
    const [searchResult, setSearchResult] = useState();

    const handleSearchSubmit = (event) => {
        setIsSearching(true);
        event.preventDefault();
        const term = new FormData(event.currentTarget).get("term");
        console.log(term);
        QueryAPI.searchTerm(term).then(response => {
            const result = response?.data;
            console.log(result);
            setIsSearching(false);
            setSearchResult({result})
        })
    }

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
                    Enter the <b>term</b> that you would like to search for. In case that the <b>Term Type is a Topic</b>, only
                    the <b>summary</b> of the definition is displayed. If not term is introduced, it will search for the first
                    term in the Encyclopaedia.
                </Typography>

                <Box component="form" onSubmit={handleSearchSubmit} noValidate sx={{ mt: 1 }}>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                margin="normal"
                                id="term"
                                fullWidth
                                label="Search Term"
                                name="term"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Button
                                type="submit"
                                variant="contained"
                            >
                                {isSearching? <CircularProgress size={32}/> : <Search sx={{fontSize: 32}}/>}
                            </Button>
                        </Grid>
                    </Grid>
                </Box>

                {/* Search Result */}
                {searchResult? searchResult.term : <div></div>}
            </Container>
        </ThemeProvider>
    )
}

export default TermSearchPage