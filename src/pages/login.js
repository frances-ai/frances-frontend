import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom"
import {
    Box,
    Button, Container,
    createTheme,
    CssBaseline, Grid, Link,
    TextField,
    ThemeProvider,
    Typography
} from "@mui/material";
import Copyright from "../components/copyright";
import FrancesLogo from "../components/frances-logo";
import Auth from "../apis/auth";
import useAuth from "../hooks/useAuth";

const theme = createTheme();

export default function LoginPage() {

    const {auth, setAuth} = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [isValidEmail, setIsValidEmail] = useState(true);
    const [emailError, setEmailError] = useState('');

    const [password, setPassword] = useState('');
    const [isValidPassword, setIsValidPassword] = useState(true);
    const [passwordError, setPasswordError] = useState('');

    useEffect(() => {
        //Reset after typing
        setIsValidEmail(true);
        setEmailError('')

        setIsValidPassword(true)
        setPasswordError('')
    }, [email, password])

    const handleSubmit = (event) => {
        event.preventDefault();
        //validate email
        let valid = true
        if (email.length === 0) {
            valid = false
            setIsValidEmail(false);
            setEmailError('Cannot be empty')
        } else {
            setIsValidEmail(true);
            setEmailError('')
        }

        //validate password
        if (password.length === 0) {
            valid = false;
            setIsValidPassword(false);
            setPasswordError('Cannot be empty')
        } else {
            setIsValidPassword(true);
            setPasswordError('');
        }

        if (valid) {
            Auth.login(email, password).then(response => {
                console.log(response)
                const user = response?.data?.user;
                console.log(auth)
                setAuth({user});
                navigate(from, { replace: true });
            }).catch(e => {
                console.log(e?.response)
                setIsValidPassword(false);
                setPasswordError(e?.response?.data?.error)
            })
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <FrancesLogo size={40} weight={"bold"}/>
                    <Typography component="h1" variant="h5" sx={{mt: 2}}>
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={(e) => setEmail(e.target.value)}
                            error={!isValidEmail}
                            helperText={emailError}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={(e) => setPassword(e.target.value)}
                            error={!isValidPassword}
                            helperText={passwordError}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 8, mb: 4 }} />
            </Container>
        </ThemeProvider>
    );
}