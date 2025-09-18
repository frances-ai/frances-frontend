import {Button, Container, Divider, Link, Stack, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import config from "../../config.json";
import QueryAPI from "../../apis/query";
import PageImageDisplay from "../../components/PageImageDisplay";
import Box from "@mui/material/Box";
import MultiSourceDescriptionDisplay from "../../components/MultiSourceDescriptionDisplay";

function PageRecordPage() {
    let { pageId } = useParams();
    const [pageInfo, setPageInfo] = useState();
    const [pagePath, setPagePath] = useState("Page/" + pageId);
    const navigate = useNavigate();
    //console.log(pageId)

    useEffect(() => {
        const page_path = "Page/" + pageId;
        setPagePath(page_path)
        QueryAPI.get_page_info(page_path).then(res => {
            const data =  res?.data;
            //console.log(data)
            setPageInfo(data);
        })
    }, [pageId])


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
            <PageImageDisplay init_page_uri={config.hto + "/" +  pagePath} content_reload={true}/>
            <Container maxWidth={"md"} >
                <Typography mt={2} mb={2} component={"div"} variant={"h4"}>{pageInfo?.volume.title}, Page {pageInfo?.number}</Typography>
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
                            <Typography variant={"body1"}>Page number</Typography>
                        </Box>
                        <Box>
                            <Typography variant={"body1"} fontWeight={"bold"}>{pageInfo?.number}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Volume</Typography>
                        </Box>
                        <Box>
                            <Link mr={1} href={pageInfo?.volume.permanent_url}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{pageInfo?.volume.title}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                    {
                        pageInfo?.edition_or_series?.genre != "0.0" ?
                            <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                                <Box>
                                    <Typography variant={"body1"}>Genre</Typography>
                                </Box>
                                <Box>
                                    <Typography variant={"body1"} fontWeight={"bold"}>{pageInfo?.edition_or_series?.genre}</Typography>
                                </Box>
                            </Stack> : null
                    }
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Printed in</Typography>
                        </Box>
                        <Box>
                            <Typography variant={"body1"} fontWeight={"bold"}>{pageInfo?.edition_or_series?.print_location}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Year Published</Typography>
                        </Box>
                        <Box>
                            <Typography variant={"body1"} fontWeight={"bold"}>{pageInfo?.edition_or_series?.year_published}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction={"row"} justifyContent="space-between" width={"100%"}>
                        <Box>
                            <Typography variant={"body1"}>Collection</Typography>
                        </Box>
                        <Box>
                            <Link component="button" onClick={(event) => handleCollectionClick(event, pageInfo?.collection)}>
                                <Typography component={"span"} variant={"body1"} fontWeight={"bold"}>{pageInfo?.collection.name}</Typography>
                            </Link>
                        </Box>
                    </Stack>
                </Stack>
            </Container>

            <Box sx={{backgroundColor: 'rgba(240,240,240,0.5)', minHeight: 200}} mt={2} pb={1} >
                <Container maxWidth="md">
                    {
                        (pageInfo?.contents && pageInfo?.contents.length > 0)?
                            <MultiSourceDescriptionDisplay
                                descriptions={pageInfo?.contents}
                            />
                            : null
                    }
                </Container>
            </Box>
        </Box>
    )

}

export default PageRecordPage;
