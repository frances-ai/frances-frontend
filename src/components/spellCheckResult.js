import React, {useEffect, useState} from 'react';
import Box from "@mui/material/Box";
import {
    FormControlLabel,
    Paper, Stack,
    Switch,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {escapeUnicode, findTermLinkFromUri} from "../utils/stringUtil";
import DiffMatchPatch from 'diff-match-patch';
import parse from 'html-react-parser';
import VisualiseButton from "./buttons/visualiseButton";
import SimilarTermsButton from "./buttons/similarTermsButton";

function TermInfo(props) {
    const {termInfo,currentSearchInfo} = props;

    const headers = [
        'Yeah', 'Edition', 'Volume', 'Term', 'Advanced Options'
    ]

    return (
        <Box>
            <Typography component="div" gutterBottom variant="body1" sx={{mt: 2}}>
                Spell check for:
            </Typography>
            <Paper elevation={3}>
                <TableContainer>
                    <Table sx={{ minWidth: 800 }} aria-label="term info table">
                        <TableHead>
                            <TableRow>
                                {
                                    headers.map((header) => (
                                        <TableCell
                                            align={"center"}
                                            key={header}
                                        >
                                            {header}
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <TableRow>
                                <TableCell align={"center"}>{termInfo.year}</TableCell>
                                <TableCell align={"center"}>{termInfo.edition}</TableCell>
                                <TableCell align={"center"}>{termInfo.volume}</TableCell>
                                <TableCell align={"center"}>{termInfo.term}</TableCell>
                                <TableCell align={"center"}>
                                    <Stack>
                                        <VisualiseButton
                                            uri={termInfo.uri}
                                            currentSearchInfo={currentSearchInfo}
                                        />
                                        <SimilarTermsButton
                                            resource_uri={termInfo.uri}
                                            currentSearchInfo={currentSearchInfo}
                                        />
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    )
}

function SpellCheckResult(props) {
    const result = props.result;
    const [showDifferent, setShowDifferent] = useState(false);
    const [differenceMarkedDef, setDifferenceMarkedDef] = useState();
    const uri = Object.keys(result.result.results)[0];
    const currentSearchInfo = {
        type: 'SpellCheck',
        key: uri,
        name: 'SpellCheck(' + findTermLinkFromUri(uri) + ')'
    };
    const termInfo =
        {
            term: result.result.results[uri][3],
            year: result.result.results[uri][1],
            edition: result.result.results[uri][0],
            volume: result.result.results[uri][2],
            uri: uri
        };

    useEffect(() => {
        // Set difference marked definition
        const origin = result.result.definition;
        const cleaned = result.result.clean_definition;
        const dmp = new DiffMatchPatch();
        const diff = dmp.diff_main(escapeUnicode(origin), escapeUnicode(cleaned));
        dmp.diff_cleanupSemantic(diff);
        dmp.Diff_Timeout = parseFloat(1);
        const diff_prettyHtml = dmp.diff_prettyHtml(diff);
        setDifferenceMarkedDef(parse(diff_prettyHtml));
    }, [])

    return (
        <Box>
            <TermInfo termInfo={termInfo} currentSearchInfo={currentSearchInfo}/>
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