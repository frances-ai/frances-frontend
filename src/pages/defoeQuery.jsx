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
    MenuItem, Modal,
    Paper,
    Select,
    Stack,
    Switch, TextField,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import CollectionAPI from '../apis/collection';
import Box from "@mui/material/Box";
import {gazetteer, preprocess, sourceProvidersInfo, eb_levels, nls_levels} from "../apis/queryMeta";
import {useNavigate} from "react-router-dom";
import GeoLocationAPI from "../apis/geoLocation"
import {object} from "prop-types";


function DefoeQueryPage() {
    const initConfig = {
        collection: '',
        source_provider: '',
        defoe_selection: '',
        preprocess: '',
        gazetteer: '',
        target_sentences: '',
        target_filter: null,
        exclude_words: '',
        start_year: null,
        end_year: null,
        hit_count: null,
        window: null,
        file: '',
        level: ''
    };

    const DEFAULT_SNIPPET_WINDOW = 10;

    const [sourceProviders, setSourceProviders] = useState([]);
    const [selectedSourceProvider, setSelectedSourceProvider] = useState(initConfig['source_provider']);
    const [levels, setLevels] = useState({})
    const [selectedLevel, setSelectedLevel] = useState(initConfig["level"]);
    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState();
    const [queryMeta, setQueryMeta] = useState();
    const [queryTypes, setQueryTypes] = useState([]);
    const [selectedQueryType, setSelectQueryType] = useState(initConfig['defoe_selection']);
    const [pageLoading, setPageLoading] = useState(true);
    const [submitDisable, setSubmitDisable] = useState(true);
    const [selectedPreprocessIndex, setSelectedPreprocessIndex] = useState(0);
    const [selectedGazetteerIndex, setSelectedGazetteerIndex] = useState(0);
    const [hitCountChecked, setHitCountChecked] = useState(true);
    const [targetAllChecked, setTargetAllChecked] = useState(true);
    const [startYear, setStartYear] = useState(initConfig['start_year']);
    const [endYear, setEndYear] = useState(initConfig['end_year']);
    const [earliestYear, setEarliestYear] = useState();
    const [latestYear, setLatestYear] = useState();
    const [excludeWords, setExcludeWords] = useState([]);
    const [targets, setTargets] = useState([]);
    const [currentTarget, setCurrentTarget] = useState("");
    const [fileID, setFileID] = useState(initConfig['file']);
    const [window, setWindow] = useState(DEFAULT_SNIPPET_WINDOW);
    const [boundingBox, setBoundingBox] = useState([]);
    const [config, setConfig] = useState();

    useEffect(() => {
        //Loading all available configuration metadata
        CollectionAPI.get_collections().then(response => {
            const data = response?.data?.collections;
            setCollections(data);
            let init_collection = data[0]
            setSelectedCollection(init_collection);
            let init_sourceProviders = QueryAPI.getSourceProviders(init_collection.name);
            setSourceProviders(init_sourceProviders);
            setSelectedSourceProvider(init_sourceProviders[0]);
            setLevels(QueryAPI.getLevels(init_collection.name));
        })
        QueryAPI.getAllDefoeQueryTypes().then(response => {
            const data = response?.data?.queries;
            setQueryTypes(data);
            console.log(data)
            setSelectQueryType(data[0]);
        })
    }, []);

    useEffect(() => {
        if (sourceProviders !== undefined && sourceProviders.length > 0) {
            setSelectedSourceProvider(sourceProviders[0]);
        }
    }, [sourceProviders])

    useEffect(() => {
        console.log(selectedCollection);
        if (selectedCollection !== undefined) {
            console.log(selectedCollection);
            const earliest = selectedCollection.year_range[0];
            const latest = selectedCollection.year_range[1];
            setEarliestYear(earliest);
            setLatestYear(latest);
            setStartYear(earliest)
            setEndYear(latest);
            setQueryMeta(QueryAPI.getQueryMeta(selectedCollection.name));
            setSourceProviders(QueryAPI.getSourceProviders(selectedCollection.name))
            setLevels(QueryAPI.getLevels(selectedCollection.name))
        }
    }, [selectedCollection]);


    useEffect(() => {
        console.log("check loading");
        console.log(sourceProviders);
        console.log(selectedSourceProvider);
        if (selectedCollection !== undefined && selectedSourceProvider !== '' && selectedQueryType !== '' && queryMeta !== undefined) {
            if ("level" in queryMeta[selectedQueryType].inputs && selectedLevel === "") {
                setSelectedLevel(Object.keys(levels)[0])
            }
            setPageLoading(false);
            console.log(queryMeta);
        }
    }, [selectedCollection,selectedSourceProvider, selectedQueryType, queryMeta]);

    function formatConfigData() {
        //Format the configuration data
        let configData = {...initConfig};
        configData.collection = selectedCollection.name;
        configData.defoe_selection = selectedQueryType;
        configData.source_provider = selectedSourceProvider;

        const inputs = queryMeta[selectedQueryType].inputs;

        console.log(configData)

        if ("preprocess" in inputs) {
            configData.preprocess = preprocess[selectedPreprocessIndex][0];
        }

        if ("hit_count" in inputs) {
            configData.hit_count = hitCountChecked ? inputs['hit_count'][1][0] : inputs['hit_count'][0][0];
        }

        if ("file" in inputs) {
            configData.file = fileID;
        }

        if ("gazetteer" in inputs) {
            configData.gazetteer = gazetteer[selectedGazetteerIndex][0];
        }

        if ("level" in inputs) {
            configData.level = selectedLevel;
        }

        if ("filter" in inputs) {
            if ("target_sentences" in inputs["filter"]) {
                console.log(targets);
                configData.target_sentences = targets.join(",");
            }

            if ("exclude_words" in inputs["filter"]) {
                console.log(excludeWords);
                configData.exclude_words = excludeWords.join(",");
            }

            if ("target_filter" in inputs["filter"] && targets.length > 0) {
                configData.target_filter = targetAllChecked ? "or" : "and";
            }

            if ("start_year" in inputs["filter"]) {
                configData.start_year = startYear;
            }

            if ("end_year" in inputs["filter"]) {
                configData.end_year = endYear;
            }

            if ("window" in inputs["filter"]) {
                configData.window = window;
            }

            if ("bounding_box" in inputs["filter"] && boundingBox.length > 0) {
                configData.bounding_box = boundingBox.join(" ");
            }
        }
        return configData;
    }

    useEffect(() => {
        console.log("check config")
        if (pageLoading) {
            return;
        }

        const configData = formatConfigData();
        setConfig(configData);
        //Check if all required configuration are made.
        setSubmitDisable(!hasAllRequiredConfigDone(initConfig, configData, queryMeta));
    }, [queryMeta, selectedCollection, selectedSourceProvider, selectedQueryType, selectedLevel,
        selectedPreprocessIndex, boundingBox, selectedGazetteerIndex, targets, targetAllChecked, excludeWords, selectedLevel,
        startYear, endYear, hitCountChecked, fileID, window]);

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


    const navigate = useNavigate();

    const handleQuerySubmit = () => {

        console.log(config);
        QueryAPI.submitDefoeQuery(config).then((r) => {
            console.log(r);
            if (!r.data.success) {
                alert("Defoe query failed to submit");
                return;
            }

            navigate("/defoeQueryResult", {state: {taskId: r.data.id}})
        })
    }

    const handleStartYearInputChange = (event) => {
        let start_year = parseInt(event.target.value);
        if (isNaN(start_year)) {
            start_year = earliestYear;
        }
        setStartYear(start_year);
    }

    const handleEndYearInputChange = (event) => {
        let end_year = parseInt(event.target.value);
        if (isNaN(end_year)) {
            end_year = latestYear;
        }
        setEndYear(end_year);
    }

    const handleWindowInputChange = (event) => {
        let snippet_window = parseInt(event.target.value);
        if (isNaN(snippet_window)) {
            snippet_window = DEFAULT_SNIPPET_WINDOW;
        }
        setWindow(snippet_window);
    }


    function ProcessesConfig() {
        return <React.Fragment>
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
            <Grid item xs textAlign={"right"} sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
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
        </React.Fragment>;
    }


    function BoundingBoxConfig() {
        const [open, setOpen] = useState(false);
        const [west, setWest] = useState("");
        const [errorWest, setErrorWest] = useState(false);
        const [errorMsgWest, setErrorMsgWest] = useState("");
        const [north, setNorth] = useState("");
        const [errorNorth, setErrorNorth] = useState(false);
        const [errorMsgNorth, setErrorMsgNorth] = useState("");
        const [south, setSouth] = useState("");
        const [errorSouth, setErrorSouth] = useState(false);
        const [errorMsgSouth, setErrorMsgSouth] = useState("");
        const [east, setEast] = useState("");
        const [errorEast, setErrorEast] = useState(false);
        const [errorMsgEast, setErrorMsgEast] = useState("");
        const [allValid, setAllValid] = useState(false);

        const [locations, setLocations] = useState([]);
        const [selectedLocationIndex, setSelectedLocationIndex] = useState(-1);

        const style = {
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            width: '60%',
            height: '70%',
            borderRadius: 1,
            p: 2,
        };

        const unselected_style = {
            textTransform: "none",
            color: "rgba(0,0,0,0.7)",
            alignItems: "start",
            justifyContent: "start"
        }


        const selected_style = {
            textTransform: "none",
            color: "#046ffa",
            alignItems: "start",
            justifyContent: "start"
        }

        useEffect(() => {
            if (boundingBox.length === 4) {
                setWest(boundingBox[0]);
                setNorth(boundingBox[1]);
                setEast(boundingBox[2]);
                setSouth(boundingBox[3]);
            }
        }, [])


        useEffect(() => {
            if (!errorWest && !errorNorth && !errorSouth && !errorEast &&
                (west !== "" && north !== "" && east !== "" && south!== "")) {
                setAllValid(true);
            } else {
                setAllValid(false);
            }
        }, [west, east, north, south, errorWest, errorEast, errorNorth, errorSouth])

        const handleBoundingBoxConfirmClick = () => {
            setBoundingBox([
                parseFloat(west),
                parseFloat(north),
                parseFloat(east),
                parseFloat(south)
            ])
        }

        useEffect( () => {
            if (west === "") {
                return
            }
            // TODO Validate input value: -180.0000000001111111 should not be accepted!
            if (!isNaN(parseFloat(west))) {
                console.log(west === "")
                if (west >= -180 && west <= 180) {
                    setErrorWest(false);
                    setErrorMsgWest(null);
                } else {
                    setErrorMsgWest("Over the range [-180, 180]!")
                    setErrorWest(true);
                }
            } else {
                setErrorMsgWest("Not a number!")
                setErrorWest(true);
            }
        }, [west])

        useEffect(() => {
            if (east === "") {
                return
            }
            // TODO Validate input value: -180.0000000001111111 should not be accepted!
            if (!isNaN(parseFloat(east))) {
                if (east >= -180 && east <= 180) {
                    setErrorEast(false);
                    setErrorMsgEast(null);
                } else {
                    setErrorMsgEast("Over the range [-180, 180]!")
                    setErrorEast(true);
                }
            } else {
                setErrorMsgEast("Not a number!")
                setErrorEast(true);
            }
        }, [east])

        useEffect( () => {
            if (north === "") {
                return
            }
            // TODO Validate input value: -90.0000000001111111 should not be accepted!
            if (!isNaN(parseFloat(north))) {
                if (north >= -90 && north <= 90) {
                    setErrorNorth(false);
                    setErrorMsgNorth(null);
                } else {
                    setErrorMsgNorth("Over the range [-90, 90]!")
                    setErrorNorth(true);
                }
            } else {
                setErrorMsgNorth("Not a number!")
                setErrorNorth(true);
            }
        }, [north])

        useEffect( () => {
            if (south === "") {
                return
            }
            // TODO Validate input value: -90.0000000001111111 should not be accepted!
            if (!isNaN(parseFloat(south))) {
                if (south >= -90 && south <= 90) {
                    setErrorSouth(false);
                    setErrorMsgSouth(null);
                } else {
                    setErrorMsgSouth("Over the range [-90, 90]!")
                    setErrorSouth(true);
                }
            } else {
                setErrorMsgSouth("Not a number!")
                setErrorSouth(true);
            }
        }, [south])

        const handleSearchPlace = (event) => {
            const keyword = event.target.value;
            // Get result locations
            GeoLocationAPI.searchBoundingBoxByPlace(keyword).then((response => {
                setLocations(response?.data);
                setSelectedLocationIndex(-1);
            }))
        }

        const handleLocationButtonClick = (index) => {
            setSelectedLocationIndex(index);
            const location_bounding_box = locations[index].bounding_box;
            // location.bounding_box: s n w e
            // see https://nominatim.org/release-docs/develop/api/Output/#boundingbox
            console.log(location_bounding_box)
            setNorth(location_bounding_box[0]);
            setSouth(location_bounding_box[1]);
            setWest(location_bounding_box[2]);
            setEast(location_bounding_box[3]);
        }

        return <React.Fragment>
            <Grid item xs={5} textAlign={"left"} sx={{m: 2}}>
                <Typography component="div" gutterBottom variant="subtitle1">
                    Bounding Box
                </Typography>
                <Typography component="div" variant="body2" color="text.disabled">
                    The geoparser will prefer places within bounding box, but will still choose locations outside it if other factors give them higher weighting.
                </Typography>
            </Grid>
            <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                <Stack
                    direction="row"
                    divider={<Divider orientation="vertical" variant={"middle"} flexItem />}
                    spacing={1}
                    alignItems="center"
                    justifyContent={"right"}
                >
                    <Typography component="div" gutterBottom variant="body1" fontSize={15}>
                        {
                            boundingBox.join(" ")
                        }
                    </Typography>
                    <Button component="div" onClick={() => setOpen(true)}>Edit</Button>
                </Stack>
            </Grid>
            <Grid item xs={12}><Divider/></Grid>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-bounding_box-edit"
                aria-describedby="modal-edit-bounding_box"
            >
                <Box sx={style}>
                    <Typography component="div" gutterBottom variant="h5">
                        Edit bounding box
                    </Typography>
                    <Typography component="div" gutterBottom variant="body1">
                        You can either manually enter the bounding box or search and select a place. The format of bounding box is:
                        <div style={{textAlign: "center"}}><strong>W N E S</strong>,  where W(est) N(orth) E(ast) S(outh) are decimal degrees</div>
                    </Typography>
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': { m: 1, width: '25ch' },
                            marginTop: 1
                        }}
                        noValidate
                        autoComplete="off"
                    >
                        <Stack direction={"row"}>
                            <TextField
                                error={errorWest}
                                id="west"
                                label="West"
                                value={west}
                                onChange={(event) => setWest(event.target.value)}
                                helperText={errorMsgWest}
                                />
                            <TextField
                                error={errorNorth}
                                id="north"
                                label="North"
                                value={north}
                                onChange={(event) => setNorth(event.target.value)}
                                helperText={errorMsgNorth}
                           />
                            <TextField
                                error={errorEast}
                                id="east"
                                label="East"
                                value={east}
                                onChange={(event) => setEast(event.target.value)}
                                helperText={errorMsgEast}
                           />
                            <TextField
                                error={errorSouth}
                                id="south"
                                label="South"
                                value={south}
                                onChange={(event) => setSouth(event.target.value)}
                                helperText={errorMsgSouth}
                            />
                        </Stack>
                    </Box>
                    <Box sx={{margin: 2}}>
                        <TextField
                            sx={{marginBottom: 2}}
                            fullWidth
                            label={"Search a place for its bounding box"}
                            variant="outlined"
                            onChange={handleSearchPlace}
                        />
                        <Stack direction={"column"} maxHeight={250} sx={{overflowY: "scroll"}}>
                            {
                                locations.map((location, index) => (
                                    <Button
                                        key={index}
                                        size="large"
                                        onClick={() => handleLocationButtonClick(index)}
                                        sx={index === selectedLocationIndex ? selected_style : unselected_style }
                                    >
                                        {location.name}
                                    </Button>
                                ))

                            }
                        </Stack>
                    </Box>
                    <Stack direction={"row"} sx={{position: "absolute", right: 30, bottom: 20}}>
                        <Button color={"secondary"} component={"div"} onClick={() => setOpen(false)}>Close</Button>
                        <Button component={"div"} disabled={!allValid} onClick={handleBoundingBoxConfirmClick}>Confirm</Button>
                        {
                            boundingBox.length > 0 ?
                                <Button color={"warning"} component={"div"} onClick={() => setBoundingBox([])}>Unset</Button>
                                : null
                        }
                    </Stack>
                </Box>
            </Modal>
        </React.Fragment>;
    }


    function GazetteerConfig() {
        return <React.Fragment>
            <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                <Typography component="div" gutterBottom variant="subtitle1">
                    Gazetteer
                </Typography>
                <Typography component="div" variant="body2" color="text.disabled">
                    {
                        gazetteer[selectedGazetteerIndex][2]
                    }
                </Typography>
            </Grid>
            <Grid item xs textAlign={"right"} sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                <Select
                    id="gazetteer"
                    value={selectedGazetteerIndex}
                    autoWidth
                    onChange={(e) => setSelectedGazetteerIndex(e.target.value)}
                >
                    {
                        gazetteer.map((item, index) => (
                            <MenuItem key={index} value={index}>{item[1]}</MenuItem>
                        ))
                    }
                </Select>
            </Grid>
            <Grid item xs={12}><Divider/></Grid>
        </React.Fragment>;
    }

    function HitCountConfig() {
        return <React.Fragment>
            <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                <Typography component="div" gutterBottom variant="subtitle1">
                    Hit Count
                </Typography>
                <Typography component="div" variant="body2" color="text.disabled">
                    {queryMeta[selectedQueryType].inputs.hit_count[hitCountChecked ? 1 : 0][2]}
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
        </React.Fragment>;
    }

    function ExcludeWordsConfig() {

        const [currentWord, setCurrentWord] = useState("")

        const handledExcludeWordClick = (index) => {
            console.log(index);
            setExcludeWords(current =>
                current.filter((_, i) => {
                    return i !== index;
                })
            );
        }

        const handleAddExcludeWordClick = () => {
            if (currentWord !== '' && excludeWords.indexOf(currentWord) === -1) {
                setExcludeWords(current =>
                    [...current, currentWord]
                );
                setCurrentWord('');
            }
        }

        return <>
            <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                <Typography component="div" gutterBottom variant="subtitle1">
                    Exclude Words
                </Typography>
                <Grid container spacing={1}>
                    {
                        excludeWords.map((item, index) => (
                            <Grid item xs="auto" key={index}>
                                <Button
                                    sx={{textTransform: 'none'}}
                                    onClick={() => handledExcludeWordClick(index)}>{item}
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
                                value = {currentWord}
                                onChange={(e) => setCurrentWord(e.target.value)}
                                placeholder="enter word"
                            />
                        </Grid>
                        <Grid item xs="auto">
                            <Button
                                sx={{height: 40}}
                                onClick={handleAddExcludeWordClick}
                            >
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item xs={12}><Divider/></Grid>
        </>
    }

    function LevelConfig() {

        return <React.Fragment>
            <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                <Typography component="div" gutterBottom variant="subtitle1">
                    Level
                </Typography>
                <Typography component="div" variant="body2" color="text.disabled">
                    {levels[selectedLevel][1]}
                </Typography>
            </Grid>
            <Grid item xs textAlign={"right"} sx={{mr: 5, mt: 'auto', mb: 'auto'}}>
                <Select
                    id="level"
                    value={selectedLevel}
                    autoWidth
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    {
                        Object.keys(levels).map((item, index) => (
                            <MenuItem key={index} value={item}>{levels[item][0]}</MenuItem>
                        ))
                    }
                </Select>
            </Grid>
            <Grid item xs={12}><Divider/></Grid>
        </React.Fragment>;
    }

    function FileConfig() {
        return <React.Fragment>
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
        </React.Fragment>;
    }


    const handleCollectionSelect = (event) => {
        setSelectedCollection(collections.find(collection => collection.name === event.target.value))
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
                                    value={selectedCollection?.name}
                                    autoWidth
                                    onChange={handleCollectionSelect}
                                >
                                    {
                                        collections.map((item, index) => (
                                            <MenuItem key={index} value={item.name}>{item.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>

                            <FormControl sx={{ mt: 3, ml: 3, minWidth: 100 }}>
                                <InputLabel id="source-provider-label">Source</InputLabel>
                                <Select
                                    labelId="source-provider-label"
                                    id="source-provider-select"
                                    label="source provider"
                                    value={selectedSourceProvider}
                                    autoWidth
                                    onChange={(e) => setSelectedSourceProvider(e.target.value)}
                                >
                                    {
                                        sourceProviders.map((item, index) => (
                                            <MenuItem key={index} value={item}>{item}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>{sourceProvidersInfo[selectedSourceProvider][0]}</FormHelperText>
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
                                {/*<FormHelperText>{queryMeta[selectedQueryType].description}</FormHelperText>*/}
                            </FormControl>
                            <Paper
                                elevation={3}
                                sx={{mt: 3}}
                                hidden={Object.keys(queryMeta[selectedQueryType].inputs).length === 0}>
                                <Grid container>
                                    {
                                        "preprocess" in queryMeta[selectedQueryType].inputs ?
                                            <ProcessesConfig/>
                                        : null
                                    }
                                    {
                                        "hit_count" in queryMeta[selectedQueryType].inputs ?
                                            <HitCountConfig/>
                                            : null
                                    }
                                    {
                                        "file" in queryMeta[selectedQueryType].inputs ?
                                            <FileConfig/>
                                            : null
                                    }
                                    {
                                        "gazetteer" in queryMeta[selectedQueryType].inputs ?
                                            <GazetteerConfig />
                                            : null
                                    }
                                    {
                                        "level" in queryMeta[selectedQueryType].inputs && levels !== undefined && selectedLevel !== ""?
                                            <LevelConfig />
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
                                                    {
                                                        "target_filter" in queryMeta[selectedQueryType].inputs['filter'] ?
                                                            <>
                                                                <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                                    <Typography component="div" gutterBottom variant="subtitle1">
                                                                        Target words or sentences
                                                                    </Typography>
                                                                    <Grid container spacing={1}>
                                                                        {
                                                                            targets.map((item, index) => (
                                                                                <Grid item xs="auto" key={index}>
                                                                                    <Button
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
                                                            </>
                                                            : null
                                                    }
                                                    {
                                                        "exclude_words" in queryMeta[selectedQueryType].inputs['filter'] ?
                                                            <ExcludeWordsConfig /> : null

                                                    }
                                                    {
                                                        "start_year" in queryMeta[selectedQueryType].inputs['filter'] ?
                                                            <>
                                                                <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                                    <Typography component="div" gutterBottom variant="subtitle1">
                                                                        Year Range
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto', pt: 1, pb: 1}} textAlign={"right"}>
                                                                    <Stack direction="row" spacing={2} alignItems="center"
                                                                           justifyContent={"right"}>
                                                                        <TextField id="start_year"
                                                                                   type={"number"}
                                                                                   InputProps={{
                                                                                       inputProps: {
                                                                                           max: 1900, min: 1771
                                                                                       }
                                                                                   }}
                                                                                   value={startYear}
                                                                                   onChange={(e) => handleStartYearInputChange(e)}
                                                                        />
                                                                        <Typography>To</Typography>
                                                                        <TextField id="end_year"
                                                                                   type={"number"}
                                                                                   InputProps={{
                                                                                       inputProps: {
                                                                                           max: 1900, min: 1771
                                                                                       }
                                                                                   }}
                                                                                   value={endYear}
                                                                                   onChange={(e) => handleEndYearInputChange(e)} />
                                                                    </Stack>
                                                                </Grid>
                                                                <Grid item xs={12}><Divider/></Grid>
                                                            </>
                                                            : null
                                                    }
                                                    {
                                                        "bounding_box" in queryMeta[selectedQueryType].inputs['filter'] ?
                                                            <BoundingBoxConfig/>
                                                            : null
                                                    }
                                                </Grid>
                                                {
                                                    "window" in queryMeta[selectedQueryType].inputs['filter'] ?
                                                        <React.Fragment>
                                                            <Grid item xs={8} textAlign={"left"} sx={{m: 2}}>
                                                                <Typography component="div" gutterBottom variant="subtitle1">
                                                                    Snippet Window
                                                                </Typography>
                                                            </Grid>
                                                            <Grid item xs sx={{mr: 5, mt: 'auto', mb: 'auto', pt: 1, pb: 1}} textAlign={"right"}>
                                                                <Stack direction="row" spacing={2} alignItems="center"
                                                                       justifyContent={"right"}>
                                                                    <TextField id="window" type={"number"}
                                                                               InputProps={{
                                                                                   inputProps: {
                                                                                       min: 0
                                                                                   }
                                                                               }}
                                                                               value={window}
                                                                               onChange={(e) => handleWindowInputChange(e)}/>
                                                                </Stack>
                                                            </Grid>
                                                            <Grid item xs={12}><Divider/></Grid>
                                                        </React.Fragment>
                                                        : null
                                                }

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