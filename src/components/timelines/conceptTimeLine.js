import React, {Fragment, useState} from "react";
import Box from "@mui/material/Box";
import {Card, CardActionArea, CardContent, Divider, Paper, Typography} from "@mui/material";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineOppositeContent from "@mui/lab/TimelineOppositeContent";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineDot from "@mui/lab/TimelineDot";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import ReactWordcloud from "@cyberblast/react-wordcloud";

function TermRecordCard(props) {
    const {term_info} = props;
    const [elevation, setElevation] = useState(1);

    return (
        <Card elevation={elevation}
              onMouseOver={() => setElevation(3)}
              onMouseOut={() => setElevation(1)}>
            <CardActionArea href={term_info.uri.substring(term_info.uri.indexOf("/hto/"))} >
                <CardContent>
                    <Box >
                        <Typography component={"span"} mr={1} variant={"body2"} color={"text.secondary"}>
                            Record in
                        </Typography>
                        <Typography component={"span"} variant={"body2"} color={"text.primary"}>
                            {term_info.source}
                        </Typography>
                    </Box>
                    {
                        term_info?.sentiment?
                            <Box >
                                <Typography component={"span"} variant={"body2"} color={"text.primary"} fontWeight={"bold"} >
                                    {(term_info?.sentiment?.score * 100).toFixed(1)} % {term_info?.sentiment.label}
                                </Typography>
                                <Typography component={"span"} ml={1} variant={"body2"} color={"text.secondary"}>
                                    sentiment
                                </Typography>
                            </Box> : null
                    }
                    <Box mt={1} width={'100%'} height={200} border={"1px dashed black"}>
                        <ReactWordcloud
                            options={{
                                fontSizes: [10, 50],
                                rotations: 2,
                                rotationAngles: [0, 0],
                            }}
                            words={term_info.word_frequencies}
                        />
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )

}

function ConceptTimeLine(props) {
    const {concept_terms, year} = props;

    console.log(year)

    return (
        <Fragment>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>Concept Timeline</Typography>
            </Box>
            <Timeline position="alternate">
                {
                    concept_terms.map((value, key) => (
                        <TimelineItem key={key} >
                            <TimelineOppositeContent color="text.secondary" align="right">
                                {value.year_published}
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                                <TimelineDot color={value.year_published == year? "primary" : "grey"}/>
                                <TimelineConnector sx={{alignContent: "center"}}>
                                    {
                                        value.cosine_similarity?
                                            <Typography
                                                ml={key%2===0? -6 : 1}
                                                width={50} component={"div"} variant={"body2"}
                                                color={value.cosine_similarity > 0.7 ? "black" : "red"}
                                            >
                                                {(value.cosine_similarity * 100).toFixed(1)} %
                                            </Typography>
                                            : null
                                    }
                                </TimelineConnector>
                            </TimelineSeparator>
                            <TimelineContent justifyContent={"center"}>
                                <TermRecordCard term_info={value} />
                            </TimelineContent>
                        </TimelineItem>
                    ))
                }
            </Timeline>
        </Fragment>
    )
}

export default ConceptTimeLine;