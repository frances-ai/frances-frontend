import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {FormControlLabel, Switch, Typography} from "@mui/material";
import {escapeUnicode} from "../utils/stringUtil";
import DiffMatchPatch from 'diff-match-patch';
import {Parser} from 'html-to-react'

function SpellCheckResult(props) {
    const result = props.result;
    const [showDifferent, setShowDifferent] = useState(false);
    const [differenceMarkedDef, setDifferenceMarkedDef] = useState();

    useEffect(() => {
        // Set difference marked definition
        const origin = result.result.definition;
        const cleaned = result.result.clean_definition;
        const dmp = new DiffMatchPatch();
        const diff = dmp.diff_main(escapeUnicode(origin), escapeUnicode(cleaned));
        dmp.diff_cleanupSemantic(diff);
        dmp.Diff_Timeout = parseFloat(1);
        const diff_prettyHtml = dmp.diff_prettyHtml(diff);
        const parser = new Parser();
        setDifferenceMarkedDef(parser.parse(diff_prettyHtml));
    }, [])

    return (
        <Box>
            <Typography component="div" gutterBottom variant="h5" sx={{mt: 2}}>
                <b>Original Definition</b>
            </Typography>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                {escapeUnicode(result.result.definition)}
            </Typography>
            <Box>
                <Typography component="span" gutterBottom variant="h5" sx={{mt: 2}}>
                    <b>Cleaned Definition</b>
                </Typography>
                <FormControlLabel
                    control={<Switch onChange={(event) =>
                        setShowDifferent(event.target.checked)}/>}
                    sx={{ml: 3}}
                    label="Show Difference"
                />
            </Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                {showDifferent ?
                    differenceMarkedDef:
                    escapeUnicode(result.result.clean_definition)
                }
            </Typography>
        </Box>
    )
}

export default SpellCheckResult;