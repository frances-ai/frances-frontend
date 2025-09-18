import { Container, Divider, Link, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import QueryAPI from "../../apis/query";
import PageImageDisplay from "../../components/PageImageDisplay";
import Box from "@mui/material/Box";
import MultiSourceDescriptionDisplay from "../../components/MultiSourceDescriptionDisplay";

function BroadsideRecordPage() {
    let { recordId } = useParams();
    const [recordInfo, setRecordInfo] = useState();
    const navigate = useNavigate();
    //console.log(recordId)

    useEffect(() => {
        const record_path =  "Broadside/" + recordId

        QueryAPI.get_broadside_record_info(record_path).then(res => {
            const data = res?.data
            //console.log(data)
            setRecordInfo(data)
        })
    }, [recordId])


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
                <Typography mt={2} mb={2} component={"div"} variant={"h4"}>{recordInfo?.name}</Typography>
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
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Was recorded in</Typography>
                        </Box>
                        <Box>
                            {
                                recordInfo?.start_page?.permanent_url?
                                    <Link mr={1} href={recordInfo?.start_page.permanent_url}>
                                        <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.start_page.number}</Typography>
                                    </Link>
                                    :
                                    <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.start_page.number}</Typography>
                            }
                            -
                            {
                                recordInfo?.end_page?.permanent_url?
                                    <Link mr={1} href={recordInfo?.end_page.permanent_url}>
                                        <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.end_page.number}</Typography>
                                    </Link>
                                    :
                                    <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.end_page.number}</Typography>
                            }
                        </Box>
                    </Stack>

                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Genre</Typography>
                        </Box>
                        <Box>
                            <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{recordInfo?.series.genre}</Typography>
                        </Box>
                    </Stack>
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
                            entity_label = {recordInfo?.name + ","  + recordInfo?.series.year_published}
                        /> : null
                    }
                </Container>
            </Box>
        </Box>
    )

}

export default BroadsideRecordPage;