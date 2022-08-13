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

function TermSearchResult(props) {
    const originResult = props.result;
    const [currentResult, setCurrentResult] = useState(originResult);
    const [currentSearchInfo, setCurrentSearchInfo] = useState();
    const headers = [
        'Yeah', 'Edition', 'Volume', 'Start Page', 'End Page', 'Term Type',
        'Definition / Summary', 'Related Terms', 'Topic Modelling ID', 'Sentiment Score', 'Advanced Options'
    ]

    console.log(currentResult);

    useEffect(() => {
        setCurrentSearchInfo({
            type: 'TermSearch',
            key: currentResult.result.term,
            page: currentResult.result.pagination.page,
            name: 'TermSearch('+ currentResult.result.term + ')'
        });
    }, [currentResult])


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
                                headers.map((header) => (
                                    <TableCell
                                        align={header === 'Definition / Summary'? "left" : "center"}
                                            key={header}
                                    >
                                        {header}
                                    </TableCell>
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
                                    <TableCell align={"center"}>
                                        <Stack spacing={1}>
                                            {
                                                currentResult.result.results[key][7].map((item) => (
                                                    <TermSearchButton
                                                        key={item}
                                                        term={item}
                                                        currentSearchInfo={currentSearchInfo}
                                                    />
                                                ))
                                            }
                                        </Stack>
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <TopicModelButton
                                            model_name={currentResult.result.results[key][8]}
                                            currentSearchInfo={currentSearchInfo}
                                        />
                                    </TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][9]}</TableCell>
                                    <TableCell align={"center"}>
                                        <Stack>
                                            <VisualiseButton
                                                uri={key}
                                                currentSearchInfo={currentSearchInfo}
                                            />
                                            <CheckSpellButton
                                                uri={key}
                                                currentSearchInfo={currentSearchInfo}
                                            />
                                            <SimilarTermsButton
                                                resource_uri={key}
                                                currentSearchInfo={currentSearchInfo}
                                            />
                                        </Stack>
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
            {
                currentResult.result.bar_plot?
                    <Box>
                        <Typography component="div" gutterBottom variant="h5" sx={{mt: 2}}>
                            Topic Modelling Visualisations
                        </Typography>
                        <Paper sx={{mt: 2, pt: 2, pl: 2, pr: 2}} elevation={4}>
                            <Typography component="div" gutterBottom variant="body1">
                                We are visualising each topic model found in our term-search. For each topic model,
                                we plot their most common 10 words , along with their {'\u00A0'}
                                <Link href={'https://maartengr.github.io/BERTopic/api/ctfidf.html'}>c-TF-IDF scores</Link>.
                            </Typography>
                            <Typography component="div" gutterBottom variant="body1">
                                Note that the topic that starts with "-1" refers to all outliers and should typically
                                be ignored
                            </Typography>
                            <Plot
                                data={currentResult.result.bar_plot.data}
                                layout={currentResult.result.bar_plot.layout}
                            />
                        </Paper>
                    </Box> :
                    null
            }
            {
                currentResult.result.heatmap_plot?
                    <Paper sx={{mt: 2, pt: 2, pl: 2, pr: 2}} elevation={4}>
                        <Typography component="div" gutterBottom variant="body1">
                            We are also going to visualize how similar each topic model is to each other.
                        </Typography>
                        <Plot
                            data={currentResult.result.heatmap_plot.data}
                            layout={currentResult.result.heatmap_plot.layout}
                        />
                    </Paper> :
                    null
            }

        </Box>
    )
}

export default TermSearchResult;