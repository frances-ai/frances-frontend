import {Fragment} from "react";
import Box from "@mui/material/Box";
import {Typography} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import ReactWordcloud from "@cyberblast/react-wordcloud";

function WordClouds(props) {
    const {year_word_frequencies, year, entity_label} = props
    return (
        <Fragment>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>Word clouds - {entity_label}</Typography>
            </Box>
            <Timeline position="alternate">
                {
                    year_word_frequencies.map((value, key) => (
                        <TimelineItem key={key} >
                            <TimelineOppositeContent color="text.secondary" >
                                {value.year}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={value.year == year? "primary" : "grey"}/>
                                <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>
                                <Box width={300} height={200}>
                                    <ReactWordcloud
                                        options={{
                                            fontSizes: [10, 50],
                                            rotations: 2,
                                            rotationAngles: [0, 0],
                                        }}
                                        words={value.word_frequencies}
                                    />
                                </Box>

                            </TimelineContent>
                        </TimelineItem>
                    ))
                }
            </Timeline>
        </Fragment>
    )
}


export default WordClouds;