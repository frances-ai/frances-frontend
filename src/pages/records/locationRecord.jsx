import {Button, Container, Divider, Link, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import QueryAPI from "../../apis/query";
import PageImageDisplay from "../../components/PageImageDisplay";
import Box from "@mui/material/Box";
import config from "../../config.json"
import MultiSourceDescriptionDisplay from "../../components/MultiSourceDescriptionDisplay";
import ConceptTimeLine from "../../components/timelines/conceptTimeLine.jsx";
import MostSimilarDescriptions from "../../components/timelines/mostSimilarDescriptionsTimeLine.jsx";
import WordClouds from "../../components/timelines/wordCloudsTimeLine.jsx";

function LocationRecordPage() {
    let { recordId } = useParams();
    const [recordInfo, setRecordInfo] = useState();
    const [similarRecords, setSimilarRecords] = useState([]);
    const [similarRecordDescriptions, setSimilarRecordDescriptions] = useState([]);
    const [yearWordFrequencies, setYearWordFrequencies] = useState([]);
    const [conceptRecords, setConceptRecords] = useState([])
    const navigate = useNavigate();
    //console.log(recordId)

    useEffect(() => {
        const record_path =  "LocationRecord/" + recordId
        QueryAPI.get_location_record_info(record_path).then(res => {
            const data = res?.data
            console.log(data)
            setRecordInfo(data)
        })
    }, [recordId])

    useEffect(() => {
        if (recordInfo?.concept_uri) {
            QueryAPI.get_terms_by_concept_uri(recordInfo.concept_uri).then(res => {
                const data = res?.data
                //console.log("concept terms")
                //console.log(data)
                setConceptRecords(data)
            })
        }

        const record_path =  "LocationRecord/" + recordId
        const record_uri = config.hto + "/"  + record_path
        if (recordInfo?.collection) {
            const collection_name = get_collection_name(recordInfo?.collection.name)
            QueryAPI.get_similar_records(record_uri, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setSimilarRecords(data)
            })
            QueryAPI.get_similar_record_descriptions(record_uri, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setSimilarRecordDescriptions(data)
            })
            QueryAPI.get_word_frequencies(recordInfo?.record_name, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setYearWordFrequencies(data)
            })
        }
    }, [recordInfo])


    const get_collection_name = (collection_name) => {
        // example: collection_name: Encyclopaedia Britannica Collection

        return collection_name.substring(0, collection_name.indexOf("Collection") -1)
    }

    const handleCollectionClick = (event, collection) => {
        navigate("/collectionDetails/detail", {state:
                {collection: {
                        uri: collection.uri, name: get_collection_name(collection.name)
                    }}
        })
    }


    return (
        <Box sx={{ minHeight: '70vh'}}>
            {
                recordInfo?.start_page?.uri ? <PageImageDisplay init_page_uri={recordInfo.start_page.uri}/> : null
            }
            <Container maxWidth="md">
                <Typography mt={2} mb={2} component={"div"} variant={"h4"}>{recordInfo?.record_name}</Typography>
                {
                    recordInfo?.references?.length > 0 ?
                        <Box m={1}>
                            <Typography component={"span"} mr={2} variant={"body1"}>See also</Typography>
                            {
                                recordInfo?.references.map((value, index) => (
                                    <Button m={1} key={index} href={value.uri.substring(value.uri.indexOf("/hto/"))}>{value.name}</Button>
                                ))
                            }
                        </Box> : null
                }
                <Typography mb={1} variant={"h6"}>Metadata</Typography>
                <Divider />
                <Stack
                    alignItems="center"
                    pl={1}
                    pr={1}
                    mt={2}
                    spacing={2}
                    divider={<Divider orientation="horizontal" flexItem />}
                >
                    {
                        recordInfo?.alter_names?.length > 0 ? <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                            <Box>
                                <Typography variant={"body1"}>Alternative names</Typography>
                            </Box>
                            <Box>
                                {
                                    recordInfo?.alter_names.map((value, index) => (
                                        <Typography ml={1} key={index}
                                                    component={"span"}
                                                    fontWeight={"bold"}
                                                    variant={"body1"}>
                                            {value}
                                        </Typography>
                                    ))
                                }
                            </Box>
                        </Stack> : null
                    }

                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Was recorded in</Typography>
                        </Box>
                        <Box>
                            <Link mr={1} href={recordInfo?.start_page.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.start_page.number}</Typography>
                            </Link>
                            -
                            <Link ml={1} href={recordInfo?.end_page.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.end_page.number}</Typography>
                            </Link>
                        </Box>
                    </Stack>

                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Volume</Typography>
                        </Box>
                        <Box>
                            <Link mr={1} href={recordInfo?.volume.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.volume.title}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                    {
                        recordInfo?.series?.genre !== "0.0"?
                            <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                                <Box>
                                    <Typography variant={"body1"}>Genre</Typography>
                                </Box>
                                <Box>
                                    <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.series.genre}</Typography>
                                </Box>
                            </Stack> : null
                    }
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Printed in</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.series.print_location}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Year Published</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.series.year_published}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Collection</Typography>
                        </Box>
                        <Box>
                            <Link component="button" onClick={(event) => handleCollectionClick(event, recordInfo?.collection)}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.collection.name}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
            <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                <Container maxWidth="md">
                    {
                        recordInfo?.descriptions? <MultiSourceDescriptionDisplay
                            descriptions={recordInfo?.descriptions}
                            entity_label = {recordInfo?.record_name + ","  + recordInfo?.series.year_published}
                        /> : null
                    }
                </Container>
            </Box>
            {
                similarRecords?.length > 0 ?
                    <Container maxWidth={"md"}>
                        <Typography variant={"h6"} mt={2}>Discover similar records - {recordInfo?.record_name + ","  + recordInfo?.series.year_published}</Typography>
                        <Box>
                            {
                                similarRecords.map((value, index) => (
                                    <Button m={1} key={index} href={value.uri.substring(value.uri.indexOf("/hto/"))}>{value.name}, {value.year}</Button>
                                ))
                            }

                        </Box>
                    </Container>
                    : null
            }
            {
                similarRecordDescriptions?.length > 0?
                    <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                        <Container maxWidth="md">
                            <MostSimilarDescriptions
                                similar_descriptions={similarRecordDescriptions}
                                year={recordInfo?.series.year_published}
                                entity_label = {recordInfo?.record_name + ","  + recordInfo?.series.year_published}
                            ></MostSimilarDescriptions>
                        </Container>
                    </Box>
                    : null
            }
            {
                yearWordFrequencies?
                    <Container maxWidth="md">
                        <WordClouds
                            year_word_frequencies={yearWordFrequencies}
                            entity_label = {recordInfo?.record_name + ","  + recordInfo?.series.year_published}
                            year={recordInfo?.series.year_published}/>
                    </Container> : null
            }
            {
                conceptRecords.length > 0 ?
                    <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                        <Container maxWidth="md">
                            <ConceptTimeLine
                                concept_terms={conceptRecords}
                                entity_label = {recordInfo?.record_name + ","  + recordInfo?.series.year_published}
                                year={recordInfo?.series.year_published}/>
                        </Container>
                    </Box> : null
            }
        </Box>
    )

}

export default LocationRecordPage;
