import React from 'react';
import {
    Button,
    CircularProgress,
    Container,
    Divider,
    FormControl,
    FormHelperText,
    Grid, InputBase,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Stack,
    Switch, TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import {preprocess} from "../apis/queryMeta";


function DefoeQueryPage() {
    const initConfig = {
        defoe_selection: '',
        preprocess: '',
        target_sentences: '',
        target_filter: null,
        start_year: -1000,
        end_year: 999999,
        hit_count: null,
        window: -1,
        file: '',
    };

    const [collections, setCollections] = useState([]);
    const [defaultQueryYear, setDefaultQueryYear] = useState(1771);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [queryMeta, setQueryMeta] = useState();
    const [queryTypes, setQueryTypes] = useState([]);
    const [selectedQueryType, setSelectQueryType] = useState(initConfig['defoe_selection']);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitDisable, setSubmitDisable] = useState(true);
    const [selectedPreprocessIndex, setSelectedPreprocessIndex] = useState(0);
    const [hitCountChecked, setHitCountChecked] = useState(true);
    const [targetAllChecked, setTargetAllChecked] = useState(true);
    const [startYear, setStartYear] = useState(defaultQueryYear);
    const [endYear, setEndYear] = useState(defaultQueryYear);
    const [targets, setTargets] = useState([]);
    const [currentTarget, setCurrentTarget] = useState("");
    const [fileID, setFileID] = useState(initConfig['file']);
    const [config, setConfig] = useState();

    useEffect(() => {
        //Loading all avaible configuration metadata
        QueryAPI.getAllCollectionName().then(response => {
            const data = response?.data
            setCollections(data);
            setSelectedCollection(data[0]);
        })
        QueryAPI.getAllDefoeQueryTypes().then(response => {
            const data = response?.data?.queries;
            setQueryTypes(data);
            setSelectQueryType(data[0]);
        })
    }, []);

    useEffect(() => {
        console.log(selectedCollection);
        if (selectedCollection !== undefined && selectedCollection !== '') {
            console.log(selectedCollection);
            setQueryMeta(QueryAPI.getQueryMeta(selectedCollection));
        }
    }, [selectedCollection]);


    useEffect(() => {
        if (selectedCollection !== '' && selectedQueryType !== '' && queryMeta !== undefined) {
            setPageLoading(false);
            console.log(queryMeta);
        }
    }, [selectedCollection, selectedQueryType, queryMeta]);

    useEffect(() => {
        //Format the configuration data
        const configData = {
            defoe_selection: selectedQueryType,
            preprocess: preprocess[selectedPreprocessIndex][0],
            target_sentences: targets.join(","),
            target_filter: targetAllChecked? "or" : "and",
            start_year: startYear,
            end_year: endYear,
            hit_count: hitCountChecked,
            window: 10,
            file: fileID
        }
        setConfig(configData);
        //Check if all required configuration are made.
        setSubmitDisable(!hasAllRequiredConfigDone(initConfig, configData, queryMeta));
    }, [queryMeta, selectedCollection, selectedQueryType, 
        selectedPreprocessIndex, targets, targetAllChecked, startYear, endYear, hitCountChecked, fileID]);

    function hasAllRequiredConfigDone(initConfig, currentConfig, queryMeta) {
        if (queryMeta === undefined || selectedQueryType === '') {
            return false;
        }
        const fields = queryMeta[selectedQueryType]['inputs'];
        console.log(initConfig);
        console.log(currentConfig)
        console.log(fields);
        for (let field in fields) {
            if (field === "filter") {
                console.log('here');
                const filters = fields[field];
                for (let filter in filters) {
                    if (filters[filter] !== false && currentConfig[filter] === initConfig[filter]) {
                        console.log("filter false");
                        console.log(filter);
                        return false;
                    }
                }
            } else {
                if (fields[field] !== false && currentConfig[field] === initConfig[field]) {
                    console.log("false");
                    return false;
                }
            }
        }
        console.log('ready to submit');
        return true;
    } 

    const onFileUpload = (event) => {
        const file = event.target.files[0];
        QueryAPI.uploadFile(file).then((response) => {
            if (!response.data.success) {
                alert("File upload failed")
                return;
            }
            setFileID(response.data.file);
            setSubmitDisable(false);
        });
    };

    const handledTargetClick = (index) => {
        console.log(index);
        setTargets(current =>
            current.filter((_, i) => {
                return i !== index;
            })
        );
    }

    const handleAddTargetClick = () => {
        if (currentTarget !== '' && targets.indexOf(currentTarget) === -1) {

            setTargets(current =>
                [...current, currentTarget]
            );
            setCurrentTarget('');
        }
    }

    const handleQuerySubmit = () => {

        const data = {
            defoe_selection: selectedQueryType,
            preprocess: preprocess[selectedPreprocessIndex][0],
            target_sentences: targets.join(","),
            target_filter: targetAllChecked? "or" : "and",
            start_year: startYear,
            end_year: endYear,
            hit_count: hitCountChecked,
            window: 10,
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
                return;
            }
            if (r.data.results != null) {
                // precomputed query

                return;
            }
        })
    }

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            {
                !pageLoading?
                    (
                        <Box>
                            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                                Defoe Queries
                            </Typography>
                            <Divider/>
                            <FormControl sx={{ mt: 3, minWidth: 200 }}>
                                <InputLabel id="collection-label">Collection</InputLabel>
                                <Select
                                    labelId="collection-label"
                                    id="collection-select"
                                    label="collection"
                                    value={selectedCollection ? selectedCollection : collections[0]}
                                    autoWidth
                                    onChange={(e) => setSelectedCollection(e.target.value)}
                                >
                                    {
                                        collections.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <FormControl sx={{ mt: 3, ml: 3, minWidth: 200 }}>
                                <InputLabel id="query-type-label">Query type</InputLabel>
                                <Select
                                    labelId="query-type-label"
                                    id="query-ype-select"
                                    label="query type"
                                    value={selectedQueryType}
                                    autoWidth
                                    onChange={(e) => setSelectQueryType(e.target.value)}
                                >
                                    {
                                        queryTypes.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>{queryMeta[selectedQueryType].description}</FormHelperText>
                            </FormControl>
                            <Paper
                                elevation={3}
                                sx={{mt: 3}}
                                hidden={Object.keys(queryMeta[selectedQueryType].inputs).length === 0}>
                                <Grid container>
                                    {
                                        "preprocess" in queryMeta[selectedQueryType].inputs ?
                                            <React.Fragment>
                                                <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                    <Typography component="div" gutterBottom variant="subtitle1">
                                                        Preprocess Treatment
                                                    </Typography>
                                                    <Typography component="div" variant="body2" color="text.disabled">
                                                        {
                                                            preprocess[selectedPreprocessIndex][2]
                                                        }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs textAlign={"right"}  sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                                                    <Select
                                                        id="preprocess-treatment"
                                                        value={selectedPreprocessIndex}
                                                        autoWidth
                                                        onChange={(e) => setSelectedPreprocessIndex(e.target.value)}
                                                    >
                                                        {
                                                            preprocess.map((item, index) => (
                                                                <MenuItem key={index} value={index}>{item[1]}</MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                </Grid>
                                                <Grid item xs={12}><Divider/></Grid>
                                            </React.Fragment>
                                        : null
                                    }
                                    {
                                        "hit_count" in queryMeta[selectedQueryType].inputs ?
                                            <React.Fragment>
                                                <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                    <Typography component="div" gutterBottom variant="subtitle1">
                                                        Hit Count
                                                    </Typography>
                                                    <Typography component="div" variant="body2" color="text.disabled">
                                                        {queryMeta[selectedQueryType].inputs.hit_count[hitCountChecked? 1 : 0][2]}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                                                    <Stack direction="row" spacing={1} alignItems="center"
                                                           justifyContent={"right"}>
                                                        <Typography>{queryMeta[selectedQueryType].inputs.hit_count[0][1]}</Typography>
                                                        <Switch checked={hitCountChecked}
                                                                onChange={(e) => setHitCountChecked(e.target.checked)}
                                                        />
                                                        <Typography>{queryMeta[selectedQueryType].inputs.hit_count[1][1]}</Typography>
                                                    </Stack>
                                                </Grid>
                                                <Grid item xs={12}><Divider/></Grid>
                                            </React.Fragment>
                                            : null
                                    }
                                    {
                                        "file" in queryMeta[selectedQueryType].inputs ?
                                            <React.Fragment>
                                                <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                    <Typography component="div" gutterBottom variant="subtitle1">
                                                        Upload Lexicon File
                                                    </Typography>
                                                    <Typography component="div" variant="body2" color="text.disabled">
                                                        The file should contain a line per keyword and/or key sentence that you want to use in your query.
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs sx={{mr: 5, mt: 2, textAlign: 'right'}}>
                                                    <Button
                                                        variant="outlined"
                                                        component="label"
                                                    >
                                                        Upload File
                                                        <input
                                                            type="file"
                                                            hidden
                                                            accept=".txt"
                                                            onInput={onFileUpload}
                                                        />
                                                    </Button>
                                                    <Typography component="div" variant="body2" marginTop={1}>
                                                        {
                                                            fileID
                                                        }
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}><Divider/></Grid>
                                            </React.Fragment>
                                            : null
                                    }
                                    {
                                        "filter" in queryMeta[selectedQueryType].inputs ?
                                            <React.Fragment>
                                                <Typography
                                                    component="div"
                                                    gutterBottom
                                                    variant="subtitle1"
                                                    sx={{m: 2}}
                                                    color="text.secondary"
                                                >
                                                    Filtering Options (Optional)
                                                </Typography>
                                                <Grid container sx={{ml: 2}}>
                                                    <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                        <Typography component="div" gutterBottom variant="subtitle1">
                                                            Target words or sentences
                                                        </Typography>
                                                        <Grid container spacing={1}>
                                                            {
                                                                targets.map((item, index) => (
                                                                    <Grid item xs="auto">
                                                                        <Button
                                                                            key={index} 
                                                                            sx={{textTransform: 'none'}}
                                                                            onClick={() => handledTargetClick(index)}>{item}
                                                                        </Button>
                                                                    </Grid>
                                                                ))
                                                            }
                                                        </Grid>
                                                    </Grid>
                                                    <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                                                        <Paper>
                                                            <Grid container height={40} justifyContent={"right"}>
                                                                <Grid item xs>
                                                                    <InputBase
                                                                        sx={{pl:1, mt: 0.5}}
                                                                        fullWidth
                                                                        value = {currentTarget}
                                                                        onChange={(e) => setCurrentTarget(e.target.value)}
                                                                        placeholder="Word or Sentence"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs="auto">
                                                                    <Button
                                                                        sx={{height: 40}}
                                                                        onClick={handleAddTargetClick}
                                                                    >
                                                                        Add
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Paper>
                                                    </Grid>
                                                    <Grid item xs={12}><Divider/></Grid>
                                                    <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                        <Typography component="div" gutterBottom variant="subtitle1">
                                                            Select term which contains <b>Any</b> the target words/sentences
                                                        </Typography>
                                                        <Typography component="div" variant="body2" color="text.disabled">
                                                            Or contains <b>All</b> of the target words/sentences.
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto'}} textAlign={"right"}>
                                                        <Switch checked={targetAllChecked}
                                                                onChange={(e) => setTargetAllChecked(e.target.checked)}
                                                        />
                                                    </Grid>
                                                    <Grid item xs={12}><Divider/></Grid>
                                                    <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                        <Typography component="div" gutterBottom variant="subtitle1">
                                                            Year Range
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto', pt: 1, pb: 1}} textAlign={"right"}>
                                                        <Stack direction="row" spacing={2} alignItems="center"
                                                               justifyContent={"right"}>
                                                            <TextField id="start_year" value={startYear} onChange={(e) => setStartYear(e.target.value)}/>
                                                            <Typography>To</Typography>
                                                            <TextField id="end_year" value={endYear} onChange={(e) => setEndYear(e.target.value)} />
                                                        </Stack>
                                                    </Grid>
                                                    <Grid item xs={12}><Divider/></Grid>
                                                </Grid>
                                            </React.Fragment>
                                            : null
                                    }
                                </Grid>
                            </Paper>
                            <Box  sx={{mt: 3}} textAlign={"center"}>
                                <Button
                                    type={"submit"}
                                    variant={"contained"}
                                    disabled={submitDisable}
                                    onClick={handleQuerySubmit}
                                >
                                    Submit Query
                                </Button>
                            </Box>
                        </Box>
                    )
                    :
                    <CircularProgress />
            }
        </Container>
    )
}


export default DefoeQueryPage