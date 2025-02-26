import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import React from "react";
import {grey} from "@mui/material/colors";

function WordFrequencyDisplay({words_frequency, cols=["Word", "Frequency"]}) {
    return (
        <>
            <TableContainer component={Paper} sx={{maxHeight: 600, maxWidth: 500}}>
                <Table stickyHeader aria-label="frequency distribution result table" stripe="2n">
                    <TableHead>
                        <TableRow>
                            {
                                cols.map((col, index) => (
                                    <TableCell key={index} sx={{backgroundColor: grey[100]}}>{col}</TableCell>
                                ))
                            }
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            words_frequency.map((wf, index) => (
                                <TableRow key={index}>
                                    {
                                        cols.map((col, col_index) => (
                                            <TableCell key={col_index}>{wf[col_index]}</TableCell>
                                        ))
                                    }
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
        )
}

export default WordFrequencyDisplay
