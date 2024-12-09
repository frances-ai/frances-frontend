import Box from "@mui/material/Box";
import {
    IconButton,
    Link,
    Menu,
    MenuItem,
    Paper,
    Stack,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {useEffect, useState} from "react";
import { grey } from '@mui/material/colors';
import {GraphCanvas, RadialMenu} from 'reagraph';
import QueryAPI from "../apis/query"
import {hto_uri_to_path, is_valid_link} from "../utils/stringUtil";

function TrackSourceGraph(props) {
    const {entry_uri} = props
    const [nodes, setNodes] = useState([])
    const [edges, setEdges] = useState([])
    const [selections, setSelections] = useState([]);
    const rdfs_type_uri = "http://www.w3.org/1999/02/22-rdf-syntax-ns#type";
    const foaf_homepage_uri = "http://xmlns.com/foaf/0.1/homepage";
    const hto_text_uri = "https://w3id.org/hto#text";
    const hto_hasTextQuality_uri = "https://w3id.org/hto#hasTextQuality";
    const info_predicates = [rdfs_type_uri, hto_text_uri, hto_hasTextQuality_uri, foaf_homepage_uri];
    const [nodesInfo, setNodesInfo] = useState({})

    function nodeExists(node_id) {
        for (const index in nodes) {
            const node = nodes[index]
            if (node.id === node_id) {
                return true;
            }
        }
        return false;
    }

    function get_simple_name_from_uri(uri) {
        if (uri === entry_uri) {
            return "Current Description";
        }
        const last_slash_index = uri.lastIndexOf("/")
        const last_hash_index = uri.lastIndexOf("#")
        if (last_hash_index > last_slash_index) {
            return uri.substring(last_hash_index + 1)
        }
        if (last_slash_index > -1) {
            return uri.substring(last_slash_index + 1)
        }
        return uri
    }

    function onCanvasClick(event) {
        console.log(event)
        setSelections([]);
    }

    function onNodeClick(event) {
        console.log(event)
        setSelections([event.id]);
    }

    function onNodeDoubleClick(event) {
        QueryAPI.get_kg_triples(event.id).then(res => {
            console.log(res)
            const data = parse_triples(res?.data, event.id)
            console.log(data)
            if (data !== null) {
                setNodes(prevNodes => [...prevNodes, ...data["nodes"]])
                setEdges(prevEdges => [...prevEdges, ...data["edges"]])
                setNodesInfo(prevNodesInfo => ({
                    ...prevNodesInfo,
                    [event.id]: data["node_info"]}))
            }
        })
    }

    function parse_triples(triples, source_uri, reset=false) {
        if (!reset && nodesInfo !== undefined && (source_uri in nodesInfo)) {
            // if source_uri has been tracked, then it should not be tracked again
            return null
        }

        let nodes = []
        if (reset || !nodeExists(source_uri)) {
            nodes.push({
                id: source_uri,
                label: get_simple_name_from_uri(source_uri)
            })
        }

        let node_info = {}
        let edges = []
        triples.forEach((triple) => {
            const predicate_uri = triple["pre"]["value"]
            const object_uri = triple["obj"]["value"]
            const object_type = triple["obj"]["type"]
            if (info_predicates.includes(predicate_uri)) {
                node_info[predicate_uri] = {
                    type: object_type,
                    value: object_uri
                }
            } else {
                if (object_type === "literal") {
                    node_info[predicate_uri] = {
                        type: object_type,
                        value: object_uri
                    }
                } else {
                    if (reset || !nodeExists(object_uri)) {
                        nodes.push({
                            id: object_uri,
                            label: get_simple_name_from_uri(object_uri)
                        })
                    }
                    edges.push({
                        source: source_uri,
                        target: object_uri,
                        id: (source_uri+"-" + predicate_uri+"-"+object_uri),
                        label: get_simple_name_from_uri(predicate_uri)
                    })
                }
            }
        })
        return {
            nodes: nodes,
            edges: edges,
            node_info: node_info
        }
    }

    function reset() {
        QueryAPI.get_kg_triples(entry_uri).then(res => {
            console.log("track source")
            console.log(res)
            const data = parse_triples(res?.data, entry_uri, true)
            console.log(data)
            if (data !== null) {
                setNodes(data["nodes"])
                //setSelections([entry_uri]);
                setEdges(data["edges"])
                setNodesInfo({[entry_uri]:data["node_info"]})
            }
        })
    }

    useEffect(() => {
        console.log(nodesInfo)
    }, [nodesInfo])

    useEffect(() => {
        console.log("track source")
        console.log(entry_uri)
        if (entry_uri !== undefined) {
            reset();
        }
    }, [entry_uri])

    return <Box sx={{position: "relative", minHeight: '500px'}}>
        {
            nodes.length > 0 ?
                <GraphCanvas
                    layoutOverrides={{
                        linkDistance: 70
                    }}
                    edgeLabelPosition={"natural"}
                    sizingType={"none"}
                    labelType={"all"}
                    draggable
                    selections={selections}
                    nodes={nodes}
                    edges={edges}
                    onCanvasClick={onCanvasClick}
                    onNodeClick={onNodeClick}
                    onNodeDoubleClick={onNodeDoubleClick}
                /> : null
        }

        {
            selections.length > 0 ?
                <Box
                    position={"absolute"}
                    top={10}
                    right={0}
                    maxWidth={700}
                    minHeight={100}
                    p={1}
                    sx={{backgroundColor: grey[100], borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}
                >
                    <Typography component={"span"} variant={"body1"} sx={{wordWrap: 'break-word'}} fontWeight={"bold"}>Node: </Typography>
                    {
                        is_valid_link(hto_uri_to_path(selections[0])) ?
                            <Link href={hto_uri_to_path(selections[0])} underline={"none"}>
                                <Typography component={"span"} variant={"body1"} sx={{wordWrap: 'break-word'}} fontWeight={"bold"}>{get_simple_name_from_uri(selections[0])}</Typography>
                            </Link> :
                            <Typography component={"span"} variant={"body1"} sx={{wordWrap: 'break-word'}} fontWeight={"bold"}>{get_simple_name_from_uri(selections[0])}</Typography>
                    }
                    {
                        selections[0] in nodesInfo ?
                            <TableContainer sx={{marginTop: 1}}>
                                <Table padding={"none"}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{paddingRight: 2}}>
                                                Property
                                            </TableCell>
                                            <TableCell>Value</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {
                                            rdfs_type_uri in nodesInfo[selections[0]] ?
                                                <>
                                                    <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                        <TableCell sx={{paddingRight: 2}}>
                                                            <Typography variant={"body1"}>
                                                                Type
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Link href={hto_uri_to_path(nodesInfo[selections[0]][rdfs_type_uri]["value"])} underline={"none"}>
                                                                <Typography variant={"body1"} sx={{wordWrap: 'break-word'}}>{get_simple_name_from_uri(nodesInfo[selections[0]][rdfs_type_uri]["value"])}</Typography>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                    {
                                                        foaf_homepage_uri in nodesInfo[selections[0]] ?
                                                            <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                <TableCell sx={{paddingRight: 2}}>
                                                                    <Typography variant={"body1"}>
                                                                        Homepage
                                                                    </Typography>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link href={hto_uri_to_path(nodesInfo[selections[0]][foaf_homepage_uri]["value"])} underline={"none"}>
                                                                        <Typography variant={"body1"} sx={{wordWrap: 'break-word'}}>{nodesInfo[selections[0]][foaf_homepage_uri]["value"]}</Typography>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                            : null
                                                    }
                                                    {
                                                        Object.keys(nodesInfo[selections[0]]).map((predicate_uri) => (
                                                            <TableRow hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                                {
                                                                    predicate_uri !== rdfs_type_uri && predicate_uri !== hto_text_uri && predicate_uri !== foaf_homepage_uri?
                                                                        <>
                                                                            <TableCell sx={{paddingRight: 2}}>
                                                                                <Link href={hto_uri_to_path(predicate_uri)} underline={"none"}>
                                                                                    <Typography variant={"body1"} sx={{wordWrap: 'break-word'}}>{get_simple_name_from_uri(predicate_uri)}</Typography>
                                                                                </Link>
                                                                            </TableCell>
                                                                            <TableCell>
                                                                                {
                                                                                    nodesInfo[selections[0]][predicate_uri]["type"] === "uri" ?
                                                                                        <Link href={hto_uri_to_path(nodesInfo[selections[0]][predicate_uri]["value"])} underline={"none"}>
                                                                                            <Typography variant={"body1"} sx={{wordWrap: 'break-word'}}>{get_simple_name_from_uri(nodesInfo[selections[0]][predicate_uri]["value"])}</Typography>
                                                                                        </Link> :
                                                                                        <Typography variant={"body1"} sx={{wordWrap: 'break-word'}}>{get_simple_name_from_uri(nodesInfo[selections[0]][predicate_uri]["value"])}</Typography>
                                                                                }
                                                                            </TableCell>
                                                                        </> : null
                                                                }
                                                            </TableRow>
                                                        ))
                                                    }
                                                </> : null
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            :
                            <>
                                <Typography variant={"body1"} sx={{wordWrap: 'break-word'}} mt={1}>
                                    Double click the node to get more information
                                </Typography>
                            </>
                    }

                </Box> : null
        }
    </Box>
}

function DescriptionTabPanel(props) {
    const actions = ["Text", "Track source"]
    const {description, description_uri} = props;
    const [action, setAction] = useState(actions[0]);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    return (
        <Box>
            <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                sx={{backgroundColor: 'rgba(205, 209, 228, 0.7)'}} p={2}>
                <Typography variant={"body1"} fontWeight={"bold"}>{action}</Typography>
                <div>
                    <IconButton
                        aria-label="more"
                        id="long-button"
                        aria-controls={open ? 'long-menu' : undefined}
                        aria-expanded={open ? 'true' : undefined}
                        aria-haspopup="true"
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
                        id="long-menu"
                        MenuListProps={{
                            'aria-labelledby': 'long-button',
                        }}
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                    >
                        {actions.map((option) => (
                            <MenuItem key={option} selected={option === action} onClick={() => setAction(option)}>
                                {option}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
            </Stack>
            {
                action === "Text" ?
                <Box sx={{maxHeight: 700, overflowY: "scroll"}} p={2}>
                    <Typography>{description}</Typography>
                </Box> : null
            }
            {
                action === "Track source" ?
                    <Box sx={{maxHeight: 700}}>
                        <TrackSourceGraph entry_uri={description_uri} />
                    </Box> : null
            }

        </Box>
    )
}

function MultiSourceDescriptionDisplay(props) {

    const {descriptions, entity_label} = props;

    const [currentDescriptionIndex, setCurrentDescriptionIndex] = useState(0);

    const handleDescriptionTabClick = (event, newValue) => {
        console.log(newValue)
        setCurrentDescriptionIndex(newValue);
    }

    const get_quality_label = (quality_uri) => {
        let label = quality_uri.split("#")[1]
        // capitalise label
        label = label.toUpperCase()[0] + label.toLowerCase().slice(1)
        if (label === "Low") {
            label = "Original"
        }
        return label
    }

    return (
        <>
            <Box pt={2} pb={1}>
                <Typography variant={"h6"}>Description - {entity_label}</Typography>
            </Box>
            <Paper component={"div"} sx={{minHeight: 130, pd: 1}}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={currentDescriptionIndex} onChange={handleDescriptionTabClick} >
                        {
                            descriptions.map((record, key) => (
                                <Tab key={key} label={get_quality_label(record.text_quality)} />
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
                                <DescriptionTabPanel description={descriptions[currentDescriptionIndex].description}
                                                     description_uri={descriptions[currentDescriptionIndex].uri}
                                />
                            )}
                        </div>
                    ))
                }
            </Paper>
        </>
    )
}

export default MultiSourceDescriptionDisplay;