import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia, CircularProgress,
    Container, Divider,
    Grid, Link,
    Paper,
    Stack, TextField,
    Typography
} from "@mui/material";
import {useLocation} from "react-router-dom";
import React, {useEffect, useState} from "react";
import CollectionAPI from "../apis/collection"
import Box from "@mui/material/Box";

function Editions(props) {
    const {collection, selectedES, setSelectedES} = props;

    const [editionsOrSeries, setEditionsOrSeries] = useState([]);
    const [editionsOrSeriesSearchResults, setEditionsOrSeriesSearchResults] = useState([]);
    const [esDetail, setESDetail] = useState();

    const unselected_style = {
        textTransform: "none",
        color: "#5f6368",
        alignItems: "start",
        justifyContent: "start"
    }


    const selected_style = {
        textTransform: "none",
        color: "#000000",
        borderRight: "4px solid #3062a1",
        alignItems: "start",
        justifyContent: "start"
    }


    const limitTextLength = (text) => {
        const maxLength = 55;
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }

        return text;

    }


    useEffect(() => {
        if (collection.id === 1) {
            CollectionAPI.get_eb_editions().then((response) => {
                const es = response?.data;
                setEditionsOrSeries(es);
                setEditionsOrSeriesSearchResults(es);
                if (es.length > 0) {
                    setSelectedES(es[0]);
                }
            })
        } else {
            CollectionAPI.get_nls_series(collection.name).then((response) => {
                const es = response?.data;
                setEditionsOrSeries(es);
                setEditionsOrSeriesSearchResults(es);
                if (es.length > 0) {
                    setSelectedES(es[0]);
                }
            })
        }
    }, [])

    const handleEditionSerieSearch = (event) => {
        console.log(event.target.value);
        const current_input = event.target.value;
        if (current_input === "") {
            setEditionsOrSeriesSearchResults(editionsOrSeries);
        } else {
            const re = new RegExp("[0-9a-zA-Z]*" + current_input + "[0-9a-zA-Z]*", "i")
            const matchedResults = editionsOrSeries.filter(es => es.name.search(re) > -1);
            setEditionsOrSeriesSearchResults(matchedResults);
            console.log(editionsOrSeriesSearchResults)
        }
    }

    useEffect(() => {
        if (selectedES !== undefined) {
            if (collection.id === 1) {
                CollectionAPI.get_eb_edition_detail(selectedES.uri).then((response) => {
                    console.log(response?.data);
                    const es = response?.data;
                    setESDetail(es);
                })
            } else {
                CollectionAPI.get_nls_serie_detail(collection.name, selectedES.uri).then((response) => {
                    console.log(response?.data);
                    const es = response?.data;
                    setESDetail(es);
                })
            }
        }
    }, [selectedES])


    return (
        <React.Fragment>
            <Typography gutterBottom variant={"h5"} component="div">
                {(collection.id === 1? "Editions" : "Series")} for {collection.name}
            </Typography>
            <Grid container columnSpacing={{ sm: 1, md: 5}} sx={{mt:3}}>
                <Grid item md={5} xs={12}>
                    <TextField
                        sx={{marginBottom: 2}}
                        fullWidth
                        onChange={handleEditionSerieSearch}
                        label={"Search " + (collection.id === 1? "Edition" : "Serie")}
                        variant="outlined"/>
                    <Stack direction={"column"} maxHeight={300} sx={{overflowY: "scroll"}}>
                        {
                            editionsOrSeriesSearchResults.map((value, index) => (
                                <Button
                                    key={index}
                                    size="large"
                                    onClick={() => setSelectedES(value)}
                                    sx={value.uri === selectedES.uri? selected_style : unselected_style}>
                                    {limitTextLength(value.name)}
                                </Button>
                            ))
                        }
                    </Stack>
                </Grid>
                <Grid item md={1} xs={12}>
                    <Divider sx={{width: 2, margin: "0 auto"}} orientation={"vertical"} variant="middle"/>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper sx={{padding: 3}}>
                        <Grid container rowSpacing={2} justifyContent="space-between">
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"h6"}  color={"text.secondary"} component="div">
                                    Title:
                                </Typography>
                            </Grid>
                            <Grid item md={10}>
                                <Typography gutterBottom variant={"h6"} textAlign={"end"} component="div">
                                    {esDetail?.title}
                                </Typography>
                            </Grid>
                            {
                                esDetail?.subtitle?
                                    <React.Fragment>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                SubTitle:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={10}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {esDetail?.subtitle}
                                            </Typography>
                                        </Grid>
                                        <Grid item md={3}>
                                            <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                                Publication Year:
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.year}
                                </Typography>
                            </Grid>
                            <Grid item md={3}></Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Number:
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.number}
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Printed At:
                                </Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.printedAt}
                                </Typography>
                            </Grid>
                            <Grid item md={2} />
                            <Grid item md={3}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Shelf Locator:
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.shelfLocator}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Physical Description:
                                </Typography>
                            </Grid>
                            <Grid item md={8}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.physicalDescription}
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    MMSID
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.MMSID}
                                </Typography>
                            </Grid>
                            <Grid item md={1}/>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Genre:
                                </Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.genre}
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Language:
                                </Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.language}
                                </Typography>
                            </Grid>
                            <Grid item md={1}/>
                            <Grid item md={4}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Number of Volumes:
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {esDetail?.numOfVolumes}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}


