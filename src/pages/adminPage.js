import React, { useEffect, useState } from 'react';
import { Container, Divider, Grid, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import AuthAPI from "../apis/auth";
import LoadingButton from "@mui/lab/LoadingButton";
import { Search } from "@mui/icons-material";
import Button from '@mui/material/Button';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

function AdminPage() {


    const [users, setUsers] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);

    // Put fetchPending and fetchActive users in useEffect to prevent it from running in an infinite loop
    useEffect(() => {
        fetchPendingUsers();
        fetchActiveUsers();
    }, []);

    /**
     * Method to fetch all users that are currently pending
     */
    const fetchPendingUsers = () => {
        AuthAPI.getPendingUsers()
            .then(response => {
                const usersData = response?.data?.users_dicts;
                setUsers(usersData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    /**
     * Method to fetch all users that are currently active
     */
    const fetchActiveUsers = () => {
        AuthAPI.getActiveUsers()
            .then(response => {
                const activeUsersData = response?.data?.users_dicts;
                setActiveUsers(activeUsersData);
            })
            .catch(error => {
                console.log(error);
            });
    };

    /**
     * Method which handles when a users accept button is clicked
     * Updates their status from pending to active in the database
     * @param {*} user sends the User ID of the user whos name is clicked
     */
    const handleAcceptClick = (user) => {
        console.log(user.id);
        AuthAPI.activateUser(user.id)
            .then(() => {   // Refresh the arrays after accepting
                fetchPendingUsers(); 
                fetchActiveUsers(); 
            })
            .catch(error => {
                console.error("Error accepting user:", error);
            });
    };

    /**
     * Method which handles when a users deny button is clicked
     * Deletes the user from the database and their information
     * Used both to deny new users, and to delete existing users 
     * @param {} user sends the User ID of the user whos name is clicked
     */
    const handleDeleteClick = (user) => {
        console.log(`Deny clicked for user: ${user.id}`);
        AuthAPI.deleteUser(user.id)
            .then(() => {   // Refresh the arrays after denying
                fetchPendingUsers(); 
                fetchActiveUsers();
            })
            .catch(error => {
                console.error("Error deleting user:", error);
            });
    };


    return (

        /**
         * Contains the code for the top menu bar of the adminpage describing what the purpose of the page is
         */
        <Container maxWidth="lg" sx={{ mt: 2, minHeight: '70vh' }}>

            <Typography component="div" gutterBottom variant="h4" sx={{ mt: 5 }}>
                Admin Dashboard
            </Typography>
            <Typography component="div" gutterBottom variant="h5" sx={{ mt: 5 }}>
                Approve New Users
            </Typography>
            <Divider />
            <Typography component="div" gutterBottom variant="body1" sx={{ mt: 2 }}>
                Below are the users who are requesting to join, please click the corresponding buttons to either accept them and make them active, or deny them and delete their user.
            </Typography>


            {/* Pending Users Table */}
            <TableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Accept</TableCell>
                            <TableCell>Deny</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleAcceptClick(user, 'accept')}>
                                        Accept
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleDeleteClick(user, 'deny')}>
                                        Deny
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>


            {/* Active Users Table*/}
            <Typography component="div" gutterBottom variant="h5" sx={{ mt: 5 }}>
                Active Users
            </Typography>

            <Typography component="div" gutterBottom variant="body1" sx={{ mt: 2 }}>
                Below are the existing users, press delete to permanently delete them from the database.
            </Typography>
            <Divider />
            <TableContainer sx={{ mt: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {activeUsers.map((user, index) => (
                            <TableRow key={index}>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleDeleteClick(user)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Container>


    );
}

export default AdminPage;