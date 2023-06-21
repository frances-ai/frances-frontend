import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
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
import TermSearchButton from "./buttons/termSearchButton";
import VisualiseButton from "./buttons/visualiseButton";
import SimilarTermsButton from "./buttons/similarTermsButton";
import Plot from "react-plotly.js";
import QueryAPI from "../apis/query";
import {findTopicModelID} from "../utils/stringUtil";
import CheckSpellButton from "./buttons/checkSpellButton";

function TopicModellingResult(props) {

    const originResult = props.result;
    const [currentResult, setCurrentResult] = useState(originResult);
    const [currentSearchInfo, setCurrentSearchInfo] = useState();
    const collection = "Encyclopaedia Britannica";
    const headers = [
        'Year', 'Edition', 'Volume', 'Term', 'Definition', 'Sentiment Score', 'Advanced Options'
    ]

    console.log(currentResult);

    useEffect(() => {
        const modelID = findTopicModelID(currentResult.result.topic_name);
        setCurrentSearchInfo({
            type: 'TopicModelling',
            key: currentResult.result.topic_name,
            page: currentResult.result.pagination.page,
            name: 'TopicModelling(' + modelID + ')'
        });
    }, [currentResult])

    const handPageChange = (event, newPage) => {
        QueryAPI.searchTopicModels(currentResult?.result?.term, newPage + 1).then(response => {
            const result = response?.data;
            setCurrentResult({result});
        })
    }

    return (
        <Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                <b>{currentResult.result.num_results}</b> terms found for the topic
                <b>{currentResult.result.topic_name}</b>
            </Typography>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Note that if you instead click over a <b>term</b>, it will take you to the <b>Term Search page</b>,
                showing all the searching results for that term.
            </Typography>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 800 }} aria-label="topic modelling result table">
                    <TableHead>
                        <TableRow>
                            {
                                headers.map((header) => (
                                    <TableCell
                                        align={header === 'Definition'? "left" : "center"}
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
                                    <TableCell align={"center"}>{currentResult.result.results[key][5]}</TableCell>
                                    <TableCell align={"center"}>
                                        <Stack>
                                            <VisualiseButton
                                                uri={key}
                                                collection={collection}
                                            >
                                                Visualise
                                            </VisualiseButton>
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
                count={currentResult.result.num_results}
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

        </Box>
    )
}

export default TopicModellingResult;