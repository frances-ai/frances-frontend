import {
    Button,
    Container,
    Divider, FormControl,
    Grid, Input, Link, Modal, Paper,
    Stack,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow, TextField,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom";
import React, {useEffect, useRef, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import DownloadIcon from '@mui/icons-material/Download';
import {getLexiconFileOriginalName, hto_uri_to_path} from "../utils/stringUtil";
import TextMoreLess from "../components/textMoreLess";
import Plot from "react-plotly.js";
import {
    get_plot_frequency_count_data,
    get_plot_normalized_frequency_count_data,
    get_plot_lexicon_diversity_year,
    get_plot_words_frequency, get_word_cloud_words_frequency
} from "../utils/plotUtil";
import BasicMap from "../components/maps/basicMap";
import GeoDataDeepVisualizeResult from "../components/geoDataDeepVisualizeResult";
import {
    countTotalYearRecords,
    countTotalYearSingleRowRecords,
    getPagingYearResult,
    getPagingYearSingleRowResult
} from "../utils/pagingUtil";
import LinearProgressWithLabel from "../components/linearProgressWithLabel";
import {getDisplayNameForGazetteer, getDisplayNameForHitCount, getDisplayNameForPreprocess} from "../apis/util";
import WordFrequencyDisplay from "../components/wordFrequencyDisplay";
import ReactWordcloud from "@cyberblast/react-wordcloud";
import FrequencyVisOptions from "../components/frequencyVisOptions";

export function Task(props) {
    const {task, showCollection, showQueryType, showSubmitTime, inputs} = props;
    const refined_inputs = inputs !== undefined? inputs : QueryAPI.getQueryMeta(task?.config?.collection)[task?.config?.queryType].inputs;

    function showConfig(config_name, config_value) {

        if (config_name in refined_inputs && (refined_inputs[config_name] != false)) {
            return true;
        }
        if ("filter" in refined_inputs && config_name in refined_inputs["filter"] && (config_value !== null && config_value !== "")) {
            return true;
        }

        return false;
    }

    return (
        <Grid container spacing={2}>
            {
                showCollection?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Collection:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.config.collection}
                        </Typography>
                    </Grid>
                    : null
            }
            {
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Source:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.config.sourceProvider}
                        </Typography>
                    </Grid>
            }
            {
                showQueryType?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Query Type:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.config.queryType}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("file", task.config.lexiconFile)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Lexicon Filename:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {getLexiconFileOriginalName(task.config.lexiconFile)}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("preprocess", task.config.preprocess)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Preprocess:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {getDisplayNameForPreprocess(task.config.preprocess)}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("gazetteer", task.config.gazetteer)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Gazetteer:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {getDisplayNameForGazetteer(task.config.gazetteer)}
                        </Typography>
                    </Grid>
                    : null
            }
            {
                showConfig("level", task.config.level)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Level:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.config.level}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("hit_count", task.config.hitCount)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Hit Count:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {getDisplayNameForHitCount(task.config.hitCount)}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("target_sentences", task.config.targetSentences)?
                    <React.Fragment>
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
                    </React.Fragment>
                    : null
            }

            {
                showConfig("exclude_words", task.config.excludeWords)?
                    <React.Fragment>
                        <Grid item xs={6}>
                            <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                                Exclude words:
                            </Typography>
                            <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                                {task.config.excludeWords}
                            </Typography>
                        </Grid>
                    </React.Fragment>
                    : null
            }

            {
                showConfig("start_year", task.config.startYear)?
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
                    : null
            }

            {
                showConfig("window", task.config.window)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Snippet Window:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {
                                task.config.window
                            }
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showConfig("bounding_box", task.config.boundingBox)?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Bounding Box:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.config.boundingBox}
                        </Typography>
                    </Grid>
                    : null
            }

            {
                showSubmitTime ?
                    <Grid item xs={6}>
                        <Typography component={"span"} gutterBottom variant="h6" color={"text.secondary"} sx={{mt: 5, mr: 5}}>
                            Submitted time:
                        </Typography>
                        <Typography component={"span"} gutterBottom variant="h6"  sx={{mt: 5}}>
                            {task.submit_time}
                        </Typography>
                    </Grid>
                    : null
            }

        </Grid>
    )
}

