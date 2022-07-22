import useAuth from "../hooks/useAuth";
import {
    Avatar,
    Button,
    CircularProgress, Divider,
    IconButton, ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import AuthAPI from "../apis/auth";
import Box from "@mui/material/Box";
import {AccountCircle, Bookmarks, Cloud, Logout} from "@mui/icons-material";
import {useLocation, useNavigate} from "react-router-dom";

// Code example for Avatar from: https://mui.com/material-ui/react-avatar/#main-content
function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
}

function stringAvatar(first_name, last_name) {
    return {
        sx: {
            bgcolor: stringToColor(first_name + ' ' + last_name),
        },
        children: `${first_name.charAt(0)}${last_name.charAt(0)}`,
    };
}

function UserMenu() {
    const {auth, setAuth} = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigateToSignInPage =() => {
        navigate("/login", {state: {from: location}, replace: true})
    }

    const handleNavigateToRegisterPage =() => {
        navigate("/register", {state: {from: location}, replace: true})
    }

    const handleSignOut = () => {
        AuthAPI.logout().then(response => {
            console.log(response);
            setAuth({});
        })
    };

    useEffect(() => {
        // If user info has not been request
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

    if (isLoading) {
        return <CircularProgress sx={{mr: 5}}/>
    } else {
        if (auth?.user) {
            return (
                <Box sx={{ flexGrow: 0 }}>
                    <Tooltip title="Open User Menu">
                        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, mr: 5 }}>
                            <Avatar {...stringAvatar(auth.user.first_name, auth.user.last_name)} />
                        </IconButton>
                    </Tooltip>
                    <Menu
                        sx={{ mt: '45px' }}
                        id="menu-appbar"
                        anchorEl={anchorElUser}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center',
                        }}
                        open={Boolean(anchorElUser)}
                        onClose={handleCloseUserMenu}
                    >
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ListItemIcon>
                                <AccountCircle fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ListItemIcon>
                                <Bookmarks fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Saved</ListItemText>
                        </MenuItem>
                        <MenuItem onClick={handleCloseUserMenu}>
                            <ListItemIcon>
                                <Cloud fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Tasks</ListItemText>
                        </MenuItem>
                        <Divider/>
                        <MenuItem onClick={handleSignOut}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Sign out</ListItemText>
                        </MenuItem>
                    </Menu>
                </Box>
            )
        } else {
            return (
                <Box minWidth={280}>
                    <Button onClick={handleNavigateToRegisterPage} sx={{minWidth: 180, mr: 1}}>
                        Create an account
                    </Button>
                    <Button onClick={handleNavigateToSignInPage} variant={"contained"}>
                        Sign in
                    </Button>
                </Box>
            )
        }
    }
}

export default UserMenu;