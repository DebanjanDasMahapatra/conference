import React from 'react';
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, Grid, Box, Typography } from '@material-ui/core';
import { Config } from '../../config';

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

const Welcome = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [username, setUsername] = React.useState("");
    const [meetingId, setMeetingId] = React.useState("");

    const createRoom = async () => {
        try {
            let resp = await axios.post(Config.apiUrl + 'createRoom', { username });
            if (resp.data.status) {
                let info = resp.data.data;
                localStorage.clear();
                localStorage.setItem(info.meetingId, info.host.hostId);
                history.push(`/join/${info.meetingId}`);
            }
        } catch (err) {
            console.log('Error in axios', err);
        }
    }

    const joinMeeting = () => {
        history.push(`/join/${meetingId}`);
    }

    return (<>
        <Box sx={{ flexGrow: 1 }}>
            <br />
            <br />
            <Grid container spacing={2}>
                <Grid item sm={1}></Grid>
                <Grid item sm={4}>
                    <Paper elevation={4} className={classes.panel}>
                        <Typography variant="h4" color="error">New Meeting</Typography>
                        <br />
                        <br />
                        <Typography>If you want to start a new meeting, enter your username below to get started.</Typography>
                        <br />
                        <TextField label="Username" placeholder="Your Username" variant="standard" color="secondary" onChange={($e) => { setUsername($e.target.value) }} />
                        <br />
                        <br />
                        <br />
                        <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" disabled={username == ""} type="button" onClick={createRoom}>CREATE</Button>
                        </div>
                    </Paper>
                </Grid>
                <Grid item sm={2}></Grid>
                <Grid item sm={4}>
                    <Paper elevation={4} className={classes.panel}>
                        <Typography variant="h4" color="error">Join Meeting</Typography>
                        <br />
                        <br />
                        <Typography>If you want to join a meeting, enter Meeting ID below to get started.</Typography>
                        <br />
                        <TextField label="Meeting ID" placeholder="Meeting ID" variant="standard" color="secondary" onChange={($e) => { setMeetingId($e.target.value) }} />
                        <br />
                        <br />
                        <br />
                        <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" disabled={meetingId == ""} type="button" onClick={joinMeeting}>JOIN</Button>
                        </div>
                    </Paper>
                </Grid>
                <Grid item sm={1}></Grid>
            </Grid>
        </Box>
    </>
    );
}

export default Welcome;