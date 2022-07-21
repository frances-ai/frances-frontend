import React from 'react';
import {AppBar, Button, Link, Toolbar} from "@mui/material";
import FrancesLogo from "./frances-logo";
import NavTabs from "./navTabs";
import UserMenu from "./userMenu";

const sections = [
    { title: 'Term Search', url: '/termSearch' },
    { title: 'Term Similarity', url: '/termSimilarity' },
    { title: 'Topic Modelling', url: '#' },
    { title: 'Defoe Queries', url: '/defoeQuery' },
    { title: 'Collection Details', url: '#' },
];

function Header(props) {
    const currentSectionIndex = props.index;
    console.log(currentSectionIndex);

    return (
        <React.Fragment>
            <AppBar position={"static"} color={"transparent"}>
                <Toolbar variant="dense" >
                    <FrancesLogo size={"2rem"} weight={"bold"} />
                    <NavTabs sections = {sections} currentIndex = {currentSectionIndex}/>
                    <UserMenu/>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    )
}

export default Header;