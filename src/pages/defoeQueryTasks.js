import {
    Button, CircularProgress,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import React from "react";
import {useNavigate} from "react-router-dom";

function DefoeQueryTasksPage() {
    const [tasks, setTasks] = useState();

    useEffect(() => {
        QueryAPI.getAllDefoeQueryTasks().then((response) => {
            console.log(response?.data);
            setTasks(response?.data?.tasks);
        })
    }, [])

    const navigate = useNavigate();
    const handleViewClick = (task_id) => {
        navigate("/defoeQueryResult", {state: {taskId: task_id}})
    }

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                Defoe Query Tasks
            </Typography>

            {
                (tasks !== undefined) ?
                    (<TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="defoe query tasks table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Collection</TableCell>
                                    <TableCell>Query Type</TableCell>
                                    <TableCell>Configuration</TableCell>
                                    <TableCell align="center">Progress</TableCell>
                                    <TableCell>Submit Time</TableCell>
                                    <TableCell align={"center"}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tasks.map((task, key) => (
                                    <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {task.config.collection}
                                        </TableCell>
                                        <TableCell >{task.config.queryType}</TableCell>
                                        <TableCell >{task.config.preprocess + ' ' + task.config.startYear}</TableCell>
                                        <TableCell align="center">{task.progress}</TableCell>
                                        <TableCell >{task.submit_time}</TableCell>
                                        <TableCell align={"center"}>
                                            <Button variant={"text"} onClick={() => {handleViewClick(task.task_id)}}>View</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>) :
                <CircularProgress/>
            }
        </Container>
    )
}

export default DefoeQueryTasksPage;