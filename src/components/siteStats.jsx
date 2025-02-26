import {Typography} from "@mui/material";
import {useEffect, useState} from "react";
import StatsAPI from "../apis/stats";
import {useLocation} from "react-router-dom";

function SiteStats() {
    const location = useLocation();
    const [visits, setVisits] = useState([]);

    useEffect(() => {
        StatsAPI.get_number_of_visits().then(res => {
            const num_visits = res?.data
            console.log(num_visits)
            setVisits(num_visits)
        })
    }, [location.pathname])

    return (
        <>
            <Typography component={'span'} pl={2} variant="body2" fontSize={24}>{visits}</Typography>
            <Typography component={'span'} pl={1} variant="body2" color={"text.secondary"}>visits</Typography>
        </>
    )
}
export default SiteStats;