import {
    Card, CardActionArea,
    CardContent,
    CircularProgress, Divider, FormControl,
    Grid, MenuItem, Select,
    Stack, Switch, TablePagination,
    Typography
} from "@mui/material";

import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import QueryAPI from "../apis/query"
import Box from "@mui/material/Box";


function DocumentCard(props) {
    const [elevation, setElevation] = useState(2);

    const {data} = props;
    let name_html = data._source.name;
    if ("highlight" in data){
        name_html = "name" in data?.highlight ? data.highlight.name : data._source.name;
    }

    let alter_names_html = ""
    if ("alter_names" in data._source) {
        if ("highlight" in data && "alter_names" in data?.highlight) {
            alter_names_html = data.highlight.alter_names.join(", ");
        } else {
            alter_names_html = data._source.alter_names.join(", ");
        }
    }

    const MAX_DESCRIPTION_LENGTH = 700
    const description = data._source.description.length > MAX_DESCRIPTION_LENGTH ?
        data._source.description.substring(0, MAX_DESCRIPTION_LENGTH) + "......" :  data._source.description;

    const navigate = useNavigate();

    const handleCardClick = () => {
        // example of the data?.id: https://www.w3id.org/hto/Article/12233333
        const record_uri = data?._id;
        console.log(record_uri)
        // the record_path is hto/Article/12233333
        const record_path = record_uri.substring(record_uri.indexOf("/hto/"));
        navigate(record_path);
    }


    return (
        <Card elevation={elevation}
              onMouseOver={() => setElevation(5)}
              onMouseOut={() => setElevation(2)}>
            <CardActionArea onClick={handleCardClick}>
                <CardContent>
                    <Box>
                        <Typography variant="body" component={"span"} sx={{mr: 2}}>
                            {data._source.collection}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component={"span"} sx={{mr: 2}}>
                            {data._source.vol_title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component={"span"} sx={{mr: 2}}>
                            {data._source.year_published}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" component={"span"}>
                            {data._source.print_location}
                        </Typography>
                    </Box>
                    <Box mt={2}>
                        <Typography variant="h5" component={"span"} mr={2} dangerouslySetInnerHTML={{ __html:  name_html}}>
                        </Typography>
                        {
                            data._source.alter_names?.length > 0 ?
                                <React.Fragment>
                                    <Typography variant="h6" component={"span"} mr={2}>
                                        also known as
                                    </Typography>
                                    <Typography variant="h5" color="text.secondary" component={"span"} dangerouslySetInnerHTML={{ __html: alter_names_html}}>
                                    </Typography>
                                </React.Fragment>
                                : null
                        }
                    </Box>
                    <Divider sx={{mt: 2, mb: 2}}/>
                    <Box>
                        {
                            "highlight" in data && "description" in data.highlight ?
                                <ul>
                                    {
                                        data.highlight.description.map((value, index) => (
                                            <li key={index} dangerouslySetInnerHTML={{ __html: value}}></li>
                                        ))
                                    }
                                </ul> : <Typography variant="body1" component={"span"}>
                                    {description}
                                </Typography>
                        }
                    </Box>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}



function SearchResultPage() {

    const keyword = useLocation().state.keyword;
    const search_type = useLocation().state.search_type;

    const full_text_search_field_options = [
        {display_name: "Full Text", value: "full_text"},
        {display_name: "Term Name | Volume Title", value: "name"}
    ]

    const term_name_search_field_options = [
        {display_name: "Full Text", value: "full_text"},
        {display_name: "Term Name", value: "term_name"},
    ]

    const volume_title_search_field_options = [
        {display_name: "Full Text", value: "full_text"},
        {display_name: "Volume Title", value: "vol_title"}
    ]

    const sorting_options = [
        {
            display_name: "Relevance", sort: "_score", order: 'desc'
        },
        {
            display_name: "Year (Oldest First)", sort: "year_published", order: 'asc',
        },
        {
            display_name: "Year (Newest First)", sort: "year_published", order: 'desc',
        }
    ]
    const [query, setQuery] = useState();
    const [result, setResult] = useState();
    const [searchFieldOptions, setSearchFieldOptions] = useState(full_text_search_field_options)
    const [isSearching, setIsSearching] = useState(true)
    const [exactMatch, setExactMatch] = useState(false);
    const [phraseMatch, setPhraseMatch] = useState(false);
    const [collections, setCollections] = useState([])
    const [selectedSortIndex, setSelectedSortIndex] = useState(0);
    const [selectedSearchField, setSelectedSearchField] = useState(full_text_search_field_options[0].value);
    const [printLocations, setPrintLocations] = useState([''])
    const [selectedCollection, setSelectedCollection] = useState('All Collections');
    const [selectedPrintLocation, setSelectedPrintLocation] = useState('All Locations');
    const [editions, setEditions] = useState([])
    const [selectedEdition, setSelectedEdition] = useState('All Editions');


    useEffect(() => {
        if (keyword !== undefined) {
            setQuery({
                search_type: search_type === "full_text"? "lexical": search_type,
                keyword: keyword,
                page: 1, perPage: 10,
                search_field: full_text_search_field_options[0].value})
        }
    }, [])


    useEffect(() => {
        if (query !== undefined) {
            QueryAPI.search(query).then(res => {
                const data = res?.data?.hits;
                console.log(data)
                setResult(data)
                setIsSearching(false)
                const aggregations = res?.data?.aggregations;
                console.log("aggs")
                console.log(aggregations)
                const collection_names = aggregations.unique_collections.buckets.map(collection => collection.key);
                setCollections(collection_names)
                const location_names = aggregations.unique_print_locations.buckets.map(location => location.key);
                setPrintLocations(location_names);
                if (selectedCollection !== "All Collections") {
                    if (selectedCollection === "Encyclopaedia Britannica") {
                        const edition_names = aggregations.unique_edition_names.buckets.map(edition_name => edition_name.key);
                        setEditions(edition_names)
                    } else {
                        setEditions([])
                    }
                } else {
                    setEditions([])
                }
            })
        }

    }, [query])

    useEffect(() => {
        if (selectedPrintLocation !== undefined) {
            if (selectedPrintLocation === 'All Locations') {
                if (query !== undefined && query.hasOwnProperty("print_location")) {
                    // remove collection from query
                    const updatedQuery = { ...query };
                    delete updatedQuery["print_location"];
                    console.log(updatedQuery)
                    setQuery(updatedQuery);
                }
            } else {
                setQuery(prevState => ({
                    ...prevState,
                    print_location: selectedPrintLocation
                }))
            }
        }

    }, [selectedPrintLocation])


    useEffect(() => {
        if (selectedEdition !== undefined) {
            if (selectedEdition === 'All Editions') {
                if (query !== undefined && query.hasOwnProperty("edition_name")) {
                    // remove collection from query
                    const updatedQuery = { ...query };
                    delete updatedQuery["edition_name"];
                    console.log(updatedQuery)
                    setQuery(updatedQuery);
                }
            } else {
                setQuery(prevState => ({
                    ...prevState,
                    edition_name: selectedEdition
                }))
            }
        }

    }, [selectedEdition])


    useEffect(() => {
        if (selectedCollection !== undefined) {
            if (selectedCollection === 'All Collections') {

                if (query !== undefined && query.hasOwnProperty("collection")) {
                    // remove collection from query
                    const updatedQuery = { ...query };
                    delete updatedQuery.collection;
                    console.log(updatedQuery)
                    setQuery(updatedQuery);
                }
            } else {
                setQuery(prevState => ({
                    ...prevState,
                    collection: selectedCollection
                }))
            }
        }

    }, [selectedCollection])


    useEffect(() => {
        if (selectedSearchField !== undefined) {
            if (selectedSearchField === "full_text") {
                setQuery(prevState => ({
                    ...prevState,
                    search_field: selectedSearchField,
                    exact_match: false
                }))
            } else {
                setQuery(prevState => ({
                    ...prevState,
                    search_field: selectedSearchField
                }))
            }
        }
    }, [selectedSearchField])

    useEffect(() => {
        setQuery(prevState => ({
            ...prevState,
            exact_match: exactMatch
        }))
    }, [exactMatch])

    useEffect(() => {
        setQuery(prevState => ({
            ...prevState,
            phrase_match: phraseMatch
        }))
    }, [phraseMatch])


    useEffect(() => {
        if (selectedSortIndex !== undefined) {
            setQuery(prevState => ({
                ...prevState,
                sort: sorting_options[selectedSortIndex].sort,
                order: sorting_options[selectedSortIndex].order
            }))
        }

    }, [selectedSortIndex])


    const handleChangePage = (event, newPage) => {
        setQuery(prevState => ({
              ...prevState,
              page: newPage + 1
        }))
        setIsSearching(true)

    }

    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = event.target.value;
        setQuery(prevState => ({
            ...prevState,
            perPage: newRowsPerPage
        }))
        setIsSearching(true)
    }

    function handleLocationChange(event) {
        setSelectedPrintLocation(event.target.value);
    }

    function handleEditionChange(event) {
        setSelectedEdition(event.target.value);
    }

    function handleCollectionChange(event) {
        const new_collection = event.target.value;
        setSelectedCollection(event.target.value);
        if (new_collection === "All Collections") {
            setSearchFieldOptions(full_text_search_field_options)
            if (selectedSearchField === "term_name" || selectedSearchField === "vol_title") {
                setSelectedSearchField(full_text_search_field_options[1].value)
            }
        } else if (new_collection === "Encyclopaedia Britannica") {
            setSearchFieldOptions(term_name_search_field_options)
            if (selectedSearchField === "name") {
                setSelectedSearchField(term_name_search_field_options[1].value)
            }
        } else {
            setSearchFieldOptions(volume_title_search_field_options)
            if (selectedSearchField === "name") {
                setSelectedSearchField(volume_title_search_field_options[1].value)
            }
        }

    }

    function handleSearchFieldChange(event) {
        setSelectedSearchField(event.target.value);
    }

    function handleSortChange(event) {
        setSelectedSortIndex(event.target.value);
    }

    return (
        <Box sx={{ minHeight: '70vh'}}>
            <Grid container justifyContent={"flex-start"} pl={3} spacing={2}>
                <Grid item sm={9}>
                    {
                        isSearching ?
                            <CircularProgress/> :
                            <Box mt={2}>
                                <Typography component="div" gutterBottom variant="body">
                                    {result?.total.value} results for {keyword}
                                </Typography>
                                <Stack spacing={2}>
                                    {
                                        result?.hits.map((record, index) => (<DocumentCard key={index} data={record}/>))
                                    }
                                </Stack>
                                <TablePagination
                                    component="div"
                                    count={result.total.value}
                                    page={query.page - 1}
                                    onPageChange={handleChangePage}
                                    rowsPerPage={query.perPage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Box>
                    }
                </Grid>
                <Grid item sm={3}>
                    <Box
                        boxShadow={"1px 1px 3px rgba(0,0,0,0.1)"}
                        borderLeft={"1px solid"}
                        sx={{borderBottomLeftRadius: 4}}
                        borderBottom={"1px solid"}
                        borderColor={"divider"}>
                        <Stack>
                            <Typography component="div" variant="body1" fontWeight={"bold"} p={2}>
                                Sort By
                            </Typography>
                            <Divider/>
                            <Box p={2}>
                                <FormControl fullWidth>
                                    <Select
                                        value={selectedSortIndex}
                                        onChange={handleSortChange}
                                    >
                                        {
                                            sorting_options?.map((value, index) => (
                                                <MenuItem key={index} value={index}>{value.display_name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                </FormControl>
                            </Box>
                        </Stack>
                        <Stack>
                            <Typography component="div" variant="body1" fontWeight={"bold"} p={2}>
                                Search filters
                            </Typography>
                            <Divider/>
                            <Stack p={2}>
                                <Box mt={2}>
                                    <Typography component="div" variant="body1" fontWeight={"bold"}  color={"text.secondary"} pb={2}>
                                        Collection
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectedCollection}
                                            onChange={handleCollectionChange}
                                        >
                                            <MenuItem value={'All Collections'}>All Collections</MenuItem>
                                            {
                                                collections?.map((value, index) => (
                                                    <MenuItem key={index} value={value}>{value}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                                {
                                    search_type === "full_text" ? <Box mt={2}>
                                        <Typography component="div" variant="body1" fontWeight={"bold"}  color={"text.secondary"} pb={2}>
                                            Search Field
                                        </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                value={selectedSearchField}
                                                onChange={handleSearchFieldChange}
                                            >
                                                {
                                                    searchFieldOptions?.map((value, index) => (
                                                        <MenuItem key={index} value={value.value}>{value.display_name}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Box> : null
                                }
                                {
                                    selectedSearchField != "full_text" ?
                                        <Stack mt={2} direction="row" spacing={1} alignItems="center"
                                               justifyContent={"space-between"}>
                                            <Typography component="div" variant="body1" fontWeight={"bold"} >Exact Match</Typography>
                                            <Switch
                                                checked={exactMatch}
                                                onChange={(e) => setExactMatch(e.target.checked)}
                                            />
                                        </Stack>: null
                                }
                                {
                                    search_type === "full_text" ?
                                        <Stack mt={2} direction="row" spacing={1} alignItems="center"
                                               justifyContent={"space-between"}>
                                            <Typography component="div" variant="body1" fontWeight={"bold"} >Phrase Match</Typography>
                                            <Switch
                                                checked={phraseMatch}
                                                onChange={(e) => setPhraseMatch(e.target.checked)}
                                            />
                                        </Stack> : null
                                }
                                <Box mt={2}>
                                    <Typography component="div" variant="body1" fontWeight={"bold"} color={"text.secondary"} pb={2}>
                                        Print Location
                                    </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            value={selectedPrintLocation}
                                            onChange={handleLocationChange}
                                        >
                                            <MenuItem value={'All Locations'}>All Locations</MenuItem>
                                            {
                                                printLocations?.map((value, index) => (
                                                    <MenuItem key={index} value={value}>{value}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </Box>
                                {
                                    editions.length > 0?
                                        <Box mt={2}>
                                            <Typography component="div" variant="body1" fontWeight={"bold"} color={"text.secondary"} pb={2}>
                                                Editions
                                            </Typography>
                                            <FormControl fullWidth>
                                                <Select
                                                    value={selectedEdition}
                                                    onChange={handleEditionChange}
                                                >
                                                    <MenuItem value={'All Editions'}>All Editions</MenuItem>
                                                    {
                                                        editions?.map((value, index) => (
                                                            <MenuItem key={index} value={value}>{value}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                            </FormControl>
                                        </Box> : null
                                }
                            </Stack>
                        </Stack>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SearchResultPage;