import {useEffect, useState} from "react";
import {Outlet} from "react-router-dom"
import useAuth from "../hooks/useAuth";
import AuthAPI from "../apis/auth"

function PersistLogin() {
    const [isLoading, setIsloading] = useState(true);
    const {auth, setAuth} = useAuth();

    useEffect(() => {
        if (!auth?.user) {
            AuthAPI.getProfile().then(response => {
                const user = response?.data;
                setAuth({user})
            })
        }
        setIsloading(false);
    })

    return (
        <>
            {isLoading ? <p>Loading.....</p> : <Outlet/>}
        </>
    )
}

export default PersistLogin;