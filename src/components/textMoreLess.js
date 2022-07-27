import React, {useEffect, useState} from 'react'
import {Button, Typography} from "@mui/material";
import Box from "@mui/material/Box";

function TextMoreLess(props) {
    const [isFullText, setIsFullText] = useState(false);
    const originText = props.text;
    const lengthLimit = 200;
    const isOverLimit = originText.length > lengthLimit;
    const [text, setText] = useState();

    useEffect(() => {
        if (isOverLimit) {
            if (isFullText) {
                setText(originText);
            } else {
                setText(originText.substring(0, lengthLimit) + "...");
            }
        } else {
            setText(originText);
        }
    }, [isFullText])

    return (
        <Box width={props.width}>
            <Typography component="span" gutterBottom variant="body1">
                {text}
            </Typography>
            {isOverLimit ?
                <Button variant={"text"} onClick={() => setIsFullText(!isFullText)}>{isFullText? 'Less': 'More'}</Button> :
                null
            }
        </Box>
    )
}

export default TextMoreLess;