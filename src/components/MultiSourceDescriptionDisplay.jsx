import Box from "@mui/material/Box";
import {
    IconButton,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import React, {useEffect, useState} from "react";
import TrackSourceGraph from "./trackSourceGraph.jsx";
import AnnotatedDescriptionWithMap from "./annotatedDescription.jsx";

function DescriptionTabPanel(props) {
    const actions = ["Text", "Track source"]
    const {description, description_uri, locations} = props;
    const [action, setAction] = useState(actions[0]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{backgroundColor: 'rgba(205, 209, 228, 0.7)'}} p={2}>
                <Typography variant={"body1"} fontWeight={"bold"}>{action}</Typography>
                <div>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {actions.map((option) => (
                            <MenuItem key={option} selected={option === action} onClick={() => setAction(option)}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </Stack>
            {
                action === "Text" ?
                    <AnnotatedDescriptionWithMap
                        description={description}
                        locations={locations}
                    />
                 : null
            }
            {
                action === "Track source" ?
                    <Box sx={{maxHeight: 700}}>
                        <TrackSourceGraph entry_uri={description_uri} />
                    </Box> : null
            }

        </Box>
    )
}

function MultiSourceDescriptionDisplay(props) {

    const {descriptions, entity_label} = props;

    const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

    const handleDescriptionTabClick = (event, newValue) => {
        //console.log(newValue)
        setCurrentDescriptionIndex(newValue);
    }

    const get_quality_label = (quality_uri) => {
        let label = quality_uri.split("#")[1]
        // capitalise label
        label = label.toUpperCase()[0] + label.toLowerCase().slice(1)
        if (label === "Low") {
            label = "Original"
        } else if (label === "High") {
            label = "Manual Corrected"
        } else if (label === "Moderate") {
            label = "Auto Corrected"
        }
        return label
    }

    return (
        <>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>Description - {entity_label}</Typography>
            </Box>
            <Paper component={"div"} sx={{minHeight: 130, pd: 1}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentDescriptionIndex} onChange={handleDescriptionTabClick} >
                        {
                            descriptions.map((record, key) => (
                                <Tab key={key} label={get_quality_label(record.text_quality)} />
                            ))
                        }
                    </Tabs>
                </Box>
                {
                    descriptions.map((record, index) => (
                        <div
                            key={index}
                            role="tabpanel"
                            hidden={currentDescriptionIndex !== index}
                        >
                            {currentDescriptionIndex === index && (
                                <DescriptionTabPanel description={descriptions[currentDescriptionIndex].description}
                                                     description_uri={descriptions[currentDescriptionIndex].uri}
                                                     locations={descriptions[currentDescriptionIndex].locations}
                                />
                            )}
                        </div>
                    ))
                }
            </Paper>
        </>
    )
}

export default MultiSourceDescriptionDisplay;