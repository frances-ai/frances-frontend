import React, {useEffect, useState} from 'react'
import {IconButton, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

function TextMoreLess(props) {
    const originText = props.text;
    const lengthLimit = 200;
    const isOverLimit = originText.length > lengthLimit;
    const [text, setText] = useState();
    const [open, setOpen] = useState(false);


    const handleClose = () => setOpen(false);

    const handleOpen = () => {
        setOpen(true)
    }

    useEffect(() => {
        if (isOverLimit) {
            setText(originText.substring(0, lengthLimit) + "...");
        } else {
            setText(originText);
        }
    }, [])

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        width: '60%',
        height: '60%',
        p: 2
    };

    return (
        <Box width={props.width}>
            <Typography component="span" gutterBottom variant="body1">
                {text}
            </Typography>
            {isOverLimit ?
                <IconButton sx={{ml: 2}} aria-label="expand" color="primary" variant={"text"}
                            onClick={handleOpen} size="small">
                    <OpenInFullIcon />
                </IconButton> :
                null
            }
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography component="div" gutterBottom variant="h4">
                        Full Text
                    </Typography>
                    <Typography component="div" gutterBottom variant="body1" sx={{height: '90%', overflowY: "scroll"}}>
                        {originText}
                    </Typography>
                </Box>
            </Modal>
        </Box>
    )
}

export default TextMoreLess;