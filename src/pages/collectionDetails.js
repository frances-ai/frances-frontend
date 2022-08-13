import React, {useEffect, useState} from 'react';
import {Container, Divider, FormControl, InputLabel, MenuItem, Select, Typography} from "@mui/material";
import QueryAPI from '../apis/query';


function CollectionDetailsPage() {

    const [collections, setCollections] = useState([]);
    const [selectedCollection, setSelectedCollection] = useState('');
    const [editions, setEditions] = useState([]);
    const [selectedEdition, setSelectedEdition] = useState('');


    useEffect(() => {
        QueryAPI.getAllCollectionName().then(response => {
            setCollections(response?.data);
        })
    }, []);

    useEffect(() => {
        QueryAPI.getAllEditionNameFromEB().then(response => {
            setEditions(response?.data);
        })
    }, [selectedCollection])

    return (
        <Container maxWidth="lg" sx={{mt: 2, minHeight: '70vh'}}>
            <Typography component="div" gutterBottom variant="h4" sx={{mt: 5}}>
                Exploring NLS Digital Collection Details
            </Typography>
            <Divider/>
            <FormControl sx={{ m: 3, minWidth: 200 }}>
                <InputLabel id="collection-label">Select Collection</InputLabel>
                <Select
                    labelId="collection-label"
                    id="collection-select"
                    label="collection"
                    value={selectedCollection}
                    autoWidth
                    onChange={(e) => setSelectedCollection(e.target.value)}
                >
                    <MenuItem disabled>Select Collection</MenuItem>
                    {
                        collections.map((item, index) => (
                            <MenuItem key={index} value={item}>{item}</MenuItem>
                        ))
                    }
                </Select>
            </FormControl>

            {
                selectedCollection === collections[0] ?
                    (<FormControl sx={{ m: 3, minWidth: 220 }}>
                        <InputLabel id="edition-label">Select Edition</InputLabel>
                        <Select
                            labelId="edition-label"
                            id="edition-select"
                            label="edition"
                            value={selectedEdition}
                            onChange={(e) => setSelectedEdition(e.target.value)}
                        >
                            <MenuItem disabled>Select Edition</MenuItem>
                            {
                                editions.map((item, index) => (
                                    <MenuItem key={index}>{item}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>) :
                    null
            }

        </Container>
        )
}

export default CollectionDetailsPage;