import React from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "@mui/material";
import {findTopicModelID} from "../../utils/stringUtil";

function TopicModelButton(props) {
    const {model_name, currentSearchInfo} = props;
    const location = useLocation();
    const navigate = useNavigate();

    const handleModelIDClick = () => {
        const navStack = location.state?.navStack ? location.state.navStack: [];
        navStack.push(currentSearchInfo);
        const modelID = findTopicModelID(model_name);
        navigate("/result",
            {state:
                    {
                        to: {
                            type: 'TopicModelling',
                            key: model_name,
                            name: 'TopicModelling(' + modelID + ')'
                        },
                        navStack: navStack
                    }
            })
    }

    return (
        <Button onClick={handleModelIDClick}>
            {findTopicModelID(model_name)}
        </Button>
    )
}

export default TopicModelButton;