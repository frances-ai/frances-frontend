import React, {useState} from "react";
import Box from "@mui/material/Box";
import {Button, Modal, Stack} from "@mui/material";
import WordFrequencyDisplay from "./wordFrequencyDisplay";
import ReactWordcloud from "@cyberblast/react-wordcloud";
import {get_plot_words_frequency, get_word_cloud_words_frequency} from "../utils/plotUtil";
import Plot from "react-plotly.js";

function FrequencyVisOptions({words_freqs, type="word"}) {
    const options = ["table", "bar", "word_cloud"]
    const [active_vis, setActiveVis] = useState(options[0])
    const [open, setOpen] = useState(false);
    let cols = ["Word", "Frequency"]
    if (type === "person") {
        cols = ["Person", "Gender", "Frequency"]
    } else if (type === "gender") {
        cols = ["Gender", "Frequency"]
    }

    const handleOpen = (option) => {
        setActiveVis(option)
        setOpen(true);
    }
    const handleClose = () => setOpen(false);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 1,
    };

    return (
        <Box>
            <Stack direction={"row"} justifyContent={"center"}>
                {
                    options.includes("table")?
                        <Button onClick={() => handleOpen("table")}>Table</Button> : null
                }
                {
                    options.includes("bar")?
                        <Button onClick={() => handleOpen("bar")}>Bar Chart</Button> : null
                }
                {
                    options.includes("word_cloud")?
                        <Button onClick={() => handleOpen("word_cloud")}>Word Cloud</Button> : null
                }
            </Stack>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {
                        active_vis === "table" ?
                            <WordFrequencyDisplay
                                words_frequency={words_freqs}
                                cols={cols}
                            /> :
                            active_vis === "word_cloud" ?
                                <Box width={600} height={600}>
                                    <ReactWordcloud
                                        options={{
                                            fontSizes: [10, 50],
                                            rotations: 2,
                                            rotationAngles: [0, 0],
                                        }}
                                        words={get_word_cloud_words_frequency(words_freqs)}
                                    />
                                </Box>
                                :
                                active_vis === "bar" ?
                                    <Plot
                                        data={get_plot_words_frequency(words_freqs)}
                                        layout={
                                            {
                                                xaxis: {
                                                    title: 'Word'
                                                },
                                                yaxis: {
                                                    title: 'Frequency'
                                                },
                                                autosize: true
                                            }
                                        }
                                        useResizeHandler={true}
                                        style={{ width: '100%', height: '100%', marginTop: 20}}/>
                                    : null
                    }
                </Box>
            </Modal>
        </Box>
    )
}

export default FrequencyVisOptions;