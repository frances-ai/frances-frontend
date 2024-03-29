import {
    Button, CircularProgress, Collapse,
    Container, IconButton,
    Paper, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TableSortLabel,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import {useNavigate} from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from "@mui/material/Box";
import {Task} from "./defoeQueryResult";
import {getLexiconFileOriginalName} from "../utils/stringUtil";

function TaskConfigCell(props) {
    const {open, setOpen, config, collapse} = props

    function getBriefConfig() {
        let brief = getLexiconFileOriginalName(config?.lexiconFile);
        if (config?.preprocess !== null && config?.preprocess !== "none") {
            brief += " " + config.preprocess;
        }
        if (config?.hitCount !== null) {
            brief += " " +  config.hitCount;
        }
        return brief;
    }

    if (!collapse) {
        return <React.Fragment>
            <TableCell sx={{padding: '0 0'}}>
            </TableCell>
        </React.Fragment>
    }

    return (
        <React.Fragment>
            <TableCell sx={{padding: '0 0'}}>
                <Button fullWidth={true} variant={"text"} color={"inherit"}
                        sx={{textTransform: 'none', height: '70px'}}
                        onClick={() => setOpen(!open)}>
                    <Stack direction="row"
                           justifyContent="space-between"
                           alignItems="stretch"
                           sx={{width: 'inherit'}}
                    >
                        <Typography component={"div"}>
                            {getBriefConfig()}
                        </Typography>
                        <Box sx={{padding: 0, lineHeight: 0}}>
                            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </Box>
                    </Stack>
                </Button>
            </TableCell>
        </React.Fragment>
    )
}


function TaskRow(props) {
    const { task, sx } = props;
    const [open, setOpen] = React.useState(false);


    const navigate = useNavigate();
    const handleViewClick = (task_id) => {
        navigate("/defoeQueryResult", {state: {taskId: task_id}})
    }

    const inputs = QueryAPI.getQueryMeta(task?.config?.collection)[task?.config?.queryType].inputs;
    const collapse = Object.keys(inputs).length > 0

    return (
        <React.Fragment>
            <TableRow sx={sx}>
                <TableCell component="th" scope="row">
                    {task.config.collection}
                </TableCell>
                <TableCell >{task.config.queryType}</TableCell>
                <TaskConfigCell
                    collapse={collapse}
                    open={open}
                    setOpen={setOpen}
                    config={task?.config}
                />
                <TableCell align="center">{task.state}</TableCell>
                <TableCell>{task.submit_time}</TableCell>
                <TableCell align={"center"}>
                    <Button
                        variant={"text"}
                        onClick={() => {handleViewClick(task.task_id)}}
                        disabled={task.state === "ERROR" || task.state === "CANCELLED"}>
                        View
                    </Button>
                </TableCell>
            </TableRow>

            {
                collapse?
                    <TableRow>
                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                            <Collapse in={open} timeout="auto" unmountOnExit>
                                <Box sx={{ margin: 1 }}>
                                    <Typography variant="h6" gutterBottom component="div">
                                        Configuration Details
                                    </Typography>
                                    <Task task={task} inputs={inputs}/>
                                </Box>
                            </Collapse>
                        </TableCell>
                    </TableRow>
                    : null
            }
        </React.Fragment>
    )
}

function DefoeQueryTasksPage() {
    const init_options = {
        page: 1,
        per_page: 10,
        sort_by: 'submitTime',
        sort_order: 'desc'
    }
    const [tasks, setTasks] = useState();
    const [options, setOptions] = useState(init_options);
    const [total, setTotal] = useState(0);


    useEffect(() => {
        if (options !== undefined) {
            console.log("get tasks");
            QueryAPI.getAllDefoeQueryTasks(options).then((response) => {
                console.log(response?.data);
                setTasks(response?.data?.tasks);
                setTotal(response?.data?.total_count)
            })
        }
    }, [options])


    const handleSubmitTimeSortClick = (event) => {
      setOptions(prevState => ({
          ...prevState,
          sort_by: 'submitTime',
          sort_order: prevState["sort_order"] === "desc" ? "asc" : "desc"
      }))
    }

    const handleSateSortClick = (event) => {
        setOptions(prevState => ({
            ...prevState,
            sort_by: 'state',
            sort_order: prevState["sort_order"] === "desc" ? "asc" : "desc"
        }))
    }

    const handleChangePage = (event, newPage) => {
        setOptions(prevState => ({
            ...prevState,
            page: newPage + 1
        }))
    }

    const handleChangeRowsPerPage = (event) => {
        setOptions(prevState => ({
            ...prevState,
            per_page: event.target.value
        }))
    }

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                Defoe Query Tasks
            </Typography>

            {
                (tasks !== undefined) ?
                    (<Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="defoe query tasks table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Collection</TableCell>
                                        <TableCell>Query Type</TableCell>
                                        <TableCell>Configuration</TableCell>
                                        <TableCell align="center" sortDirection={options?.sort_order}>
                                            <TableSortLabel
                                                active={options?.sort_by === "state"}
                                                direction={options?.sort_order}
                                                onClick={handleSateSortClick}>
                                                State
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell sortDirection={options?.sort_order}>
                                            <TableSortLabel
                                                active={options?.sort_by === "submitTime"}
                                                direction={options?.sort_order}
                                                onClick={handleSubmitTimeSortClick}>
                                                Submit Time
                                            </TableSortLabel>
                                        </TableCell>
                                        <TableCell align={"center"}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tasks.map((task, key) => (
                                        <TaskRow  key={key}
                                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }} task={task}/>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={total}
                            rowsPerPage={options.per_page}
                            page={options.page - 1}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Box>) :
                <CircularProgress/>
            }
        </Container>
    )
}

export default DefoeQueryTasksPage;