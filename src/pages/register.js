import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Container,
    createTheme,
    Grid, Link,
    TextField,
    Typography
} from "@mui/material";
import Copyright from "../components/copyright";
import FrancesLogo from "../components/frances-logo";
import validator from "validator/es";
import AuthAPI from '../apis/auth'
import useAuth from "../hooks/useAuth";
import {useLocation, useNavigate} from "react-router-dom";

const theme = createTheme();

function RegisterPage() {

    const {setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [firstName, setFirstName] = useState('');
    const [isValidFirstName, setIsValidFirstName] = useState(false);
    const [firstNameError, setFirstNameError] = useState('');

    const [lastName, setLastName] = useState('');
    const [isValidLastName, setIsValidLastName] = useState(false);
    const [lastNameError, setLastNameError] = useState('');

    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(false);
    const [passwordError, setPasswordError] = useState('');

    const [matchPassword, setMatchPassword] = useState('');
    const [isValidMatchPassword, setIsValidMatchPassword] = useState(false);
    const [matchPasswordError, setMatchPasswordError] = useState('');

    const [fieldChecked, setFiledChecked] = useState({
        firstName: false,
        lastName: false,
        email: false,
        password: false,
        match_pwd: false
    });

    useEffect(() => {
        //validate first name
        if (fieldChecked.firstName) {
            if (firstName.length === 0) {
                setFirstNameError('Cannot be empty');
                setIsValidFirstName(false);
            } else if (!validator.isAlpha(firstName)) {
                setIsValidFirstName(false);
                setFirstNameError('Invalid name');
            } else {
                setFirstNameError('');
                setIsValidFirstName(true);
            }
        }
    }, [firstName])

    useEffect(() => {
        //validate last name
        if (fieldChecked.lastName) {
            if (lastName.length === 0) {
                setIsValidLastName(false);
                setLastNameError('Cannot be empty');
            } else if (!validator.isAlpha(firstName)) {
                setIsValidLastName(false);
                setLastNameError('Invalid name');
            } else {
                setLastNameError('');
                setIsValidLastName(true);
            }
        }
    }, [lastName])

    useEffect(() => {
        //validate email
        if (fieldChecked.email) {
            if (email.length === 0) {
                setIsValidEmail(false);
                setEmailError('Cannot be empty');
            } else if (!validator.isEmail(email)) {
                setIsValidEmail(false);
                setEmailError('Invalid email');
            } else {
                //check if email has been registered
                AuthAPI.emailRegistered(email)
                    .then(response => {
                    setIsValidEmail(!response.data.registered);
                    setEmailError(response.data.registered ? 'This email has benn registered!' : '');
                }).catch(error => {
                    setIsValidEmail(false)
                    setEmailError(error.reponse.data.error)
                })
            }
        }
    }, [email])

    useEffect(() => {
        //validate password
        if (fieldChecked.password) {
            if (password.length < 6) {
                setPasswordError('Length cannot shorter than 6');
                setIsValidPassword(false);
            } else if (!validator.isAlphanumeric(password)) {
                setPasswordError('Password can only be letters and/or numbers');
                setIsValidPassword(false);
            } else {
                setPasswordError('');
                setIsValidPassword(true);
            }
        }

        //validate match password
        if (fieldChecked.match_pwd) {
            if (matchPassword.length === 0) {
                setMatchPasswordError('Cannot be empty');
                setIsValidMatchPassword(false);
            } else if (matchPassword !== password) {
                setMatchPasswordError("Password doesn't match");
                setIsValidMatchPassword(false);
            } else {
                setMatchPasswordError('');
                setIsValidMatchPassword(true);
            }
        }
    }, [password, matchPassword])



    const handleSubmit = (event) => {
        event.preventDefault();
        AuthAPI.register(firstName, lastName, email, password)
            .then(response => {
                console.log(response.data);
                //login
                AuthAPI.login(email, password).then(response => {
                    console.log(response)
                    const user = response?.data?.user;
                    setAuth({user});
                    navigate(from, { replace: true });
                })
            }).catch(error => {
                console.log(error.response);
        })

    };

    return (
            <Container component="main" maxWidth="xs">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <FrancesLogo size={"3rem"} weight={"bold"}/>
                    <Typography component="h1" variant="h5" sx={{mt: 2}}>
                        Sign up
                    </Typography>
                    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="given-name"
                                    name="firstName"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    onChange={(e) => {
                                        setFiledChecked(prevState => ({
                                            ...prevState,
                                                firstName: true
                                        }))
                                        setFirstName(e.target.value)
                                    }}
                                    error={fieldChecked.firstName && !isValidFirstName}
                                    helperText={firstNameError}
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="family-name"
                                    onChange={(e) => {
                                        setFiledChecked(prevState => ({
                                            ...prevState,
                                            lastName: true
                                        }))
                                        setLastName(e.target.value)
                                    }}
                                    error={fieldChecked.lastName && !isValidLastName}
                                    helperText={lastNameError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={(e) => {
                                        setFiledChecked(prevState => ({
                                            ...prevState,
                                            email: true
                                        }))
                                        setEmail(e.target.value)
                                    }}
                                    error={fieldChecked.email && !isValidEmail}
                                    helperText={emailError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="new-password"
                                    onChange={(e) => {
                                        setFiledChecked(prevState => ({
                                            ...prevState,
                                            password: true
                                        }))
                                        setPassword(e.target.value)
                                    }}
                                    error={fieldChecked.password && !isValidPassword}
                                    helperText={passwordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="confirm password"
                                    label="Confirm Password"
                                    type="password"
                                    id="confirmedPassword"
                                    autoComplete="off"
                                    onChange={(e) => {
                                        setFiledChecked(prevState => ({
                                            ...prevState,
                                            match_pwd: true
                                        }))
                                        setMatchPassword(e.target.value)
                                    }}
                                    error={fieldChecked.match_pwd && !isValidMatchPassword}
                                    helperText={matchPasswordError}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={!(isValidFirstName && isValidLastName && isValidEmail
                            && isValidPassword && isValidMatchPassword)}
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
    );
}

export default RegisterPage