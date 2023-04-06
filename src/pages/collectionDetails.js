import React, {useEffect, useState} from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    CircularProgress,
    Container,
    Grid,
    Typography
} from "@mui/material";
import CollectionAPI from '../apis/collection';
import Box from "@mui/material/Box";
import background from './background.jpg'
import {useNavigate} from "react-router-dom";


function CollectionCard(props) {
    const {collection} = props;
    const [elevation, setElevation] = useState(3);
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate("/collectionDetails/detail", {state:
                {collection: {
                    id: collection.id, name: collection.name
                    }}
        })
    }

    return (
        <Card sx={{ maxWidth: 500 }} elevation={elevation}
              onMouseOver={() => setElevation(10)}
              onMouseOut={() => setElevation(3)}
        >
            <CardActionArea onClick={handleCardClick}>
                <CardMedia
                    component="img"
                    height="235"
                    image={CollectionAPI.get_image_url(collection.image_name)}
                    alt={collection.image_name}
                />
                <CardContent sx={{backgroundColor: '#fffde7'}}>
                    <Typography gutterBottom sx={{font: '27 black', fontWeight: 'bold', textAlign: 'center'}} component="div">
                        {collection.name + ',' + collection.year_range[0] + '-' + collection.year_range[1]}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
}

function CollectionCards(props) {
    const {collections, sx} = props;

    return (
        <Box sx={sx}>
            <Grid container rowSpacing={2} columnSpacing={{ xs: 1, sm: 2, md: 5 }}>
                {
                    collections.map((collection, key) => (
                        <Grid item xs={6} sm={4} md={4} key={key}>
                            <CollectionCard collection={collection} />
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    )
}


function CollectionDetailsPage() {

    const [collections, setCollections] = useState([]);
    const [isPageLoading, setPageIsLoading] = useState(true);

    useEffect(() => {
        CollectionAPI.get_collections().then(r => {
            console.log(r.data.collections)
            setCollections(r?.data?.collections)
        })
    },[])

    useEffect(() => {
        if (collections.length !== 0) {
            setPageIsLoading(false);
        }
    }, [collections])


    return (
        <Box >
            <Box sx={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -2,
                backgroundImage: `url(${background})`,
                backgroundSize: '120%',
                backgroundPosition: "center, center",
                filter: 'blur(6px) grayscale(50%)',
            }}/>
            <Box sx={{
                height: '100%',
                width: '100%',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: -1,
                backgroundColor: 'rgba(255,255,255,0.7)'
            }}/>
            <Container maxWidth="lg" sx={{mt: 3, minHeight: '70vh'}}>
                <Typography component="div" gutterBottom variant="h4">
                    Exploring NLS Digital Collections
                </Typography>
                {
                    isPageLoading?
                        <CircularProgress/>
                        : <CollectionCards sx={{mt: 3}} collections={collections} />
                }
            </Container>
        </Box>
        )
}

export default CollectionDetailsPage;