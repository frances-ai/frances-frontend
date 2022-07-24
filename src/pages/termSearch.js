import React, {useState} from "react";
import {
    Container,
    createTheme,
    CssBaseline,
    Divider, Grid,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Header from "../components/header";
import Box from "@mui/material/Box";
import QueryAPI from "../apis/query"
import {Search} from "@mui/icons-material";
import Copyright from "../components/copyright";
import TermSearchResult from "../components/termSearchResult";

const theme = createTheme({
    palette: {
        white: {
            main: '#ffffff',
            contrastText: '#000000',
        },
    }
});

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
            setSearchResult({result})
            setIsSearching(false);
        })
    }

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header index={0}/>
            <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
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
                        <TermSearchResult result={searchResult}/> :
                        null
                }
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    )
}

export default TermSearchPage