function Volumes(props) {

    const {collection, selectedES} = props;

    const [volumes, setVolumes] = useState([]);
    const [selectedVolume, setSelectedVolume] = useState();
    const [volumesSearchResults, setVolumesSearchResults] = useState([]);
    const [volumeDetail, setVolumeDetail] = useState();

    useEffect(() => {
        CollectionAPI.get_volumes(collection.name, selectedES.uri).then ((response) => {
            console.log(response?.data);
            const volumes = response?.data;
            setVolumes(volumes);
            setVolumesSearchResults(volumes);
            if (volumes.length > 0) {
                setSelectedVolume(volumes[0]);
            }
        })
    }, [selectedES])


    useEffect(() => {
        console.log(selectedVolume)
        if (selectedVolume !== undefined) {
            CollectionAPI.get_volume_detail(collection.name, selectedVolume.uri).then((response) => {
                console.log(response?.data);
                const volume = response?.data;
                setVolumeDetail(volume);
            })
        }
    }, [selectedVolume])


    const unselected_style = {
        textTransform: "none",
        color: "#5f6368",
        alignItems: "start",
        justifyContent: "start"
    }


    const selected_style = {
        textTransform: "none",
        color: "#000000",
        borderRight: "4px solid #3062a1",
        alignItems: "start",
        justifyContent: "start"
    }

    const handleVolumeSearch = (event) => {
        console.log(event.target.value);
        const current_input = event.target.value;

        if (current_input === "") {
            setVolumesSearchResults(volumes);
        } else {
            const re = new RegExp("[0-9a-zA-Z]*" + current_input + "[0-9a-zA-Z]*", "i")
            const matchedResults = volumes.filter(es => es.name.search(re) > -1);
            setVolumesSearchResults(matchedResults);
        }
    }


    const limitTextLength = (text) => {
        const maxLength = 55;
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + "...";
        }

        return text;

    }


    return (
        <React.Fragment>
            <Typography gutterBottom variant={"h5"} component="div">
                Volumes for {limitTextLength(selectedES.name)}
            </Typography>
            <Grid container columnSpacing={{ sm: 1, md: 5}} sx={{mt:3}}>
                <Grid item md={5} xs={12}>
                    <TextField
                        sx={{marginBottom: 2}}
                        fullWidth
                        onChange={handleVolumeSearch}
                        label={"Search Volume"}
                        variant="outlined"/>
                    <Stack direction={"column"} maxHeight={300} sx={{overflowY: "scroll"}}>
                        {
                            volumesSearchResults.map((value, index) => (
                                <Button
                                    key={index}
                                    size="large"
                                    onClick={() => setSelectedVolume(value)}
                                    sx={value.uri === selectedVolume?.uri? selected_style : unselected_style}>
                                    {limitTextLength(value.name)}
                                </Button>
                            ))
                        }
                    </Stack>
                </Grid>
                <Grid item md={1} xs={12}>
                    <Divider sx={{width: 2, margin: "0 auto"}} orientation={"vertical"} variant="middle"/>
                </Grid>
                <Grid item md={6} xs={12}>
                    <Paper sx={{padding: 3}}>
                        <Grid container rowSpacing={2} columnSpacing={3} justifyContent="space-between">
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"h6"}  color={"text.secondary"} component="div">
                                    Title:
                                </Typography>
                            </Grid>
                            <Grid item md={10}>
                                <Typography gutterBottom variant={"h6"} textAlign={"end"} component="div">
                                    {volumeDetail?.detail?.title}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Permanent URL:
                                </Typography>
                            </Grid>
                            <Grid item md={8}>
                                <Link href={volumeDetail?.detail?.permanentURL}>
                                    <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                        {volumeDetail?.detail?.permanentURL}
                                    </Typography>
                                </Link>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                    ID:
                                </Typography>
                            </Grid>
                            <Grid item md={3}>
                                <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                    {volumeDetail?.detail?.id}
                                </Typography>
                            </Grid>
                            <Grid item md={3}/>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Number:
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {volumeDetail?.detail?.number}
                                </Typography>
                            </Grid>
                            <Grid item md={4}>
                                <Typography gutterBottom variant={"body1"}  color={"text.secondary"} component="div">
                                    Number of Pages:
                                </Typography>
                            </Grid>
                            <Grid item md={2}>
                                <Typography gutterBottom variant={"body1"} textAlign={"end"} component="div">
                                    {volumeDetail?.detail?.numOfPages}
                                </Typography>
                            </Grid>
                            {
                                volumeDetail?.detail?.letters?
                                    <React.Fragment>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Letters:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.detail?.letters}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                volumeDetail?.detail?.part?
                                    <React.Fragment>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Part:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.detail?.part}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                volumeDetail?.statistics?.numOfArticles?
                                    <React.Fragment>
                                        <Grid item md={4}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Number of Articles:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.statistics?.numOfArticles}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                volumeDetail?.statistics?.numOfTopics?
                                    <React.Fragment>
                                        <Grid item md={4}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Number of Topics:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.statistics?.numOfTopics}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                volumeDetail?.statistics?.numOfDistinctArticles?
                                    <React.Fragment>
                                        <Grid item md={4}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Number of Distinct Articles:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.statistics?.numOfDistinctArticles}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                            {
                                volumeDetail?.statistics?.numOfDistinctTopics?
                                    <React.Fragment>
                                        <Grid item md={4}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Number of Distinct Topics:
                                            </Typography>
                                        </Grid>
                                        <Grid item md={2}>
                                            <Typography gutterBottom variant={"subtitle1"} textAlign={"end"} component="div">
                                                {volumeDetail?.statistics?.numOfDistinctTopics}
                                            </Typography>
                                        </Grid>
                                    </React.Fragment>
                                    : null
                            }
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

