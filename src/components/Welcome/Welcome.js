import React from 'react';
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

const Welcome = (props) => {
    const { history } = props;
    const classes = useStyles();
    const [username, setUsername] = React.useState(CONFIGS.getUsername());
    const [meetingId, setMeetingId] = React.useState("");

    const createRoom = async () => {
        try {
            let resp = await CONFIGS.API.post(`/meetings/createRoom`, { username });
            if (resp.data.status) {
                let info = resp.data.data;
                const token = localStorage.getItem('token');
                localStorage.clear();
                localStorage.setItem('token', token);
                localStorage.setItem(info.meetingId, info.host.hostId);
                history.push(`/join/${info.meetingId}`);
            } else {
                alert(resp.data.msg);
            }
        } catch (err) {
            console.log('Error in axios', err);
        }
    }

    const signIn = () => {
        history.push(`/signin`);
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
                    <Paper elevation={10} className={classes.panel}>
                        <Typography variant="h4" color="error">New Meeting</Typography>
                        <br />
                        <br />
                        {!CONFIGS.isSignedIn() && <><Typography>Sign in to start a new meeting</Typography>
                        <br />
                        <br />
                        <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" type="button" onClick={signIn}>SIGN IN</Button>
                        </div></>}
                        {CONFIGS.isSignedIn() && <div className={classes.alignRight}>
                            <Button variant="contained" color="primary" disabled={username == ""} type="button" onClick={createRoom}>START A NEW MEETING</Button>
                        </div>}
                    </Paper>
                </Grid>
                <Grid item sm={2}></Grid>
                <Grid item sm={4}>
                    <Paper elevation={10} className={classes.panel}>
                        <Typography variant="h4" color="error">Join Meeting</Typography>
                        <br />
                        <br />
                        <Typography>Enter Meeting ID below to get started.</Typography>
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