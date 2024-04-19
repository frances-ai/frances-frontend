import {Fragment} from "react";
import Box from "@mui/material/Box";
import {Link, Typography} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";

function MostSimilarDescriptions(props) {
    const {similar_descriptions, year} = props
    return (
        <Fragment>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>The most similar description across years</Typography>
            </Box>
            <Timeline position="alternate">
                {
                    similar_descriptions.map((value, key) => (
                        <TimelineItem key={key} >
                            <TimelineOppositeContent color="text.secondary" >
                                {value._source.year_published}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={value._source.year_published == year? "primary" : "grey"}/>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Link href={value._id.substring(value._id.indexOf("/hto/"))}>
                                    {value._source.name}
                                </Link>
                            </TimelineContent>
                        </TimelineItem>
                    ))
                }
            </Timeline>
        </Fragment>
    )
}

export default MostSimilarDescriptions;