import {Typography} from "@mui/material";
import { Link } from "react-router-dom";

function Copyright(props) {
    return (
        <Typography variant="body2" align="center" {...props}>
            {'Copyright © '}
            <Link style={{color: "inherit"}} to="/">
                frances
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright