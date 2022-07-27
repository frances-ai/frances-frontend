import React, {useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Breadcrumbs, Button, CircularProgress, Container, Divider, Typography} from "@mui/material";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import TermSearchResult from "../components/termSearchResult";
import VisualisationResult from "../components/visualisationResult";
import TermSimilarityResult from "../components/termSimilarityResult";
import TopicModellingResult from "../components/topicModellingResult";

function ResultPage() {

    const location = useLocation();
    const navigate = useNavigate();
    const noResult = location.state === null;
    const [isLoading, setIsLoading] = useState(true);
    const [bufLocation, setBufLocation] = useState(location);
    const [searchResult, setSearchResult] = useState();
    const navStack = location.state?.navStack;
    const currentParameters = location.state?.to;
    if (location !== bufLocation) {
        setBufLocation(location);
        setIsLoading(true);
    }
    console.log(location);
    console.log(bufLocation);
    console.log(searchResult);

    useEffect(() => {
        setIsLoading(true);
        if (noResult) {
            setIsLoading(false);
        } else {
            const type = currentParameters.type;
            const key = currentParameters.key;
            const page = currentParameters.page ? currentParameters.page : 1;
            console.log('Check type')
            switch (type) {
                // TODO Save Search in Local Storage to get previous result quicker.
                case 'TermSearch':
                    console.log('Term Search')
                    QueryAPI.searchTerm(key, page).then(response => {
                        const result = response?.data;
                        setSearchResult({result})
                        setIsLoading(false);
                    })
                    break;
                case 'TermSimilarity':
                    QueryAPI.searchSimilarTerms(key, page).then(response => {
                        const result = response?.data;
                        setSearchResult({result})
                        setIsLoading(false);
                    })
                    break;
                case 'TopicModelling':
                    QueryAPI.searchTopicModels(key, page).then(response => {
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
                                            {nav.name}
                                        </Button>
                                    ))}
                                    <Typography color="text.primary">
                                        {currentParameters.name}
                                    </Typography>
                                </Breadcrumbs>
                                <Divider />
                                {
                                    currentParameters.type === 'TermSearch'?
                                        <TermSearchResult result={searchResult}/> :
                                        null
                                }
                                {
                                    currentParameters.type === 'TermSimilarity'?
                                        <TermSimilarityResult result={searchResult} uri_or_text={currentParameters.key}/> :
                                        null
                                }
                                {
                                    currentParameters.type === 'TopicModelling'?
                                        <TopicModellingResult result={searchResult}/> :
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