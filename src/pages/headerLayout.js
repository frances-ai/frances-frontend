import Header, {sections} from "../components/header";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from 'react';
import {Outlet, useLocation} from 'react-router-dom'
import Copyright from "../components/copyright";

function HeaderLayout() {
    const location = useLocation();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        sections.map((section, index) => {
            if (section.url === location.pathname) {
                setCurrentIndex(index);
            }
        })
    }, [location])

    return (
        <Box>
            <Header index={currentIndex}/>
            <Outlet/>
            <Copyright sx={{ mt: 4, mb: 4 }}/>
        </Box>
    )
}

export default HeaderLayout;