import {
    Button,
    Container,
    Divider,
    Grid, Modal, Paper,
    Stack,
    Table, TableBody, TableCell,
    TableContainer, TableHead, TablePagination, TableRow,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import DownloadIcon from '@mui/icons-material/Download';
import {getLexiconFileOriginalName} from "../utils/stringUtil";
import TextMoreLess from "../components/textMoreLess";
import Plot from "react-plotly.js";
import {get_plot_frequency_count_data, get_plot_normalized_frequency_count_data} from "../utils/plotUtil";
import BasicMap from "../components/maps/basicMap";
import VisualiseButton from "../components/buttons/visualiseButton";
import GeoDataDeepVisualizeResult from "../components/geoDataDeepVisualizeResult";
import {
    countTotalYearRecords,
    countTotalYearSingleRowRecords,
    getPagingYearResult,
    getPagingYearSingleRowResult
} from "../utils/pagingUtil";
import LinearProgressWithLabel from "../components/linearProgressWithLabel";
import {getDisplayNameForGazetteer, getDisplayNameForHitCount, getDisplayNameForPreprocess} from "../apis/util";

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
        if (task.config.queryType === "publication_normalized") {
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
        if (task.config.queryType === "publication_normalized") {
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
                        if (task?.config.queryType.includes("fulltext") || task?.config.queryType.includes("snippet")) {
                            setResult(response?.data?.results.terms_details);
                        } else {
                            setResult(response?.data?.results);
                        }

                    });
                }
            } else if (status?.state === "ERROR") {

            }

        }
    }, [status])

    useEffect(() => {
        if (result && task) {
            if (task?.config.queryType.includes("year")){
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

    function SnippetKeySearchByYearResult() {
        const cols = ['KeySearch Term', 'Term', 'Edition', 'Volume', 'Page', 'Header', 'Letters', 'Part', 'Snippet'];
        const col_key = {
            'KeySearch Term': 'keysearch-term',
            'Term': 'term',
            'Edition': 'edition',
            'Volume': 'volume',
            'Page': 'page number',
            'Header': 'header',
            'Letters': 'letters',
            'Part': 'part',
            'Snippet': 'snippet'
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
                            {paging.result.map((recordPerYear, key) => (
                                recordPerYear[1].map((record, index) => (
                                    <TableRow key={'' + key + index}>
                                        {
                                            (index == 0) ?
                                                <TableCell align={"center"} colSpan={1} rowSpan={recordPerYear[1].length}>
                                                    {recordPerYear[0]}
                                                </TableCell>
                                                : null
                                        }
                                        {
                                            cols.map((col) => (
                                                <TableCell key={'' + key + index + col} >
                                                    {
                                                        col === 'Term'?
                                                            <VisualiseButton
                                                                uri={record["uri"]}
                                                                collection={task.config.collection}
                                                            >
                                                                {record[col_key[col]]}
                                                            </VisualiseButton>
                                                            : record[col_key[col]]
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

    function UrisKeySearchResult() {
        return (
            <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="uris key search result table">
                <TableHead>
                    <TableRow>
                        <TableCell>Uri</TableCell>
                        <TableCell>KeySearch Term</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(result).map((value, key) => (
                        result[value].map((record, index) => (
                            <TableRow key={'' + key + index}>
                                {
                                    (index == 0) ? <TableCell rowSpan={result[value].length}>
                                        {
                                            <VisualiseButton
                                                uri={value}
                                                collection={task.config.collection}
                                            >
                                                {value}
                                            </VisualiseButton>
                                        }
                                    </TableCell> : null
                                }
                                <TableCell rowSpan={1}>{record}</TableCell>
                            </TableRow>
                        ))
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
        )
    }

    function GeoParserByYearResult() {
        const cols = ['Series', 'Volume', 'Volume ID', 'Volume Title', 'Page', 'Words', 'Part', 'Geo'];
        const col_key = {
            'Series': 'serie',
            'Volume': 'volume',
            'Volume ID': 'volumeId',
            'Volume Title': 'volumeTitle',
            'Page': 'page number',
            'Words': 'numWords',
            'Part': 'part',
            'Geo': 'georesolution'
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
                                                            <VisualiseButton
                                                                uri={record["uri"]}
                                                                collection={task.config.collection}
                                                            >
                                                                {record[col_key[col]]}
                                                            </VisualiseButton>
                                                            : (
                                                                col === 'Geo'?
                                                                    <GeoCell geo={record[col_key[col]]}/>
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
                <GeoDataDeepVisualizeResult result={result} />
            </React.Fragment>
        )
    }

    function FullTextKeySearchByYearResult() {
        const cols = ['KeySearch Term', 'Term', 'Edition', 'Volume', 'Page', 'Header', 'Letters', 'Part', 'Definition'];
        const col_key = {
            'KeySearch Term': 'keysearch-term',
            'Term': 'term',
            'Edition': 'edition',
            'Volume': 'volume',
            'Page': 'page number',
            'Header': 'header',
            'Letters': 'letters',
            'Part': 'part',
            'Definition': 'term-definition'
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
                            {paging.result.map((recordPerYear, key) => (
                                recordPerYear[1].map((record, index) => (
                                    <TableRow key={'' + key + index}>
                                        {
                                            (index == 0) ?
                                                <TableCell align={"center"} colSpan={1} rowSpan={recordPerYear[1].length}>
                                                    {recordPerYear[0]}
                                                </TableCell>
                                                : null
                                        }
                                        {
                                            cols.map((col) => (
                                                <TableCell key={'' + key + index + col} >
                                                    {
                                                        col === 'Term'?
                                                            <VisualiseButton
                                                                uri={record["uri"]}
                                                                collection={task.config.collection}
                                                            >
                                                                {record[col_key[col]]}
                                                            </VisualiseButton>
                                                            : (
                                                                col === 'Definition'?
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
            case "uris_keysearch":
                return <UrisKeySearchResult/>
            case "snippet_keysearch_by_year":
                return <SnippetKeySearchByYearResult/>;
            case "geoparser_by_year":
                return <GeoParserByYearResult/>;
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
                (status?.state === "DONE" && (result !== undefined && paging !== undefined)) ?
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