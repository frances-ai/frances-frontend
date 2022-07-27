import React from 'react'
import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {findTermLinkFromUri} from "../../utils/stringUtil";

function VisualiseButton(props) {
    const {uri, currentSearchInfo} = props;
    const location = useLocation();
    const navigate = useNavigate();

    function handVisualiseClick() {
        const navStack = location.state?.navStack ? location.state.navStack: [];
        navStack.push(currentSearchInfo);
        const termLink = findTermLinkFromUri(uri);
        navigate("/result",
            {state:
                    {
                        to: {
                            type: 'Visualisation',
                            key: uri,
                            name: 'Visualisation(' + termLink + ')'
                        },
                        navStack: navStack
                    }
            })
    }

    return (
        <Button onClick={handVisualiseClick}>
            Visualise
        </Button>
    )
}

export default VisualiseButton;