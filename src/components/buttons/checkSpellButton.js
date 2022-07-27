import React from 'react';
import {Button} from "@mui/material";
import {useLocation, useNavigate} from "react-router-dom";
import {findTermLinkFromUri} from "../../utils/stringUtil";

function CheckSpellButton(props) {
    const {uri, currentSearchInfo} = props;
    const location = useLocation();
    const navigate = useNavigate();

    const handleCheckSpellClick = () => {
        const navStack = location.state?.navStack ? location.state.navStack: [];
        navStack.push(currentSearchInfo);
        const termLink = findTermLinkFromUri(uri);
        navigate("/result",
            {state:
                    {
                        to: {
                            type: 'SpellCheck',
                            key: uri,
                            name: 'SpellCheck(' + termLink + ')'
                        },
                        navStack: navStack
                    }
            })
    }

    return (
        <Button onClick={handleCheckSpellClick}>
            Check Spell
        </Button>
    )
}

export default CheckSpellButton;