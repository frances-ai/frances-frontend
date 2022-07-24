import React, {useState} from "react";
import {
    Button,
    Container,
    createTheme,
    CssBaseline,
    Divider, Grid, Link, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Header from "../components/header";
import Box from "@mui/material/Box";
import QueryAPI from "../apis/query"
import {Search} from "@mui/icons-material";
import TextMoreLess from "../components/textMoreLess";
import Copyright from "../components/copyright";

const theme = createTheme({
    palette: {
        white: {
            main: '#ffffff',
            contrastText: '#000000',
        },
    }
});

function TermSearchResult(props) {
    const [currentResult, setCurrentResult] = useState(props.result);

    console.log(currentResult);

    const findTopicModelID = (model) => {
        const index = model.indexOf('_');
        return model.substring(0, index);
    }

    const handPageChange = (event, newPage) => {
        QueryAPI.searchTerm(currentResult?.result?.term, newPage + 1).then(response => {
            const result = response?.data;
            setCurrentResult({result});
        })
    }

    return (
        <Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Results for <b>{currentResult.result.term}</b>
            </Typography>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Note that if you click over a <b>related term</b> , it will conduct a <b>term search</b>, showing
                all the searching results for that term. And if you click over a <b>topic model id</b> if will take
                you to the <b>Topic Modelling page</b>, listing all the terms belonging to that particular topic model.
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="term search result table">
                    <TableHead>
                        <TableRow>
                            {
                                currentResult.result.headers.map((header) => (
                                    <TableCell key={header}>{header}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            Object.keys(currentResult.result.results).map((key) => (
                                <TableRow
                                    key={key}
                                >
                                    <TableCell align={"center"}>{currentResult.result.results[key][0]}</TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][1]}</TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][2]}</TableCell>
                                    <TableCell align={"center"}>
                                        <Link href={currentResult.result.results[key][3][0]}>
                                            {currentResult.result.results[key][3][1]}
                                        </Link>
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <Link href={currentResult.result.results[key][4][0]}>
                                            {currentResult.result.results[key][4][1]}
                                        </Link>
                                    </TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][5]}</TableCell>
                                    <TableCell align={"left"}>
                                        <TextMoreLess text={currentResult.result.results[key][6]} width={250}/>
                                    </TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][7]}</TableCell>
                                    <TableCell align={"center"}>
                                        {findTopicModelID(currentResult.result.results[key][8])}
                                    </TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][9]}</TableCell>
                                    <TableCell align={"center"}>
                                        <Button>
                                            Visualise
                                        </Button>
                                        <Button>
                                            Check Spell
                                        </Button>
                                        <Button>
                                            Similar Terms
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions = {[currentResult.result.pagination.perPage]}
                rowsPerPage={currentResult.result.pagination.perPage}
                count={currentResult.result.pagination.total}
                page={currentResult.result.pagination.page -1}
                onPageChange={handPageChange}
            />
        </Box>
    )
}

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