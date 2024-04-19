import React from 'react';
import {AppBar, Toolbar} from "@mui/material";
import FrancesLogo from "./frances-logo";
import NavTabs from "./navTabs";
import UserMenu from "./userMenu";

export const sections = [
    { title: 'Search', url: '/search' },
    { title: 'Term Search', url: '/termSearch' },
    { title: 'Term Similarity', url: '/termSimilarity' },
    { title: 'Topic Modelling', url: '/topicModelling' },
    { title: 'Defoe Queries', url: '/defoeQuery' },
    { title: 'Collection Details', url: '/collectionDetails' }
];

function Header(props) {
    const currentSectionIndex = props.index;
    console.log(currentSectionIndex);

    return (
        <React.Fragment>
            <AppBar position={"sticky"} color={"white"}>
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