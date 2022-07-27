import React, {useEffect, useState} from 'react';
import {
    Button,
    Link,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow,
    Typography
} from "@mui/material";
import TextMoreLess from "./textMoreLess";
import Box from "@mui/material/Box";
import Plot from "react-plotly.js";
import QueryAPI from "../apis/query";
import TermSearchButton from "./buttons/termSearchButton";
import SimilarTermsButton from "./buttons/similarTermsButton";
import VisualiseButton from "./buttons/visualiseButton";
import TopicModelButton from "./buttons/topicModelButton";
import {findTermLinkFromUri} from "../utils/stringUtil";

function TermSimilarityResult(props) {
    const originResult = props.result;
    const uri_or_text = props.uri_or_text;
    //TODO Sort result
    const [currentResult, setCurrentResult] = useState(originResult);
    const [currentSearchInfo, setCurrentSearchInfo] = useState();
    const headers = [
        'Yeah', 'Edition', 'Volume', 'Term', 'Definition',
        'Topic Modelling ID', 'Similitud rank', 'Sentiment Score', 'Advanced Options'
    ]

    useEffect(() => {
        const text = uri_or_text.includes("https://") ? findTermLinkFromUri(uri_or_text) : uri_or_text;
        setCurrentSearchInfo({
            type: 'TermSimilarity',
            key: uri_or_text,
            page: currentResult.result.pagination.page,
            name: 'TermSimilarity(' + text + ')'
        });
    }, [currentResult])

    console.log(currentResult);

    const handPageChange = (event, newPage) => {
        QueryAPI.searchSimilarTerms(currentResult?.result?.term, newPage + 1).then(response => {
            const result = response?.data;
            setCurrentResult({result});
        })
    }

    return (
        <Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                The first <b>20</b> most similar results. The result are sorted by <b>similitud rank</b>.
            </Typography>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Note that if you click over a <b>related term</b> , it will conduct a <b>term search</b>, showing
                all the searching results for that term. And if you click over a <b>topic model id</b> if will take
                you to the <b>Topic Modelling page</b>, listing all the terms belonging to that particular topic model.
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="term similarity result table">
                    <TableHead>
                        <TableRow>
                            {
                                headers.map((header) => (
                                    <TableCell align={"center"} key={header}>{header}</TableCell>
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
                                    <TableCell align={"center"}>{currentResult.result.results[key][1]}</TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][0]}</TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][2]}</TableCell>
                                    <TableCell align={"center"}>
                                        <TermSearchButton
                                            term={currentResult.result.results[key][3]}
                                            currentSearchInfo={currentSearchInfo}
                                        />

                                    </TableCell>
                                    <TableCell align={"left"}>
                                        <TextMoreLess text={currentResult.result.results[key][4]} width={250}/>
                                    </TableCell>
                                    <TableCell align={"center"}>
                                        <TopicModelButton
                                            model_name={currentResult.result.results[key][5]}
                                            currentSearchInfo={currentSearchInfo}
                                        />
                                    </TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][6]}</TableCell>
                                    <TableCell align={"center"}>{currentResult.result.results[key][7]}</TableCell>
                                    <TableCell align={"center"}>
                                        <Stack>
                                            <VisualiseButton
                                                uri={key}
                                                currentSearchInfo={currentSearchInfo}
                                            />
                                            <Button>
                                                Check Spell
                                            </Button>
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

export default TermSimilarityResult;