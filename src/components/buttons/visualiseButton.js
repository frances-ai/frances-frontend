import React, {useState} from 'react'
import {Button, Modal, Typography} from "@mui/material";
import Box from "@mui/material/Box";
import VisualisationResult from "../visualisationResult";

function VisualiseButton(props) {

    const uri = props.uri;
    const collection = props.collection;
    const [open, setOpen] = useState(false);


    const handleClose = () => setOpen(false);

    const handleOpen = () => {
        setOpen(true)
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        boxShadow: 24,
        width: '60%',
        height: '800',
        p: 2,
    };

    return (
        <React.Fragment>
            <Button onClick={handleOpen}>
                {props.children}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <VisualisationResult uri={uri} collection={collection}/>
                </Box>
            </Modal>
        </React.Fragment>
    )
}

export default VisualiseButton;