import React, {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import {
    Link,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import TextMoreLess from "./textMoreLess";
import Plot from "react-plotly.js";
import TermSearchButton from "./buttons/termSearchButton";
import SimilarTermsButton from "./buttons/similarTermsButton";
import VisualiseButton from "./buttons/visualiseButton";
import TopicModelButton from "./buttons/topicModelButton";
import CheckSpellButton from "./buttons/checkSpellButton";

function DefoeResult(props) {
    const result = props.result;
    // const [currentResult, setCurrentResult] = useState(originResult);
    // const [currentSearchInfo, setCurrentSearchInfo] = useState();
    // const headers = [
    //     'Yeah', 'Edition', 'Volume', 'Start Page', 'End Page', 'Term Type',
    //     'Definition / Summary', 'Related Terms', 'Topic Modelling ID', 'Sentiment Score', 'Advanced Options'
    // ]

    console.log(result);

    // useEffect(() => {
    //     setCurrentSearchInfo({
    //         type: 'TermSearch',
    //         key: currentResult.result.term,
    //         page: currentResult.result.pagination.page,
    //         name: 'TermSearch('+ currentResult.result.term + ')'
    //     });
    // }, [currentResult])


    // const handPageChange = (event, newPage) => {
    //     QueryAPI.searchTerm(currentResult?.result?.term, newPage + 1).then(response => {
    //         const result = response?.data;
    //         setCurrentResult({result});
    //     })
    // }

    return (
        <Box>
            Defoe Result
            <div>
                result
            </div>
        </Box>
    )
}

export default DefoeResult;