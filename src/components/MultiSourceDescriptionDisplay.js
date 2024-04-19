import Box from "@mui/material/Box";
import {Paper, Typography} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useEffect, useState} from "react";

function MultiSourceDescriptionDisplay(props) {

    const {descriptions} = props;

    const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

    const handleDescriptionTabClick = (event, newValue) => {
        console.log(newValue)
        setCurrentDescriptionIndex(newValue);
    }

    return (
        <>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>Description</Typography>
            </Box>
            <Paper component={"div"} sx={{minHeight: 130, pd: 1}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentDescriptionIndex} onChange={handleDescriptionTabClick} >
                        {
                            descriptions.map((record, key) => (
                                <Tab key={key} label={record.text_quality.split("#")[1]} />
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
                                <Box p={2} sx={{maxHeight: 700, overflowY: "scroll"}}>
                                    <Typography>{descriptions[currentDescriptionIndex].description}</Typography>
                                </Box>
                            )}
                        </div>
                    ))
                }
            </Paper>
        </>
    )
}

export default MultiSourceDescriptionDisplay;