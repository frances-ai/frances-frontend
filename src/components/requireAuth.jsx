import useAuth from "../hooks/useAuth";
import {useLocation, Navigate} from "react-router-dom";
import AuthAPI from "../apis/auth";
import {useEffect, useState} from "react";
import {CircularProgress} from "@mui/material";

function RequireAuth({ children }) {
    const {auth, setAuth} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    useEffect(() => {
        if (!auth?.user) {
            AuthAPI.getProfile().then(response => {
                const user = response?.data?.user;
                console.log(user);
                setAuth({user});
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [])

    if (!isLoading) {
        return auth?.user ? children : <Navigate to="/login" state={{ from: location }} replace />;
    } else {
        return <CircularProgress />
    }

}

export default RequireAuth;