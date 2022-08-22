import React, {useState, useEffect} from "react";
import {
    Alert,
    Button,
    CircularProgress,
    Container,
    Divider, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import QueryAPI from "../apis/query"

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import { lightfair } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('json', json);

function DefoeQueryPage() {
    // extra query info if possible
    const queryMetadata = {
        frequency_keysearch_by_year: {
            description: "It counts the number of terms/words in which appear your selected kewyords/keysentences. It groups results by years.",
            inputs: [
                "preprocess", "hitcount", "upload", "filter"
            ]
        },
        publication_normalized: {
            description: "It extracts the number of volumes (books), pages and words per year.",
            inputs: []
        },
        uris_keysearch: {
            description: "It extracts uris of terms in which appear your selected kewyords/keysentences. It groups results by uris.",
            inputs: [
                "preprocess", "upload", "filter"
            ]
        },
        terms_snippet_keysearch_by_year: {
            description: "It extracts snippets of terms definitions in which appear your selected kewyords/keysentences groupping results by years.",
            inputs: [
                "preprocess", "upload", "filter", "window"
            ]
        },
        terms_fulltext_keysearch_by_year: {
            description: "It extracts full text of terms definitions in which appear your selected kewyords/keysentences. It groups results by years.",
            inputs: [
                "preprocess", "upload", "filter"
            ]
        }
    };

    // descriptions of preprocess functions
    const preProcessDescriptions = {
        none: "It does not apply any type of treatment to the text.",
        normalize: "It converts all words to lower-case removing all characters that are not 'a',...,'z'.",
        normalize_num: "It converts all words to lower-case removing all characters that are not 'a',...,'z' or '1',..,'9'.",
        lemmatize: "It normalizes the text first and lemmatizes it later, returning the base (lemma) of each word.",
        stem: "It normalizes the text first and applies stemming later, reducing words to their stem.",
    }

    // query list state
    const [queryListLoaded, setQueryListLoaded] = useState(false);
    const [queryList, setQueryList] = useState([]);

    // query result state
    const [queryID, setQueryID] = useState("");
    const [queryStatus, setQueryStatus] = useState({});
    const [isQuerying, setIsQuerying] = useState(false);

    useEffect(() => {
        if (!queryListLoaded) {
            QueryAPI.getAllDefoeQueries().then(response => {
                const result = response?.data;
                setQueryListLoaded(true);
                setQueryList(result.queries);
                setQueryTypeWithUI(result.queries[0]);
            });
        }

        const timerID = setInterval(() => {
            if (queryID !== "" && !queryStatus.done) {
                QueryAPI.getDefoeQueryStatus(queryID).then((r) => {
                    console.log(r);
                    setQueryStatus(r.data);
                });
            }
        }, 1000);
        return () => {
            clearInterval(timerID);
        };
    }, [queryID]);

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
            window: window,
            file: fileID,
        };
        console.log(data);
        QueryAPI.submitDefoeQuery(data).then((r) => {
            console.log(r);
            if (!r.data.success) {
                alert("Defoe query failed to submit");
                return;
            }
            if (r.data.id != null) {
                // computed in real time
                setQueryID(r.data.id);
                return;
            }
            if (r.data.results != null) {
                // precomputed query
                setQueryStatus({
                    id: "precomputed",
                    done: true,
                    results: r.data.results,
                });
                return;
            }
        })
    }

    const updateQueryStatus = (id) => {
        QueryAPI.getDefoeQueryStatus(id).then((r) => {
            setQueryStatus(r.data);
        });
    }

    // form parameters
    const [queryType, setQueryType] = useState("");
    const [preProcess, setPreProcess] = useState("none");
    const [targetSentences, setTargetSentences] = useState("");
    const [targetFilter, setTargetFilter] = useState("or");
    const [startYear, setStartYear] = useState("");
    const [endYear, setEndYear] = useState("");
    const [hitCount, setHitCount] = useState("term");
    const [window, setWindow] = useState(10);

    // enable parameter flags
    const [preProcessEnabled, setPreProcessEnabled] = useState(false);
    const [hitCountEnabled, setHitCountEnabled] = useState(false);
    const [filterEnabled, setFilterEnabled] = useState(false);
    const [uploadEnabled, setUploadEnabled] = useState(false);
    const [windowEnabled, setWindowEnabled] = useState(false);

    // update the query type and interface around it.
    const setQueryTypeWithUI = (name) => {
        setQueryType(name);
        const inputToFunction = {
            "preprocess": setPreProcessEnabled,
            "hitcount": setHitCountEnabled,
            "filter": setFilterEnabled,
            "upload": setUploadEnabled,
            "window": setWindowEnabled,
        }
        const metadata = queryMetadata[name]
        if (!metadata) {
            return;
        }
        console.log(metadata.inputs);
        for (const [name, set] of Object.entries(inputToFunction)) {
            const enabled = metadata.inputs.includes(name)
            set(enabled);
        }
    }

    const handleQueryTypeChange = (event) => {
        setQueryTypeWithUI(event.target.value);
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
    const handleHitCountChange = (event) => {
        setHitCount(event.target.value);
    };
    const handleWindowChange = (event) => {
        setWindow(event.target.value);
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

    const getQueryResult = () => {
        if (queryStatus !== {}) {
            return (
                <div>
                    <p>ID: {queryStatus.id}</p>
                    {
                        !queryStatus.done &&
                        <>
                            <div>Query Running...</div>
                            <CircularProgress />
                        </>
                    }
                    {
                        queryStatus.done && !queryStatus.error &&
                        <Alert severity="success">Query Complete</Alert>
                    }
                    {
                        queryStatus.results &&
                        <SyntaxHighlighter language="json" style={lightfair}>
                            {JSON.stringify(queryStatus.results, null, 2)}
                        </SyntaxHighlighter>
                    }
                    {
                        queryStatus.error &&
                        <Alert severity="error">Query Failed: {queryStatus.error}</Alert>
                    }
                </div>
            );
        }
        if (queryID !== "") {
            return (
                <div>
                    ID: {queryStatus.id}
                </div>
            );
        }
        return (
            <div>
                No Query
            </div>
        );
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
                                            {/* Render query description */}
                                            {
                                                queryType && queryMetadata[queryType] &&
                                                <Typography variant="caption" display="block" gutterBottom>
                                                    {queryMetadata[queryType].description}
                                                </Typography>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </Grid>
                            {
                                preProcessEnabled &&
                                <Grid item xs={12} id="prep_div">
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
                                    {/* Draw description of current preprocess treatment */}
                                    <Typography variant="caption" display="block" gutterBottom>
                                        { preProcessDescriptions[preProcess] }
                                    </Typography>
                                </Grid>
                            }
                            {
                                hitCountEnabled &&
                                <Grid item xs={12} id="hit_count_div">
                                    <strong>Hit Count</strong>
                                    <div>
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
                                    <Typography variant="caption" display="block" gutterBottom>
                                        It counts the number of times a keyword/keysentece appears in a term (article or topic).
                                    </Typography>
                                </Grid>
                            }
                            {
                                uploadEnabled &&
                                <Grid item xs={12} id="upload_div">
                                    <strong>Lexicon File</strong>
                                    <div>
                                        <Button variant="outlined" component="label">
                                            Upload
                                            <input hidden accept="text/plain" type="file" name="file" onInput={onFileUpload}/>
                                        </Button>
                                        {
                                            fileID !== "" &&
                                            <div>Upload ID: {fileID}</div>
                                        }
                                    </div>
                                    <Typography variant="caption" display="block" gutterBottom>
                                        The file should contain a line per keyword and/or keysentence that you want to use in your query.
                                    </Typography>
                                </Grid>
                            }
                            {
                                filterEnabled &&
                                <Grid item xs={12} id="filter_div">
                                    <p><strong>Filtering Options</strong></p>

                                    <div>
                                        <label htmlFor="target_sentences">Target words/sentences (comma separated)
                                            (Optional)</label>
                                        <div>
                                            <TextField
                                                id="target_sentences"
                                                label='flower,garden,plant'
                                                name="target_sentences"
                                                multiline
                                                rows={4}
                                                onChange={handleTargetSentencesChange}
                                            />
                                        </div>

                                        <Typography variant="caption" display="block" gutterBottom>
                                            Those are the list of words and/or sentences that must appear in a term in order to select it. Leave it empty to select all.
                                        </Typography>
                                    </div>

                                    <label> Select term which contains </label>
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
                                        <TextField id="start_year" onChange={handleStartYearChange} label="Start Year (Optional)" name="start_year" variant="outlined" />
                                        <TextField id="end_year" onChange={handleEndYearChange} label="End Year (Optional)" name="end_year" variant="outlined" />
                                    </div>
                                </Grid>
                            }
                            {
                                windowEnabled &&
                                <>
                                    <Grid item xs={12} id="snippet_div">
                                        <strong>Snippet Window</strong>
                                        <div>
                                            <TextField
                                                id="window"
                                                label="10"
                                                default="10"
                                                name="window"
                                                multiline
                                                rows={4}
                                                onChange={handleWindowChange}
                                            />
                                        </div>
                                    </Grid>
                                </>
                            }
                            <Grid item xs={12}>
                                <Button type="submit" variant="contained">Submit Query</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </div>
            }

            {/* Search Result */}
            {
                isQuerying && getQueryResult()
            }
        </Container>
    )
}

export default DefoeQueryPage