function DefoeQueryResult() {

    const taskID = useLocation().state.taskId;
    const [status, setStatus] = useState();
    const [result, setResult] = useState();
    // Summary of this task, including config data, and submit time.
    const [task, setTask] = useState();

    const DEFAULT_PAGE = 0;
    const DEFAULT_ROWS_PER_PAGE = 10;

    const [paging, setPaging] = useState();

    const handlePageChangeYearPaged = (event, newPage) => {
        if (task.config.queryType === "publication_normalized" || task.config.level === 'year') {
            setPaging(prevState => ({
                ...prevState,
                page: newPage,
                result: getPagingYearSingleRowResult(newPage, prevState.rowsPerPage, result)
            }))
        } else {
            setPaging(prevState => ({
                ...prevState,
                page: newPage,
                result: getPagingYearResult(newPage, prevState.rowsPerPage, result)
            }))
        }
    }

    const handleRowsPerPageChangeYearPaged = (event) => {
        const newRowsPerPage = event.target.value;
        if (task.config.queryType === "publication_normalized" || task.config.level === 'year') {
            setPaging(prevState => ({
                ...prevState,
                rowsPerPage: newRowsPerPage,
                result: getPagingYearSingleRowResult(prevState.page, newRowsPerPage, result)
            }))
        } else {
            setPaging(prevState => ({
                ...prevState,
                rowsPerPage: newRowsPerPage,
                result: getPagingYearResult(prevState.page, newRowsPerPage, result)
            }))
        }
    }



    useEffect(() => {
        console.log('mounting');

        QueryAPI.getDefoeQueryTaskByTaskID(taskID).then((response) => {
            console.log('get task summary')
            console.log(response?.data);
            let task = response?.data.task;
            if (response?.data.publication_normalized_result_path !== undefined) {
                task["publication_normalized_result_path"] = response?.data.publication_normalized_result_path;
            }
            setTask(task);
        })

        const checkStatus = () => {
            if (taskID !== "") {
                if (status === undefined || (status.state !== "DONE" && status.state !== "ERROR" && status.state !== "CANCELLED")) {
                    console.log('check status!');
                    QueryAPI.getDefoeQueryStatus(taskID).then((r) => {
                        console.log(r);
                        if (r.data.state === "DONE" || r.data.state === "ERROR" || r.data.state === "CANCELLED") {
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
        if (status !== undefined) {
            if (status?.state === "DONE") {
                if (status.results !== undefined && status.results !== "") {
                    const result_filepath = status.results;
                    console.log("result file path %s", result_filepath);
                    QueryAPI.getDefoeQueryResult(result_filepath).then((response) => {
                        console.log("Get data from the result file");
                        console.log(response?.data);
                        setResult(response?.data?.results);
                    });
                }
            } else if (status?.state === "ERROR") {

            }

        }
    }, [status])

    useEffect(() => {
        if (result && task) {
            if (task?.config.queryType.includes("year")) {
                console.log(result);
                setPaging({
                    count: countTotalYearRecords(result),
                    page: DEFAULT_PAGE,
                    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
                    result: getPagingYearResult(DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE, result)
                })
            } else if (task?.config.queryType === "publication_normalized")  {
                console.log(result);
                setPaging({
                    count: countTotalYearSingleRowRecords(result),
                    page: DEFAULT_PAGE,
                    rowsPerPage: DEFAULT_ROWS_PER_PAGE,
                    result: getPagingYearSingleRowResult(DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE, result)
                })
            } else {
                if (task?.config.level === "year") {
                    console.log(result);
                    setPaging({
                        count: countTotalYearSingleRowRecords(result),
                        page: DEFAULT_PAGE,
                        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
                        result: getPagingYearSingleRowResult(DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE, result)
                    })
                } else if (task?.config.level !== "collection") {
                    console.log(result);
                    setPaging({
                        count: countTotalYearRecords(result),
                        page: DEFAULT_PAGE,
                        rowsPerPage: DEFAULT_ROWS_PER_PAGE,
                        result: getPagingYearResult(DEFAULT_PAGE, DEFAULT_ROWS_PER_PAGE, result)
                    })
                }
            }
        }
    }, [result])


    function PublicationNormalisedResult() {
        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Year</TableCell>
                                <TableCell align="right">Volumes</TableCell>
                                <TableCell align="right">Pages</TableCell>
                                {
                                    task.config.collection === "Encyclopaedia Britannica"?
                                        <TableCell align="right">Terms</TableCell> : null
                                }
                                <TableCell align="right">Words</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(paging.result).map((value, key) => (
                                <TableRow
                                    key={key}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {value}
                                    </TableCell>
                                    <TableCell align="right">{paging.result[value][0]}</TableCell>
                                    <TableCell align="right">{paging.result[value][1]}</TableCell>
                                    {
                                        task.config.collection === "Encyclopaedia Britannica"?
                                            (
                                                <React.Fragment>
                                                    <TableCell align="right">{paging.result[value][2]}</TableCell>
                                                    <TableCell align="right">{paging.result[value][3]}</TableCell>
                                                </React.Fragment>
                                            )
                                            : <TableCell align="right">{paging.result[value][2]}</TableCell>
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={paging.count}
                    page={paging.page}
                    rowsPerPage={paging.rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                    onPageChange={handlePageChangeYearPaged}/>
            </React.Fragment>
        );
    }

    function FrequencyKeySearchByYearResult() {
        const [publicationNorm, setPublicationNorm] = useState();

        useEffect(() => {
            console.log("init")
            if (task !== undefined && task.publication_normalized_result_path !== undefined) {
                QueryAPI.getDefoeQueryResult(task.publication_normalized_result_path).then((response) => {
                    console.log("Get publication normalized result");
                    console.log(response?.data);
                    setPublicationNorm(response?.data.results);
                });
            }
        }, [])

        return (
            <Box>
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
                            {Object.keys(paging.result).map((value, key) => (
                                paging.result[value].map((record, index) => (
                                    <TableRow key={'' + key + index}>
                                        {
                                            (index == 0) ? <TableCell align={"center"} colSpan={1} rowSpan={paging.result[value].length}>{value}</TableCell> : null
                                        }
                                        <TableCell align={"center"} rowSpan={1}>{record[0]}</TableCell>
                                        <TableCell align={"center"} rowSpan={1}>{record[1]}</TableCell>
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={paging.count}
                    page={paging.page}
                    rowsPerPage={paging.rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                    onPageChange={handlePageChangeYearPaged}/>
                <Plot
                    data={get_plot_frequency_count_data(result)}
                    layout={
                        {
                            title: 'Frequency of Lexicon ' + getDisplayNameForHitCount(task.config.hitCount) + ' per Years',
                            xaxis: {
                                title: 'Year'
                            },
                            yaxis: {
                                title: 'Frequency'
                            },
                            autosize: true
                        }
                    }
                    useResizeHandler={true}
                    style={{ width: '100%', height: '100%', marginTop: 20}}
                />
                {
                    publicationNorm?
                        <Plot
                            data={get_plot_normalized_frequency_count_data(publicationNorm, result, task.config.hitCount)}
                            layout={
                                {
                                    title: 'Normalized Frequency of Lexicon ' + getDisplayNameForHitCount(task.config.hitCount) + ' per Years',
                                    xaxis: {
                                        title: 'Year'
                                    },
                                    yaxis: {
                                        title: 'Frequency'
                                    },
                                    autosize: true
                                }
                            }
                            useResizeHandler={true}
                            style={{ width: '100%', height: '100%', marginTop: 20}}
                        />
                    : null
                }
            </Box>

        );
    }

    function FrequencyDistributionResult() {

        const min_top_n = 1;
        const max_top_n = 100;
        const [top_n, setTopN] = useState(max_top_n);
        const [editing, setEditing] = useState(false);
        const input_top_n_ref = useRef(null);
        const [error, setError] = useState(false);

        let es = "Series";
        if (task.config.collection === "Encyclopaedia Britannica") {
            es = "Edition"
        }
        let volume_cols = [es, "Volume"]
        let es_cols = [es]
        let year_cols = []

        let cols = volume_cols
        if (task.config.level === "edition" || task.config.level === "series") {
            cols = es_cols
        } else if (task.config.level === "year") {
            cols = year_cols
        }

        const handleConfirmClick = () => {
          const input_top_n = input_top_n_ref.current.value;
          if (input_top_n > max_top_n || input_top_n < min_top_n) {
                setError(true);
          } else {
              setTopN(input_top_n)
              setEditing(false)
          }
        }

        useEffect(() => {
            setError(false);
        }, [top_n])


        return (
            <Box>
                <Stack mb={1} direction={"row"} spacing={2} alignItems={"center"}>
                    <Box>
                        <Typography variant={"body1"} component={"span"}>
                            Most common
                        </Typography>
                        {
                            editing?
                                    <Input inputRef={input_top_n_ref}
                                           sx={{width: 50, ml: 1, mr:1}}
                                           variant={"standard"}
                                           type={"number"}
                                           inputProps={{min: min_top_n, max:max_top_n}}
                                           defaultValue={top_n}
                                           error={error}
                                    />
                                 :
                                <Typography variant={"body1"} component={"span"} pl={1} pr={1} fontWeight={"bold"}>
                                    {top_n}
                                </Typography>
                        }
                        <Typography variant={"body1"} component={"span"}>
                           words are presented in this result. Note that, you can only access maximum
                            top {max_top_n} common words.
                        </Typography>
                    </Box>
                    <Box>
                        {
                            editing?
                                <Button variant={"contained"} onClick={handleConfirmClick}>Confirm</Button>:
                                <Button  variant={"contained"}onClick={() => setEditing(!editing)}>Update</Button>
                        }
                    </Box>


                </Stack>
                {
                    task.config.level === "collection" ?
                        <>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <WordFrequencyDisplay words_frequency={result["words_freq"].slice(0, top_n)}/>
                                <Box width={600} height={600}>
                                    <ReactWordcloud
                                        options={{
                                            fontSizes: [10, 50],
                                            rotations: 2,
                                            rotationAngles: [0, 0],
                                        }}
                                        words={get_word_cloud_words_frequency(result["words_freq"].slice(0, top_n))}
                                    />
                                </Box>
                            </Stack>
                            <Plot
                                data={get_plot_words_frequency(result['words_freq'].slice(0, top_n))}
                                layout={
                                    {
                                        title: 'Frequency Distribution of most ' + top_n +  ' words in ' + task?.config.collection,
                                        xaxis: {
                                            title: 'Word'
                                        },
                                        yaxis: {
                                            title: 'Frequency'
                                        },
                                        autosize: true
                                    }
                                }
                                useResizeHandler={true}
                                style={{ width: '100%', height: '100%', marginTop: 20}}/>
                        </>
                        :
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="lexicon_diversity result table" stripe="2n">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={1} align={"center"}>Year</TableCell>
                                            {
                                                cols.map((col, index) => (
                                                    <TableCell key={index} align={"center"}> {col}</TableCell>
                                                ))
                                            }
                                            <TableCell align={"center"}>Words Visualization Options</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(paging.result).map((value, key) => (
                                            task.config.level === "year"?
                                                <TableRow key={key}>
                                                    <TableCell align={"center"} colSpan={1} rowSpan={1}>{value}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>
                                                        <FrequencyVisOptions
                                                            words_freqs={paging.result[value].slice(0, top_n)}
                                                            />
                                                    </TableCell>
                                                </TableRow>:
                                                paging.result[value].map((record, index) => (
                                                    <TableRow key={'' + key + index}>
                                                        {
                                                            (index == 0) ? <TableCell align={"center"} colSpan={1} rowSpan={paging.result[value].length}>{value}</TableCell> : null
                                                        }
                                                        {
                                                            cols.length === 2 ?
                                                                (<>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[0]}/>
                                                                        </TableCell>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[4]}/>
                                                                        </TableCell>
                                                                    </>
                                                                ) : cols.length === 1 ?
                                                                    (<>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[0]}/>
                                                                        </TableCell>
                                                                    </> ): null
                                                        }
                                                        {
                                                            <TableCell align={"center"} rowSpan={1}>
                                                                <FrequencyVisOptions
                                                                    words_freqs={record[record.length - 1].slice(0, top_n)}
                                                                    />
                                                            </TableCell>
                                                        }
                                                    </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={paging.count}
                                page={paging.page}
                                rowsPerPage={paging.rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                                onPageChange={handlePageChangeYearPaged}/>
                        </>
                }
            </Box>

        );
    }

    function PersonNameRecognitionResult() {

        const min_top_n = 1;
        const max_top_n = 100;
        const [top_n, setTopN] = useState(max_top_n);
        const [editing, setEditing] = useState(false);
        const input_top_n_ref = useRef(null);
        const [error, setError] = useState(false);

        let es = "Series";
        if (task.config.collection === "Encyclopaedia Britannica") {
            es = "Edition"
        }
        let volume_cols = [es, "Volume"]
        let es_cols = [es]
        let year_cols = []

        let cols = volume_cols
        if (task.config.level === "edition" || task.config.level === "series") {
            cols = es_cols
        } else if (task.config.level === "year") {
            cols = year_cols
        }

        const handleConfirmClick = () => {
            const input_top_n = input_top_n_ref.current.value;
            if (input_top_n > max_top_n || input_top_n < min_top_n) {
                setError(true);
            } else {
                setTopN(input_top_n)
                setEditing(false)
            }
        }

        useEffect(() => {
            setError(false);
        }, [top_n])


        return (
            <Box>
                <Stack mb={1} direction={"row"} spacing={2} alignItems={"center"}>
                    <Box>
                        <Typography variant={"body1"} component={"span"}>
                            Most common
                        </Typography>
                        {
                            editing?
                                <Input inputRef={input_top_n_ref}
                                       sx={{width: 50, ml: 1, mr:1}}
                                       variant={"standard"}
                                       type={"number"}
                                       inputProps={{min: min_top_n, max:max_top_n}}
                                       defaultValue={top_n}
                                       error={error}
                                >
                                </Input> :
                                <Typography variant={"body1"} component={"span"} pl={1} pr={1} fontWeight={"bold"}>
                                    {top_n}
                                </Typography>
                        }
                        <Typography variant={"body1"} component={"span"}>
                            person names are presented in this result. Note that, you can only access maximum
                            top {max_top_n} common person names.
                        </Typography>
                    </Box>
                    <Box>
                        {
                            editing?
                                <Button variant={"contained"} onClick={handleConfirmClick}>Confirm</Button>:
                                <Button variant={"contained"} onClick={() => setEditing(!editing)}>Update</Button>
                        }
                    </Box>

                </Stack>
                {
                    task.config.level === "collection" ?
                        <>
                            <Stack direction={"row"} justifyContent={"space-between"}>
                                <WordFrequencyDisplay
                                    words_frequency={result["persons_freq"].slice(0, top_n)}
                                    cols={["Person", "Gender", "Frequency"]}
                                />
                                <Box width={600} height={600}>
                                    <ReactWordcloud
                                        options={{
                                            fontSizes: [10, 50],
                                            rotations: 2,
                                            rotationAngles: [0, 0],
                                        }}
                                        words={get_word_cloud_words_frequency(result["persons_freq"].slice(0, top_n))}
                                    />
                                </Box>
                            </Stack>
                            <Plot
                                data={get_plot_words_frequency(result['persons_freq'].slice(0, top_n))}
                                layout={
                                    {
                                        title: 'Frequency Distribution of most ' + top_n +  ' person names in ' + task?.config.collection,
                                        xaxis: {
                                            title: 'Word'
                                        },
                                        yaxis: {
                                            title: 'Frequency'
                                        },
                                        autosize: true
                                    }
                                }
                                useResizeHandler={true}
                                style={{ width: '100%', height: '100%', marginTop: 20}}/>
                        </>
                        :
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="person name recognition result table" stripe="2n">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={1} align={"center"}>Year</TableCell>
                                            {
                                                cols.map((col, index) => (
                                                    <TableCell key={index} align={"center"}>{col}</TableCell>
                                                ))
                                            }
                                            <TableCell align={"center"}>Person Names Visualization Options</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(paging.result).map((value, key) => (
                                            task.config.level === "year"?
                                                <TableRow key={key}>
                                                    <TableCell align={"center"} colSpan={1} rowSpan={1}>{value}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>
                                                        <FrequencyVisOptions
                                                            words_freqs={paging.result[value]["persons_freq"].slice(0, top_n)}
                                                            type={"person"}/>
                                                    </TableCell>
                                                </TableRow> :
                                                paging.result[value].map((record, index) => (
                                                    <TableRow key={'' + key + index}>
                                                        {
                                                            (index === 0) ? <TableCell align={"center"} colSpan={1} rowSpan={paging.result[value].length}>{value}</TableCell> : null
                                                        }
                                                        {
                                                            cols.length === 2 ?
                                                                (<>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[0]}/>
                                                                        </TableCell>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[4]}/>
                                                                        </TableCell>
                                                                    </>
                                                                ) : cols.length === 1 ?
                                                                    (<>
                                                                        <TableCell align={"center"} rowSpan={1}>
                                                                            <TextMoreLess text={record[0]}/>
                                                                        </TableCell>
                                                                    </> ): null
                                                        }
                                                        {
                                                            <TableCell align={"center"} rowSpan={1}>
                                                                <FrequencyVisOptions
                                                                    words_freqs={record[record.length - 1]["persons_freq"].slice(0, top_n)}
                                                                    type={"person"}/>
                                                            </TableCell>
                                                        }
                                                    </TableRow>
                                                ))
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={paging.count}
                                page={paging.page}
                                rowsPerPage={paging.rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                                onPageChange={handlePageChangeYearPaged}/>
                        </>
                }
            </Box>

        );
    }


    function LexiconDiversityResult() {
        let es = "Series";
        if (task.config.collection === "Encyclopaedia Britannica") {
            es = "Edition"
        }
        let volume_cols = [es, "Volume", "Unique Words", "Words", "TTR", "Maas", "MTLD"]
        let es_cols = [es, "Unique Words", "Words", "TTR", "Maas", "MTLD"]
        let year_cols = ["Unique Words", "Words", "TTR", "Maas", "MTLD"]

        let cols = volume_cols
        if (task.config.level === "edition" || task.config.level === "series") {
            cols = es_cols
        } else if (task.config.level === "year" || task.config.level === "collection") {
            cols = year_cols
        }

        console.log(cols.length)

        return (
            <Box>
                {
                    task.config.level === "collection" ?
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="lexicon_diversity result table" stripe="2n">
                                <TableHead>
                                    <TableRow>
                                        {
                                            cols.map((col, index) => (
                                                <TableCell key={index} align={"center"}> {col}</TableCell>
                                            ))
                                        }
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                    {
                                        cols.map((col, index) => (
                                                col === "Unique Words" ?
                                                <TableCell key={index} align={"center"}> {result["terms"]}</TableCell> :
                                                <TableCell key={index} align={"center"}> {result[col.toLowerCase()]}</TableCell>
                                        ))
                                    }
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer> :
                        <>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="lexicon_diversity result table" stripe="2n">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell colSpan={1} align={"center"}>Year</TableCell>
                                            {
                                                cols.map((col, index) => (
                                                    <TableCell key={index} align={"center"}> {col}</TableCell>
                                                ))
                                            }
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {Object.keys(paging.result).map((value, key) => (
                                            paging.result[value].map((record, index) => (
                                                <TableRow key={'' + key + index}>
                                                    {
                                                        (index == 0) ? <TableCell align={"center"} colSpan={1} rowSpan={paging.result[value].length}>{value}</TableCell> : null
                                                    }
                                                    {
                                                        cols.length === 7 ?
                                                            (<>
                                                                    <TableCell align={"center"} rowSpan={1}>
                                                                        <TextMoreLess text={record[0]}/>
                                                                    </TableCell>
                                                                    <TableCell align={"center"} rowSpan={1}>
                                                                        <TextMoreLess text={record[4]}/>
                                                                    </TableCell>
                                                                </>
                                                            ) : cols.length === 6 ?
                                                                (<>
                                                                    <TableCell align={"center"} rowSpan={1}>
                                                                        <TextMoreLess text={record[0]}/>
                                                                    </TableCell>
                                                                </> ): null
                                                    }
                                                    <TableCell align={"center"} rowSpan={1}>{record[record.length-5]}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>{record[record.length-4]}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>{record[record.length-3]}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>{record[record.length-2]}</TableCell>
                                                    <TableCell align={"center"} rowSpan={1}>{record[record.length-1]}</TableCell>
                                                </TableRow>
                                            ))
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <TablePagination
                                component="div"
                                count={paging.count}
                                page={paging.page}
                                rowsPerPage={paging.rowsPerPage}
                                onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                                onPageChange={handlePageChangeYearPaged}/>
                        </>
                }
                {
                    task?.config.level === "year" ?
                        <Plot
                            data={get_plot_lexicon_diversity_year(result)}
                            layout={
                                {
                                    title: 'Lexicon Diversity per Years',
                                    xaxis: {
                                        title: 'Year'
                                    },
                                    yaxis: {
                                        title: 'Value'
                                    },
                                    autosize: true
                                }
                            }
                            useResizeHandler={true}
                            style={{ width: '100%', height: '100%', marginTop: 20}}
                        /> : null
                }

            </Box>

        );
    }

    function SnippetKeySearchByYearResult() {
        const nls_cols = ['KeySearch Term', 'Page', 'Series', 'Volume', 'Volume Title', 'Snippet'];
        const nls_col_key = {
            'KeySearch Term': 'keysearch-term',
            'Page': 'page_number',
            'Series': 'series_number',
            'Volume': 'volume_number',
            'Volume Title': 'volume_title',
            'Snippet': 'snippet'
        }
        const eb_cols = ['KeySearch Term', 'Term', 'Edition', 'Volume', 'Page', 'Snippet'];
        const eb_col_key = {
            'KeySearch Term': 'keysearch-term',
            'Term': 'term_name',
            'Edition': 'edition_number',
            'Volume': 'volume_number',
            'Page': 'start_page_number',
            'Snippet': 'snippet'
        }

        let cols = nls_cols
        let col_key = nls_col_key
        if (task.config.collection === "Encyclopaedia Britannica") {
            cols = eb_cols
            col_key = eb_col_key
        }

        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="frequency_keysearch_by_year result table" stripe="2n">
                        <TableHead>
                            <TableRow>
                                <TableCell >Year</TableCell>
                                {
                                    cols.map((col, index) => (
                                        <TableCell key={index}> {col}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(paging.result).map((year, key) => (
                                paging.result[year].map((record, index) => (
                                    <TableRow key={'' + key + index}>
                                        {
                                            (index == 0) ?
                                                <TableCell align={"center"} colSpan={1} rowSpan={paging.result[year].length}>
                                                    {year}
                                                </TableCell>
                                                : null
                                        }
                                        {
                                            cols.map((col) => (
                                                <TableCell key={'' + key + index + col} >
                                                    {
                                                        col === 'Term'?
                                                            <Link href={hto_uri_to_path(record["term_uri"])}>
                                                                {record[col_key[col]]}
                                                            </Link>
                                                            : (col === 'Page'?
                                                                <Link href={hto_uri_to_path(record["page_uri"])}>
                                                                    {record[col_key[col]]}
                                                                </Link>: record[col_key[col]])
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={paging.count}
                    page={paging.page}
                    rowsPerPage={paging.rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                    onPageChange={handlePageChangeYearPaged}/>
            </React.Fragment>
        )
    }


    function GeoParserByYearResult() {
        const nls_cols = ['Series', 'Volume', 'Volume Title', 'Page', 'Geo'];
        const nls_col_key = {
            'Series': 'series_number',
            'Volume': 'volume_number',
            'Volume Title': 'volume_title',
            'Page': 'page_number',
            'Geo': 'georesolution'
        }
        const eb_cols = ['Edition', 'Volume', 'Term', 'Geo'];
        const eb_col_key = {
            'Edition': 'edition_number',
            'Volume': 'volume_number',
            'Term': 'term_name',
            'Geo': 'georesolution'
        }

        let cols = nls_cols
        let col_key = nls_col_key
        if (task.config.collection === "Encyclopaedia Britannica") {
            cols = eb_cols
            col_key = eb_col_key
        }


        function GeoCell(props) {
            const {geo, sx} = props;
            const places = Object.keys(geo)
            const is_geo_empty = places.length == 0;
            const [open, setOpen] = useState(false);
            const [data, setData] = useState([]);

            if (is_geo_empty) {
                return (
                    <Box></Box>
                )
            }

            const handleOpen = (place_geo, place_name) => {
                const popup_html = '<h3>' + place_name + ', ' + place_geo['in-cc'] + '</h3>'
                    + '<div>Type: ' + '<strong>' + place_geo['type'] + '</strong></div>'
                    + '<div>Population: ' + '<strong>' + place_geo['pop'] + '</strong></div>'
                    + '<div>Snippet: ' + '<strong>' + place_geo['snippet'] + '</strong></div>';
                setData({
                    coordinates: [place_geo.long, place_geo.lat],
                    popupHtml: popup_html
                })
                setOpen(true);
            }
            const handleClose = () => setOpen(false);

            const style = {
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                width: '50%',
                height: '50%',
                p: 1,
            };

            return (
                <Box>
                    <Stack direction={"column"}>
                        {
                            places.map((place, index) => (
                                <Box key={index}>
                                    {
                                        geo[place].lat === ""?
                                            <Box mt={1} mb={1}>
                                                {place.split('-')[0]}
                                            </Box>
                                            :  <Button
                                                onClick={() => handleOpen(geo[place], place.split('-')[0])}
                                                sx={{textTransform: "none"}}>
                                                {place.split('-')[0]}
                                            </Button>
                                    }
                                </Box>
                            ))
                        }
                    </Stack>
                    <Modal
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="modal-modal-title"
                        aria-describedby="modal-modal-description"
                    >
                        <Box sx={style}>
                            <BasicMap coordinates={data.coordinates} popupHtml={data.popupHtml}/>
                        </Box>
                    </Modal>
                </Box>
            )
        }

        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table
                        sx={{ minWidth: 650 }}
                        aria-label="geoparser query result table"
                        stripe="2n">
                        <TableHead>
                            <TableRow>
                                <TableCell>Year</TableCell>
                                {
                                    cols.map((col, index) => {
                                        return  (col === 'Volume Title') ?
                                            <TableCell align={"center"} width={250} key={index}>{col}</TableCell>
                                            : <TableCell align={"center"} key={index}>{col}</TableCell>
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(paging.result).map((year) => (
                                paging.result[year].map((record, index) => (
                                    <TableRow key={'' + year + index}>
                                        {
                                            (index == 0) ?
                                                <TableCell align={"center"} colSpan={1} rowSpan={paging.result[year].length}>
                                                    {year}
                                                </TableCell>
                                                : null
                                        }
                                        {
                                            cols.map((col) => (
                                                <TableCell key={'' + year + index + col} align={"center"}>
                                                    {
                                                        col === 'Page'?
                                                            <Link href={hto_uri_to_path(record["page_uri"])}>
                                                                {record[col_key[col]]}
                                                            </Link>
                                                            : (
                                                                col === 'Term'?
                                                                    <Link href={hto_uri_to_path(record["term_uri"])}>
                                                                        {record[col_key[col]]}
                                                                    </Link> : (
                                                                col === 'Geo'?
                                                                    <GeoCell geo={record[col_key[col]]}/>
                                                                    : record[col_key[col]])
                                                            )
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={paging.count}
                    page={paging.page}
                    rowsPerPage={paging.rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                    onPageChange={handlePageChangeYearPaged}/>
                <GeoDataDeepVisualizeResult result={result} />
            </React.Fragment>
        )
    }

    function FullTextKeySearchByYearResult() {
        const nls_cols = ['KeySearch Term', 'Page', 'Series', 'Volume', 'Volume Title', 'Description'];
        const nls_col_key = {
            'KeySearch Term': 'keysearch-term',
            'Page': 'page_number',
            'Series': 'series_number',
            'Volume': 'volume_number',
            'Volume Title': 'volume_title',
            'Description': 'description'
        }
        const eb_cols = ['KeySearch Term', 'Term', 'Edition', 'Volume', 'Page', 'Description'];
        const eb_col_key = {
            'KeySearch Term': 'keysearch-term',
            'Term': 'term_name',
            'Edition': 'edition_number',
            'Volume': 'volume_number',
            'Page': 'start_page_number',
            'Description': 'description'
        }

        let cols = nls_cols
        let col_key = nls_col_key
        if (task.config.collection === "Encyclopaedia Britannica") {
            cols = eb_cols
            col_key = eb_col_key
        }

        return (
            <React.Fragment>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="frequency_keysearch_by_year result table" stripe="2n">
                        <TableHead>
                            <TableRow>
                                <TableCell >Year</TableCell>
                                {
                                    cols.map((col, index) => (
                                        <TableCell key={index}> {col}</TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Object.keys(paging.result).map((year, key) => (
                                paging.result[year].map((record, index) => (
                                    <TableRow key={'' + key + index}>
                                        {
                                            (index == 0) ?
                                                <TableCell align={"center"} colSpan={1} rowSpan={paging.result[year].length}>
                                                    {year}
                                                </TableCell>
                                                : null
                                        }
                                        {
                                            cols.map((col) => (
                                                <TableCell key={'' + key + index + col} >
                                                    {
                                                        col === 'Term'?
                                                            <Link href={hto_uri_to_path(record["term_uri"])}>
                                                                {record[col_key[col]]}
                                                            </Link>
                                                            : (
                                                                col === 'Page'?
                                                                    <Link href={hto_uri_to_path(record["page_uri"])}>
                                                                        {record[col_key[col]]}
                                                                    </Link> :
                                                                col === 'Description'?
                                                                    <TextMoreLess text={record[col_key[col]]} />
                                                                    : record[col_key[col]]
                                                            )
                                                    }
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    component="div"
                    count={paging.count}
                    page={paging.page}
                    rowsPerPage={paging.rowsPerPage}
                    onRowsPerPageChange={handleRowsPerPageChangeYearPaged}
                    onPageChange={handlePageChangeYearPaged}/>
            </React.Fragment>
        )
    }

    function download(resultFilePath) {
        let fileName = task.config.lexiconFile;
        if (fileName === '' || fileName.substring(fileName.length - 3) !== 'txt') {
            fileName = resultFilePath.split('\\').pop().split('/').pop();
        }
        const downloadFileName = fileName.substring(0, fileName.length - 4) + '_result.zip';
        QueryAPI.download(resultFilePath, downloadFileName);
    }


    function DefoeResultTable() {
        switch (task.config.queryType) {
            case "publication_normalized":
                console.log("Here in publication_normalized!");
                return <PublicationNormalisedResult/>
            case "frequency_keysearch_by_year":
                return <FrequencyKeySearchByYearResult/>
            case "fulltext_keysearch_by_year":
                return <FullTextKeySearchByYearResult/>;
            case "snippet_keysearch_by_year":
                return <SnippetKeySearchByYearResult/>;
            case "geoparser_by_year":
                return <GeoParserByYearResult/>;
            case "lexicon_diversity":
                return <LexiconDiversityResult/>;
            case "frequency_distribution":
                return <FrequencyDistributionResult/>;
            case "person_entity_recognition":
                return <PersonNameRecognitionResult />;
            default:
                return (<Box>
                    No Such Query Type!
                </Box>)
        }

    }

    const handleCancelTaskClick = () => {
        QueryAPI.cancelDefoeQueryTask(taskID).then(r => {
            console.log(r?.data)
        })
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
                        <Task task={task} showCollection={true} showQueryType={true} showSubmitTime={true}/>
                        <Stack direction="row" spacing={3} mt={5} justifyContent={"center"}>
                            <Button variant="outlined" href={"/defoeQuery"}>
                                Create another query
                            </Button>
                            <Button variant="contained" href={"/defoeQueryTasks"}>
                                Check all query tasks
                            </Button>
                            {
                                status?.state === "PENDING" ||  status?.state === "RUNNING" ?
                                    (<Button variant="contained" color={"error"} onClick={handleCancelTaskClick}>
                                        Cancel current query
                                    </Button>) : null
                            }

                        </Stack>
                    </Box>)
                    : null
            }

            {
                (status?.state !== "DONE" && status?.state !== "ERROR" && !status?.state.includes("CANCEL"))  ?
                    <LinearProgressWithLabel value={status? status.progress : 0} /> : <Divider/>
            }

            {
                (status?.state === "CANCEL_STARTED" || status?.state === "CANCEL_PENDING") ?
                    <Typography component={"div"} sx={{mt: 5}} gutterBottom variant="h5" >
                        Cancelling ......
                    </Typography> : null
            }

            {
                (status?.state === "CANCELLED") ?
                    <Typography component={"div"} sx={{mt: 5}} gutterBottom variant="h5" >
                        This query has been cancelled!
                    </Typography> : null
            }

            {
                (status?.state === "ERROR") ?
                    <Typography component={"div"} sx={{mt: 5}} gutterBottom variant="h5" >
                        Failed to run this query!
                    </Typography> : null
            }
            {
                (status?.state === "DONE" && (result !== undefined && (task?.config.level === "collection" || paging !== undefined))) ?
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
                    </Box> :
                    (status?.state === "DONE")? <Typography component={"div"} sx={{mt: 5}} gutterBottom variant="h5" >
                        Loading the result ......
                    </Typography> : null
            }
        </Container>
    )

}

export default DefoeQueryResult;