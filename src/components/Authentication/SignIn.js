import React from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, Grid, Box, Typography } from '@material-ui/core';
import { CONFIGS } from '../../config';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
            width: '25ch',
        },
    },
    root2: {
        display: 'flex',
        flexWrap: 'wrap',
        '& > *': {
            margin: theme.spacing(1),
            width: theme.spacing(16),
            height: theme.spacing(16),
        },
    },
    panel: {
        padding: theme.spacing(6)
    },
    alignRight: {
        textAlign: 'right'
    }
}));

const SignIn = (props) => {
    const { history, setUpdating } = props;
    const classes = useStyles();
    const [signUpInfo, setSignUpInfo] = React.useState({
        name: undefined,
        email: undefined,
        password: undefined
    });
    const [signInInfo, setSignInInfo] = React.useState({
        email: "",
        password: ""
    });
    const [temp, setTemp] = React.useState("");

    const signUp = async () => {
        try {
            let resp = await CONFIGS.API.post('/users/register', signUpInfo);
            if (resp.data.status) {
                alert(resp.data.msg);
                setSignUpInfo({
                    name: "",
                    email: "",
                    password: ""
                });
                setTemp("");
            } else {
                alert(resp.data.msg);
            }
        } catch (err) {
            console.log('Error in axios', err);
        }
    }

    const signIn = async () => {
        try {
            let resp = await CONFIGS.API.post('/users/login', signInInfo);
            if (resp.data.status) {
                let info = resp.data;
                localStorage.clear();
                localStorage.setItem("token", info.token);
                setUpdating(true);
                history.push(`/`);
            } else {
                alert(resp.data.msg)
            }
        } catch (err) {
            console.log('Error in axios', err);
        }
    }

    return (<>
        <Box sx={{ flexGrow: 1 }}>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item sm={1}></Grid>
                <Grid item sm={4}>
                    <Paper elevation={10} className={classes.panel}>
                        <Typography variant="h4" color="secondary">SIGN UP</Typography>
                        <br />
                        <br />
                        <TextField type="text" label="Name" placeholder="Your Name" variant="standard" color="secondary" value={signUpInfo.name} onChange={($e) => { setSignUpInfo({...signUpInfo, name: $e.target.value}) }} required />
                        <br />
                        <br />
                        <TextField type="text" label="Email" placeholder="Your Email" variant="standard" color="secondary" value={signUpInfo.email} onChange={($e) => { setSignUpInfo({...signUpInfo, email: $e.target.value}) }} required />
                        <br />
                        <br />
                        <TextField type="password" label="Password" placeholder="Your Password" variant="standard" color="secondary" value={signUpInfo.password} onChange={($e) => { setSignUpInfo({...signUpInfo, password: $e.target.value}) }} required />
                        <br />
                        <br />
                        <TextField type="password" label="Confirm Password" placeholder="Your Password Again" variant="standard" color="secondary" value={temp} onChange={($e) => { setTemp($e.target.value) }} required />
                        <br />
                        <br />
                        <br />
                        <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" disabled={signUpInfo.name == "" || signUpInfo.email == "" || signUpInfo.password == "" || signUpInfo.password != temp} type="button" onClick={signUp}>Sign UP</Button>
                        </div>
                    </Paper>
                </Grid>
                <Grid item sm={2}></Grid>
                <Grid item sm={4}>
                    <Paper elevation={10} className={classes.panel}>
                        <Typography variant="h4" color="secondary">SIGN IN</Typography>
                        <br />
                        <br />
                        <Typography>Enter your email and password:</Typography>
                        <br />
                        <TextField type="text" label="Username" placeholder="Your Username" variant="standard" color="secondary" value={signInInfo.email} onChange={($e) => { setSignInInfo({...signInInfo, email: $e.target.value}) }} required />
                        <br />
                        <br />
                        <TextField type="password" label="Password" placeholder="Your Password" variant="standard" color="secondary" value={signInInfo.password} onChange={($e) => { setSignInInfo({...signInInfo, password: $e.target.value}) }} required />
                        <br />
                        <br />
                        <br />
                        <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" disabled={signInInfo.email == "" || signInInfo.password == ""} type="button" onClick={signIn}>Sign In</Button>
                        </div>
                    </Paper>
                </Grid>
                <Grid item sm={1}></Grid>
            </Grid>
        </Box>
    </>
    );
}

export default SignIn;