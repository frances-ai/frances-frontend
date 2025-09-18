import {Fragment, useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import Box from "@mui/material/Box";
import {IconButton, Stack} from "@mui/material";
import ArrowCircleLeftOutlinedIcon from "@mui/icons-material/ArrowCircleLeftOutlined";
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined";
import CloverImage from "@samvera/clover-iiif/image";
import {useNavigate} from "react-router-dom";

function PageImageDisplay({init_page_uri, content_reload=false}) {

    console.log(init_page_uri)
    console.log(content_reload)

    const [currentPageUri, setCurrentPageUri] = useState(init_page_uri);
    const [currentPageInfo, setCurrentPageInfo] = useState();
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        if (currentPageUri !== undefined && currentPageUri !== "") {
            console.log(currentPageUri)
            const page_path = currentPageUri.substring(currentPageUri.lastIndexOf("hto/") + 4)
            QueryAPI.get_page_display_info(page_path).then(res => {
                const data = res?.data;
                console.log(data)
                setCurrentPageInfo(prevState => ({
                    ...prevState,
                    number: data.number,
                    permanent_url: data.permanent_url,
                    image_url: data.image_url
                }))
            })

            const index_of_page_number = page_path.lastIndexOf("_") + 1;
            const previous_page_number = (parseInt(page_path.substring(index_of_page_number)) - 1);
            if (previous_page_number < 1) {
                setHasPreviousPage(false);
            } else {
                const previous_page_path = page_path.substring(0, index_of_page_number) + previous_page_number;
                QueryAPI.check_page_exists(previous_page_path).then(res => {
                    setHasPreviousPage(res?.data);
                })
            }
            const next_page_number = (parseInt(page_path.substring(index_of_page_number)) + 1);
            const next_page_path = page_path.substring(0, index_of_page_number) + next_page_number;
            QueryAPI.check_page_exists(next_page_path).then(res => {
                setHasNextPage(res?.data);
            })
        }

    }, [currentPageUri])

    const handlePreviousPageImageClick = () => {
        // get previous page uri - it better to get it based on the volume id and page number, there should be a backend
        // to check if there exists previous page
        // For EB page, and the rule how to create page uri, the last number of the uri is the page number,
        // in this case, we could get the previous page uri base on the current one.
        const index_of_page_number = currentPageUri.lastIndexOf("_") + 1;
        const previous_page_uri =  currentPageUri.substring(0, index_of_page_number) + (parseInt(currentPageUri.substring(index_of_page_number)) - 1);
        console.log(previous_page_uri)
        if (content_reload) {
            navigate(previous_page_uri.substring(previous_page_uri.indexOf("/hto/")))
        }
        setCurrentPageUri(previous_page_uri);
    }

    const handleNextPageImageClick = () => {
        // get previous page uri - it better to get it based on the volume id and page number, there should be a backend
        // to check if there exists previous page
        // For EB page, and the rule how to create page uri, the last number of the uri is the page number,
        // in this case, we could get the previous page uri base on the current one.
        const index_of_page_number = currentPageUri.lastIndexOf("_") + 1;
        const next_page_uri =  currentPageUri.substring(0, index_of_page_number) + (parseInt(currentPageUri.substring(index_of_page_number)) + 1);
        if (content_reload) {
            navigate(next_page_uri.substring(next_page_uri.indexOf("/hto/")))
        }
        setCurrentPageUri(next_page_uri);
    }


    //TODO Change it to IIIF (https://iiif.io/get-started/iiif-viewers/) Viewer

    return (
        <Fragment>
            {
                currentPageInfo?.image_url?
                    <Box sx={{
                        backgroundColor: "black",
                        minHeight: 500,
                        textAlign: "center",
                        position: "relative",
                        overflow: 'hidden' }}
                    >
                        {
                            /*<img src={currentPageInfo?.image_url}
                                 style={{
                                     height: '80vh',
                                     width: 'auto',
                                     transform: `scale(${zoomLevel})`,
                                     transition: 'transform 0.2s ease-in-out'
                                 }}
                            /> */
                            <Box height={'80vh'}>
                                <CloverImage
                                    src={currentPageInfo?.image_url}
                                />
                            </Box>
                        }

                        <Box sx={{height: 50, width: '100%',
                            position: "absolute",
                            bottom: 0, left: 0,
                            backgroundColor: 'rgba(255,255,255,0.8)',
                            alignContent: "center"
                        }}>
                            <Stack direction={"row"} spacing={2} justifyContent="center" textAlign={"center"}>
                                <IconButton onClick={handlePreviousPageImageClick} disabled={!hasPreviousPage}>
                                    <ArrowCircleLeftOutlinedIcon/>
                                </IconButton>
                                <IconButton onClick={handleNextPageImageClick} disabled={!hasNextPage}>
                                    <ArrowCircleRightOutlinedIcon/>
                                </IconButton>
                            </Stack>
                        </Box>
                    </Box> : null
            }
        </Fragment>
    )
}

export default PageImageDisplay;