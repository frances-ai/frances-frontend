import React from 'react';
import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";

function SimilarTermsButton(props) {

    const {resource_uri, currentSearchInfo} = props;
    const location = useLocation();
    const navigate = useNavigate();


    const handleSimilarTermsClick = () => {
        const navStack = location.state?.navStack ? location.state.navStack: [];
        navStack.push(currentSearchInfo);

        navigate("/result",
            {state:
                    {
                        to: {
                            type: 'TermSimilarity',
                            key: resource_uri
                        },
                        navStack: navStack
                    }
            })
    }

    return (
        <Button onClick={handleSimilarTermsClick}>
            Similar Terms
        </Button>
    )
}

export default SimilarTermsButton;