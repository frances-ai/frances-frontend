import {
    Button,
    CircularProgress,
    Container,
    Divider,
    Grid, Link, Paper,
    Stack,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import DownloadIcon from '@mui/icons-material/Download';

function DefoeQueryResult() {

    const taskID = useLocation().state.taskId;
    const [status, setStatus] = useState();
    const [result, setResult] = useState();
    // Summary of this task, including config data, and submit time.
    const [task, setTask] = useState();


    useEffect(() => {
        console.log('mounting');

        QueryAPI.getDefoeQueryTaskByTaskID(taskID).then((response) => {
            console.log('get task summary')
            console.log(response?.data);
            setTask(response?.data?.task);
        })

        const checkStatus = () => {
            if (taskID !== "") {
                if (status === undefined || !status.done) {
                    console.log('check status!');
                    QueryAPI.getDefoeQueryStatus(taskID).then((r) => {
                        console.log(r);
                        if (r.data.done) {
                            console.log('done');
                            clearInterval(timerID);
                        }
                        setStatus(r.data);
                    });
                }
            }
        }
        const timerID = setInterval(checkStatus, 10000);
        checkStatus();

        // Stop checking status when page closed
        return () => {
            clearInterval(timerID);
        }
    }, [])

    useEffect(() => {
        if (status !== undefined && status.done) {
            if (status.results !== undefined && status.results !== "") {
                const result_filepath = status.results;
                console.log("result file path %s", result_filepath);
                QueryAPI.getDefoeQueryResult(result_filepath).then((response) => {
                    console.log("Get data from the result file");
                    console.log(response?.data);
                    setResult(response?.data?.results);
                });
            }
        }
    }, [status])


    function Task() {
        return (
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                        Collection:
                    </Typography>
                    <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                        {task.config.collection}
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                        Query Type:
                    </Typography>
                    <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                        {task.config.queryType}
                    </Typography>
                </Grid>
                {
                    ("publication_normalized" !== task.config.queryType) ?
                        <React.Fragment>
                            <Grid item xs={6}>
                                <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                    Preprocess:
                                </Typography>
                                <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                    {task.config.preprocess}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                    HitCount:
                                </Typography>
                                <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                    {task.config.hitCount}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                    Target Sentences:
                                </Typography>
                                <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                    {task.config.targetSentences}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                    Target filter (any | all):
                                </Typography>
                                <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                    {
                                        (task.config.targetFilter === 'or') ? 'any' : 'all'
                                    }
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                    Year range:
                                </Typography>
                                <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                    {
                                        task.config.startYear + ' - ' + task.config.endYear
                                    }
                                </Typography>
                            </Grid>
                        </React.Fragment>
                        : null
                }
                <Grid item xs={6}>
                    <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                        Submitted time:
                    </Typography>
                    <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                        {task.submit_time}
                    </Typography>
                </Grid>
            </Grid>
        )
    }

    function PublicationNormalisedResult() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Year</TableCell>
                            <TableCell align="right">Volumes</TableCell>
                            <TableCell align="right">Pages</TableCell>
                            <TableCell align="right">Words</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(result).map((value, key) => (
                            <TableRow
                                key={key}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {value}
                                </TableCell>
                                <TableCell align="right">{result[value][0]}</TableCell>
                                <TableCell align="right">{result[value][1]}</TableCell>
                                <TableCell align="right">{result[value][2]}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    function FrequencyKeySearchByYearResult() {
        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="frequency_keysearch_by_year result table" stripe="2n">
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={1} align={"center"}>Year</TableCell>
                            <TableCell align={"center"}>Lexicon</TableCell>
                            <TableCell align={"center"}>Frequency</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(result).map((value, key) => (
                            result[value].map((record, index) => (
                                <TableRow key={'' + key + index}>
                                    {
                                        (index == 0) ? <TableCell align={"center"} colSpan={1} rowSpan={result[value].length}>{value}</TableCell> : null
                                    }
                                    <TableCell align={"center"} rowSpan={1}>{record[0]}</TableCell>
                                    <TableCell align={"center"} rowSpan={1}>{record[1]}</TableCell>
                                </TableRow>
                            ))
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }

    function download(resultFilePath) {
        let fileName = task.config.lexiconFile;
        if (fileName === '' || fileName.substring(fileName.length - 3) !== 'txt') {
            fileName = resultFilePath.split('\\').pop().split('/').pop();
        }
        const downloadFileName = fileName.substring(0, fileName.length - 4) + '_result.yml';
        QueryAPI.download(resultFilePath, downloadFileName);
    }


    function DefoeResultTable() {
        switch (task.config.queryType) {
            case "publication_normalized":
                console.log("Here in publication_normalized!");
                return <PublicationNormalisedResult/>
            case "frequency_keysearch_by_year":
                return <FrequencyKeySearchByYearResult/>
            case "terms_fulltext_keysearch_by_year":
                break;
            case "uris_keysearch":
                break;
            case "terms_snippet_keysearch_by_year":
                break;
            default:
                return (<Box>
                    No Such Query Type!
                </Box>)
        }

    }

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                Defoe Queries
            </Typography>
            <Divider/>
            {
                (task !== undefined)?
                    (<Box mt={5} mb={5}>
                        {Task()}
                        <Stack direction="row" spacing={3} mt={5} justifyContent={"center"}>
                            <Button variant="outlined" href={"/defoeQuery"}>
                                Create another query
                            </Button>
                            <Button variant="contained" href={"/defoeQueryTasks"}>
                                Check all query tasks
                            </Button>
                        </Stack>
                    </Box>)
                    : null
            }
            <Divider/>
            {
                (result === undefined) ?
                    <CircularProgress/> :
                    <Box>
                        <Stack direction={"row"} sx={{mt: 5, mb: 3}} alignItems="baseline" justifyContent="space-between">
                            <Typography component={"div"} gutterBottom variant="h5" >
                                Result
                            </Typography>
                            <Button variant="outlined" startIcon={<DownloadIcon/>} onClick={() => download(task?.resultFile)}>
                                Download
                            </Button>
                        </Stack>
                        {DefoeResultTable()}
                    </Box>
            }
        </Container>
    )

}

export default DefoeQueryResult;