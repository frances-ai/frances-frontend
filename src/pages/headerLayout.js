import Header, {sections} from "../components/header";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from 'react';
import {Outlet, useLocation} from 'react-router-dom'
import Copyright from "../components/copyright";
import SiteStats from "../components/siteStats";
import Footer from "../components/footer";

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
            <Box minHeight={'90vh'}>
                <Header index={currentIndex}/>
                <Outlet/>
            </Box>
            <Footer />
        </Box>
    )
}

export default HeaderLayout;