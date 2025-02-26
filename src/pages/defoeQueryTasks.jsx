import {
    Button, Checkbox, CircularProgress, Collapse,
    Container, IconButton,
    Paper, Snackbar, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead, TablePagination,
    TableRow, TableSortLabel, Toolbar, Tooltip,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import QueryAPI from "../apis/query";
import {useNavigate} from "react-router-dom";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from "@mui/material/Box";
import DeleteIcon from '@mui/icons-material/Delete';
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
    const { task, sx, handleCheckBoxClick, isTaskSelected } = props;
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
                <TableCell padding="checkbox">
                    <Checkbox
                        color="primary"
                        checked={isTaskSelected}
                        onChange={(event) => handleCheckBoxClick(event, task.task_id)}
                    />
                </TableCell>
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
    const [selected, setSelected] = useState([]);
    const [snackBarInfo, setSnackBarInfo] = useState({
        open: false,
        message: ''
    })

    const handleClose = () => {
        setSnackBarInfo({ open: false, message: '' });
    };


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


    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = tasks.map((n) => n.task_id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleCheckBoxClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        console.log(newSelected)
        setSelected(newSelected);
    };



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


    const handleDeleteClick = (event) => {
        QueryAPI.deleteDefoeQueryTasks(selected).then(res => {
            const data = res?.data;
            console.log(data)
            setSnackBarInfo({
                open: true,
                message: selected.length + ' tasks deleted!'
            })
            setSelected([]);
            QueryAPI.getAllDefoeQueryTasks(options).then((response) => {
                console.log(response?.data);
                setTasks(response?.data?.tasks);
                setTotal(response?.data?.total_count);
            })
        })

    }


    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Stack direction={"row"} justifyContent={"space-between"} sx={{mt: 5, mb:2}}>
                <Typography component="div" variant="h4" >
                    Defoe Query Tasks
                </Typography>
                {
                    selected.length > 0 ?
                    <Stack direction={"row"} alignItems={"center"} spacing={3}>
                        <Typography component="div" color="inherit" variant="subtitle1">
                            {selected.length} Selected
                        </Typography>
                        <Tooltip title="Delete">
                            <IconButton onClick={handleDeleteClick}>
                                <DeleteIcon color={"error"}/>
                            </IconButton>
                        </Tooltip>
                    </Stack> : null
                }
            </Stack>
            {
                (tasks !== undefined) ?
                    (<Box>
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="defoe query tasks table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                color="primary"
                                                checked={tasks.length > 0 && tasks.length === selected.length}
                                                onChange={handleSelectAllClick}
                                            />
                                        </TableCell>
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
                                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                                  task={task}
                                                  isTaskSelected={isSelected(task.task_id)}
                                                  handleCheckBoxClick={handleCheckBoxClick}
                                        />
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
            <Snackbar
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                open={snackBarInfo?.open}
                onClose={handleClose}
                message={snackBarInfo?.message}
            />
        </Container>
    )
}

export default DefoeQueryTasksPage;