function CollectionDetailResult() {
    const state = useLocation().state;
    const collection = state?.collection;
    const [collectionDetail, setCollectionDetail] = useState();
    const [selectedES, setSelectedES] = useState();


    useEffect(() => {
        CollectionAPI.get_collection_detail(collection.id).then((response) => {
            console.log(response?.data);
            setCollectionDetail(response?.data);
        })
    }, [])


    return (
        <Box sx={{mt: 2, minHeight: '70vh'}}>
            <Container maxWidth="lg">
                <Grid container columnSpacing={{ sm: 2, md: 15 }} sx={{mt:5}}>
                    {
                        collectionDetail?
                            <Grid item md={5} xs={12}>
                                <Card>
                                    <CardMedia
                                        component="img"
                                        image={CollectionAPI.get_image_url(collectionDetail.cover_image_name_origin)}
                                        alt={collectionDetail?.cover_image_name_origin}
                                    />
                                    <CardContent>
                                        <Stack direction={"row"} justifyContent={"space-between"}>
                                            <Typography gutterBottom variant={"subtitle1"} color={"text.secondary"} component="div">
                                                Covers years
                                            </Typography>
                                            <Typography gutterBottom variant={"body1"} fontWeight={"bold"} component="div">
                                                {collectionDetail?.year_range[0] + "-" +  collectionDetail?.year_range[1]}
                                            </Typography>
                                        </Stack>
                                        <Stack direction={"row"} justifyContent={"space-between"}>
                                            <Typography gutterBottom variant={"subtitle1"}  color={"text.secondary"} component="div">
                                                Number of image files
                                            </Typography>
                                            <Typography gutterBottom variant={"body1"} fontWeight={"bold"} component="div">
                                                {collectionDetail?.num_image_files}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                    <CardActions>
                                        <Button size="small" href={collectionDetail?.source}>Source</Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                            : <CircularProgress />
                    }
                    <Grid item md={7} xs={12}>
                        <Typography gutterBottom variant={"h3"} textAlign={"center"} component="div" marginBottom={3}>
                            {collection.name}
                        </Typography>
                        {
                            collectionDetail?.description.map((value, index) => (
                                <Typography key={index} gutterBottom variant={"body1"} component="div">
                                    {value}
                                </Typography>
                            ))
                        }
                    </Grid>
                </Grid>
            </Container>
            <Box sx={{backgroundColor: "#f8f9fa", marginTop: 5}}>
                <Container maxWidth="lg" sx={{paddingTop: 3, paddingBottom: 3}}>
                    <Editions collection={collection} selectedES={selectedES} setSelectedES={setSelectedES}/>
                </Container>
            </Box>
            {
                selectedES?
                    <Box sx={{backgroundColor: "#ffffff"}}>
                        <Container maxWidth="lg" sx={{paddingTop: 3, paddingBottom: 3}}>
                            <Volumes collection={collection} selectedES={selectedES}/>
                        </Container>
                    </Box>
                    : null
            }
        </Box>
    )
}

export default CollectionDetailResult;