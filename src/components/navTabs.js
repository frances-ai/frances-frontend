import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import {Link} from "react-router-dom";

export default function NavTabs(props) {
    const {sections, currentIndex} = props;

    return (
        <Box sx={{ width: '100%', ml: 3}}>
            <Tabs value={currentIndex} aria-label="nav tabs">
                {
                    sections.map((section) => (
                        <Tab
                            component={Link}
                            label={section.title}
                            key={section.title}
                            to={section.url}
                            sx={{fontSize: "1.2rem", textTransform: "none", minHeight: 64}}/>
                    ))
                }
            </Tabs>
        </Box>
    );
}

NavTabs.propTypes = {
    sections: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            url: PropTypes.string.isRequired,
        }),
    ).isRequired,
    currentIndex: PropTypes.number.isRequired
};