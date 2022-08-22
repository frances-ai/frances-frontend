import React, {useState, useEffect} from "react";
import {
    Button,
    Container,
    Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import Box from "@mui/material/Box";
import QueryAPI from "../apis/query"
import {Search} from "@mui/icons-material";
import DefoeResult from "../components/termSearchResult";


function DefoeQueryPage() {

    const [queryListLoaded, setQueryListLoaded] = useState(false);
    const [queryList, setQueryList] = useState([]);
    useEffect(() => {
            if (queryListLoaded) {
                return;
            }
            QueryAPI.getAllDefoeQueries().then(response => {
                const result = response?.data;
                setQueryListLoaded(true);
                setQueryList(result.queries);
                setQueryType(result.queries[0]);
            })
    }, []);

    const [queryResult, setQueryResult] = useState("");
    const [isQuerying, setIsQuerying] = useState(false);
    const [queryID, setQueryID] = useState("");
    const handleQuerySubmit = (event) => {
        setIsQuerying(true);
        event.preventDefault();
        const data = {
            defoe_selection: queryType,
            preprocess: preProcess,
            target_sentences: targetSentences,
            target_filter: targetFilter,
            start_year: startYear,
            end_year: endYear,
            hit_count: hitCount,
            file: fileID,
        };
        console.log(data);
        QueryAPI.submitDefoeQuery(data).then((r) => {
            console.log(r);
            if (!r.data.success) {
                alert("Defoe query failed to submit");
            }
            setQueryID(r.data.id);
        })
    }

    const [intervalID, setIntervalID] = useState();
    const [queryStatus, setQueryStatus] = useState();

    useEffect(() => {
        if (queryID !== undefined && queryID !== "") {
            const id = setInterval(() => {
                console.log(queryID);
                QueryAPI.getDefoeQueryStatus(queryID).then((r) => {
                    if (r?.status == 200) {
                        setQueryStatus(r.data);
                    }
                });
            }, 10000);
            setIntervalID(id);
        }
    }, [queryID]);

    useEffect(() => {
        if (queryStatus?.done == true && intervalID !== undefined) {
            console.log(queryStatus);
            clearInterval(intervalID);
        }
    }, [queryStatus])

    const [queryType, setQueryType] = useState("");
    const [preProcess, setPreProcess] = useState("none");
    const [targetSentences, setTargetSentences] = useState("");
    const [targetFilter, setTargetFilter] = useState("or");
    const [startYear, setStartYear] = useState("1771");
    const [endYear, setEndYear] = useState("1771");
    const [hitCount, setHitCount] = useState("term");

    const handleHitCountChange = (event) => {
        setHitCount(event.target.value);
    };

    const handleQueryTypeChange = (event) => {
        setQueryType(event.target.value);
    };

    const handlePreProcessChange = (event) => {
        setPreProcess(event.target.value)
    };

    const handleTargetSentencesChange = (event) => {
        setTargetSentences(event.target.value);
    };

    const handleTargetFilterChange = (event) => {
        setTargetFilter(event.target.value);
    };

    const handleStartYearChange = (event) => {
        setStartYear(event.target.value);
    };

    const handleEndYearChange = (event) => {
        setEndYear(event.target.value);
    };

    const [fileID, setFileID] = useState("");
    const onFileUpload = (event) => {
        const file = event.target.files[0];
        QueryAPI.uploadFile(file).then((r) => {
            if (!r.data.success) {
                alert("File upload failed")
            }
            setFileID(r.data.file);
        });
    };

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            { !isQuerying &&
                <div>
                    <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                        Exploring the Encyclopaedia Britannica (1768-1860)
                    </Typography>
                    <Typography component="div" gutterBottom variant="h5" sx={{mt: 5}}>
                        Defoe Query
                    </Typography>
                    <Divider/>

                    <Box component="form" onSubmit={handleQuerySubmit} noValidate sx={{ mt: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <div>
                                    <strong>Query</strong>
                                    <div>
                                        <Select
                                            value={queryType}
                                            label="Query selection"
                                            onChange={handleQueryTypeChange}
                                            disabled={!queryListLoaded}
                                        >
                                            {queryList.map(item => (
                                                <MenuItem value={item} key={item}>{item}</MenuItem>
                                            ))}
                                        </Select>
                                        <div>
                                            It counts the number of terms/words in which keywords/keysentences appear. It groups results by years.
                                        </div>
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="prep_div">
                                    <strong>Preprocess Treatment</strong>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="none"
                                        name="preprocess"
                                        onChange={handlePreProcessChange}
                                    >
                                        <FormControlLabel value="none" control={<Radio />} label="None" />
                                        <FormControlLabel value="normalize" control={<Radio />} label="Normalize" />
                                        <FormControlLabel value="normalize_num" control={<Radio />} label="Normalize & Numbers" />
                                        <FormControlLabel value="lemmatize" control={<Radio />} label="Normalize & Lemmatize" />
                                        <FormControlLabel value="stem" control={<Radio />} label="Normalize & Stemming" />
                                    </RadioGroup>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="hit_count_div">
                                    <label htmlFor="hit_count">Select the hit count</label>
                                    <Select
                                        value={hitCount}
                                        label="Hit count"
                                        onChange={handleHitCountChange}
                                        name="hit_count"
                                    >
                                        <MenuItem value="term" key="term">Term</MenuItem>
                                        <MenuItem value="word" key="word">Word</MenuItem>
                                    </Select>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="upload_div">
                                    <strong>Lexicon File</strong>
                                    <div>
                                        <Button variant="outlined" component="label">
                                            Upload
                                            <input hidden accept="text/plain" type="file" name="file" onInput={onFileUpload}/>
                                        </Button>
                                        {
                                            fileID !== "" &&
                                            <span>{fileID}</span>
                                        }
                                    </div>
                                    <div>
                                        The file should contain a line per keyword and/or keysentence that you want to use in your query.
                                    </div>
                                </div>
                            </Grid>

                            <Grid item xs={12}>
                                <div className="filter_div">
                                    <p><strong>Filtering Options</strong></p>

                                    <div>
                                        <label htmlFor="target_sentences">Target words/sentences (comma separated)
                                            (Optional)</label>
                                        <div>
                                            <TextField
                                                id="outlined-multiline-static"
                                                label='flower,garden,plant'
                                                name="target_sentences"
                                                multiline
                                                rows={4}
                                                onChange={handleTargetSentencesChange}
                                            />
                                        </div>

                                        <div>
                                            Those are the list of words and/or sentences that must appear in a term in order to select it. Leave it empty to select all.
                                        </div>
                                    </div>

                                    <strong> Select term which contains </strong>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        defaultValue="or"
                                        name="target_filter"
                                        onChange={handleTargetFilterChange}
                                    >
                                        <FormControlLabel value="or" control={<Radio />} label="Or" />
                                        <FormControlLabel value="and" control={<Radio />} label="And" />
                                    </RadioGroup>

                                    <div>
                                        <TextField id="start_year" onChange={handleStartYearChange}
                                                   label="Start Year (Optional)" name="start_year" variant="outlined"
                                        />
                                        <TextField id="end_year" onChange={handleEndYearChange}
                                                   label="End Year (Optional)" name="end_year" variant="outlined"
                                        />
                                    </div>
                                </div>
                            </Grid>
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">Submit Query</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            }

            {/* Search Result */}
            {
                isQuerying &&
                <div>
                    Query ID: {queryID}
                    <div>
                        Status: Running
                    </div>
                    <div>
                        Last Updated:
                    </div>
                    <div>
                        {
                            queryStatus?.results
                        }
                    </div>

                </div>
            }
        </Container>
    )
}

export default DefoeQueryPage