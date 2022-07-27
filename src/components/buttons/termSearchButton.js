import React from 'react';
import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";


function TermSearchButton(props) {
    const {term, currentSearchInfo} = props;
    const location = useLocation();
    const navigate = useNavigate();

    const handleTermSearchClick = () => {
        const navStack = location.state?.navStack ? location.state.navStack: [];
        navStack.push(currentSearchInfo);

        navigate("/result",
            {state:
                    {
                        to: {
                            type: 'TermSearch',
                            key: term,
                            name: 'TermSearch(' + term + ')'
                        },
                        navStack: navStack
                    }
            })
    }


    return (
        <Button onClick={handleTermSearchClick}>
            {term}
        </Button>
    )
}

export default TermSearchButton;