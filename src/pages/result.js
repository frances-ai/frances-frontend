import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumbs, Button, CircularProgress, Container, Divider, Typography} from "@mui/material";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import TermSearchResult from "../components/termSearchResult";
import VisualisationResult from "../components/visualisationResult";

function ResultPage() {

    const location = useLocation();
    const navigate = useNavigate();
    const noResult = location.state === null;
    const [isLoading, setIsLoading] = useState(true);
    const [searchResult, setSearchResult] = useState();
    const navStack = location.state?.navStack;
    const currentParameters = location.state?.to;
    console.log(location);

    useEffect(() => {
        setIsLoading(true);
        if (noResult) {
            setIsLoading(false);
        } else {
            const type = currentParameters.type;
            switch (type) {
                case 'TermSearch':
                    const term = currentParameters.key;
                    const page = currentParameters.page ? currentParameters.page : 1;
                    console.log(term);
                    QueryAPI.searchTerm(term, page).then(response => {
                        const result = response?.data;
                        setSearchResult({result})
                        setIsLoading(false);
                    })
                    break;
                case 'Visualisation':
                    console.log('Visual');
                    setIsLoading(false);
                    break;
            }
        }
    }, [location])

    const handleStackClick = (index) => {
        const to = navStack[index];
        navStack.splice(index);
        navigate("/result", {state: {to: to, navStack: navStack}});
    }

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            {
                isLoading ?
                    <CircularProgress /> :
                    noResult ?
                        'No Result!':
                        (
                            <Box>
                                <Breadcrumbs separator="›" aria-label="track" sx={{mb: 1}}>
                                    {navStack.map((nav, index) => (
                                        <Button
                                            onClick={() => handleStackClick(index)}
                                            key={index}
                                            sx={{textTransform: 'none'}}
                                        >
                                            {nav.type + '(' + nav.key + ')'}
                                        </Button>
                                    ))}
                                    <Typography color="text.primary">
                                        {currentParameters.type + '(' + currentParameters.key + ')'}
                                    </Typography>
                                </Breadcrumbs>
                                <Divider />
                                {
                                    currentParameters.type === 'TermSearch'?
                                        <TermSearchResult result={searchResult}/> :
                                        null
                                }
                                {
                                    currentParameters.type === 'Visualisation'?
                                        <VisualisationResult/> :
                                        null
                                }
                            </Box>
                        )
            }
        </Container>
    )
}

export default ResultPage;