import {Button, Container, Divider, Stack, Typography, Link} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import QueryAPI from "../../apis/query"
import Box from "@mui/material/Box";
import PageImageDisplay from "../../components/PageImageDisplay";
import config from "../../config.json"
import ConceptTimeLine from "../../components/timelines/conceptTimeLine";
import WordClouds from "../../components/timelines/wordCloudsTimeLine";
import MostSimilarDescriptions from "../../components/timelines/mostSimilarDescriptionsTimeLine";
import MultiSourceDescriptionDisplay from "../../components/MultiSourceDescriptionDisplay";


function TopicTermRecordPage() {
    let { termId } = useParams();
    const [termInfo, setTermInfo] = useState();
    const [similarTermDescriptions, setSimilarTermDescriptions] = useState([])
    const [similarTerms, setSimilarTerms] = useState([]);
    const [yearWordFrequencies, setYearWordFrequencies] = useState();
    const [conceptTerms, setConceptTerms] = useState([])
    const navigate = useNavigate();


    useEffect(() => {
        const term_path =  "TopicTermRecord/" + termId
        QueryAPI.get_term_info(term_path).then(res => {
            const data = res?.data
            //console.log(data)
            setTermInfo(data)
        })
    }, [termId])


    useEffect(() => {
        if (termInfo !== undefined) {
            QueryAPI.get_terms_by_concept_uri(termInfo.concept_uri).then(res => {
                const data = res?.data
                //console.log("concept terms")
                //console.log(data)
                setConceptTerms(data)
            })
        }

        const term_path =  "TopicTermRecord/" + termId
        const term_uri = config.hto + "/"  + term_path
        if (termInfo?.collection) {
            const collection_name = get_collection_name(termInfo?.collection.name)
            QueryAPI.get_similar_records(term_uri, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setSimilarTerms(data)
            })
            QueryAPI.get_similar_record_descriptions(term_uri, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setSimilarTermDescriptions(data)
            })
            QueryAPI.get_word_frequencies(termInfo.term_name, collection_name).then(res => {
                const data = res?.data
                //console.log(data)
                setYearWordFrequencies(data)
            })
        }
    }, [termInfo])


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
                termInfo?.start_page?.uri ? <PageImageDisplay init_page_uri={termInfo.start_page.uri}/> : null
            }
            <Container maxWidth="md">
                <Typography mt={2} mb={2} component={"div"} variant={"h4"}>{termInfo?.term_name}</Typography>
                <Typography mt={1} mb={1} component={"div"} variant={"body1"}>{termInfo?.note}</Typography>
                {
                    termInfo?.reference_terms?.length > 0 ?
                        <Box m={1}>
                            <Typography component={"span"} mr={2} variant={"body1"}>See also</Typography>
                            {
                                termInfo?.reference_terms.map((value, index) => (
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
                        termInfo?.note ? <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                            <Box>
                                <Typography variant={"body1"}>Note</Typography>
                            </Box>
                            <Box>
                                <Typography variant={"body1"} fontWeight={"bold"}>{termInfo?.note}</Typography>
                            </Box>
                        </Stack> : null
                    }
                    {
                        termInfo?.alter_names?.length > 0 ? <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                            <Box>
                                <Typography variant={"body1"}>Alternative names</Typography>
                            </Box>
                            <Box>
                                {
                                    termInfo?.alter_names.map((value, index) => (
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
                            <Typography variant={"body1"}>Term type</Typography>
                        </Box>
                        <Box>
                            <Typography variant={"body1"} fontWeight={"bold"}>{termInfo?.term_type}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Was recorded in</Typography>
                        </Box>
                        <Box>
                            <Link mr={1} href={termInfo?.start_page.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.start_page.number}</Typography>
                            </Link>
                            -
                            <Link ml={1} href={termInfo?.end_page.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.end_page.number}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                    {
                        termInfo?.sentiment?
                            <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                                <Box>
                                    <Typography variant={"body1"}>Sentiment</Typography>
                                </Box>
                                <Box>
                                    <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>
                                        {(termInfo?.sentiment?.score * 100).toFixed(1)} % {termInfo?.sentiment.label}
                                    </Typography>
                                </Box>
                            </Stack> : null
                    }
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Volume</Typography>
                        </Box>
                        <Box>
                            <Link mr={1} href={termInfo?.volume.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.volume.title}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Genre</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.edition.genre}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Printed in</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.edition.print_location}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Year Published</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.edition.year_published}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Collection</Typography>
                        </Box>
                        <Box>
                            <Link component="button" onClick={(event) => handleCollectionClick(event, termInfo?.collection)}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{termInfo?.collection.name}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                </Stack>
            </Container>
            <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                <Container maxWidth="md">
                    {
                        termInfo?.descriptions? <MultiSourceDescriptionDisplay
                            descriptions={termInfo?.descriptions}
                            entity_label = {termInfo?.term_name + ","  + termInfo?.edition.year_published}
                        /> : null
                    }
                </Container>
            </Box>
            {
                similarTerms?.length > 0 ?
                    <Container maxWidth={"md"}>
                        <Typography variant={"h6"} mt={2}>Discover similar terms - {termInfo?.term_name + ","  + termInfo?.edition.year_published}</Typography>
                        <Box>
                            {
                                similarTerms.map((value, index) => (
                                    <Button m={1} key={index} href={value.uri.substring(value.uri.indexOf("/hto/"))}>{value.name}, {value.year}</Button>
                                ))
                            }

                        </Box>
                    </Container>
                    : null
            }
            {
                similarTermDescriptions?.length > 0?
                    <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                        <Container maxWidth="md">
                            <MostSimilarDescriptions
                                similar_descriptions={similarTermDescriptions}
                                year={termInfo?.edition.year_published}
                                entity_label = {termInfo?.term_name + ","  + termInfo?.edition.year_published}
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
                            entity_label = {termInfo?.term_name + ","  + termInfo?.edition.year_published}
                            year={termInfo?.edition.year_published}/>
                    </Container> : null
            }
            {
                conceptTerms.length > 0 ?
                    <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                        <Container maxWidth="md">
                            <ConceptTimeLine
                                concept_terms={conceptTerms}
                                entity_label = {termInfo?.term_name + ","  + termInfo?.edition.year_published}
                                year={termInfo?.edition.year_published}/>
                        </Container>
                    </Box> : null
            }
        </Box>
    )
}

export default TopicTermRecordPage;