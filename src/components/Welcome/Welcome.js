import React from 'react';
import { Route, Switch } from "react-router-dom";
import "./Welcome.css";
import io from "socket.io-client";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, LinearProgress, Grid, Box, Typography } from '@material-ui/core';
import Meeting from '../MeetingArena/Meeting';
import { Config } from '../../config';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

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
        padding: theme.spacing(2),
        textAlign: 'center'
    }
}));

let hostSocket, participantSocket, INTERVAL, credentials = {};

const createSocket = (roomId, guestObj, meetingId, history, setLoader) => {
    participantSocket = io(Config.apiUrl + roomId, {
        query: {
            roomId: roomId,
            userId: guestObj.guestId
        }
    });
    // console.log('Socket...',participantSocket);
    participantSocket.on("authenticate", auth => {
        // console.log(auth);
        if (auth.status) {
            credentials.creds = {
                roomId, guestObj, meetingId
            };
            credentials.isHost = false;
            credentials.status = true;
            participantSocket["_ownId"] = guestObj.guestId;
            participantSocket["_ownName"] = guestObj.guestName;
            participantSocket["_isHost"] = false;
            credentials.socket = participantSocket;
            credentials.parts = [{
                guestId: "everyone",
                guestName: "EVERYONE",
                isHost: false
            }, ...auth.guests];
            setLoader(false);
            history.push('/meeting');
        }
    });
}

const pingServer = (creds, history, setLoader, setMessage, setAlert) => {
    let count = 0;
    INTERVAL = setInterval(async () => {
        try {
            let resp = await axios.get(Config.apiUrl + 'checkReqStatus?' +
                `guestId=${creds.guestObj.guestId}&meetingId=${creds.meetingId}`);
            // console.log(resp.data)
            if (resp.data.status) {
                clearInterval(INTERVAL);
                setMessage("Joining meeting...");
                createSocket(resp.data.roomId, resp.data.guestObj, creds.meetingId, history, setLoader);
            }
            else if (count < 5)
                count++;
            else {
                clearInterval(INTERVAL);
                setLoader(false);
                setAlert(true);
            }
        } catch (err) {
            console.error(err);
        }
    }, 4000);
}

const createRoom = async (username, history, setLoader) => {
    try {
        let resp = await axios.post(Config.apiUrl + 'createRoom', {
            username
        });
        if (resp.data.status) {
            hostSocket = io(Config.apiUrl + resp.data.data.roomId, {
                query: {
                    roomId: resp.data.data.roomId,
                    userId: resp.data.data.host.hostId
                }
            });

            // console.log('Socket...',hostSocket);
            hostSocket.on("authenticate", auth => {
                console.log("welcome.js", auth.guests);
                if (auth.status) {
                    credentials.creds = resp.data.data;
                    credentials.isHost = true;
                    credentials.status = true;
                    hostSocket["_ownId"] = resp.data.data.host.hostId;
                    hostSocket["_ownName"] = resp.data.data.host.hostName;
                    hostSocket["_isHost"] = true;
                    credentials.socket = hostSocket;
                    credentials.parts = [{
                        guestId: "everyone",
                        guestName: "EVERYONE",
                        isHost: false
                    }, ...auth.guests];
                    setLoader(false);
                    history.push('/meeting');
                }
            });
        } else {
            console.log('Error in response', resp.data);
        }
    } catch (err) {
        console.log('Error in axios', err);
    }
}

const joinRoom = async (username, meetingId, roomKey, history, setLoader, setMessage, setAlert) => {
    try {
        let resp = await axios.post(Config.apiUrl + 'joinRoom', {
            username,
            meetingId: meetingId,
            roomKey: roomKey == "" ? null : roomKey
        });
        if (resp.data.status)
            createSocket(resp.data.data.roomId, resp.data.data.guestObj, meetingId, history, setLoader);
        else {
            setMessage("Wait till host admits you...");
            pingServer(resp.data.data, history, setLoader, setMessage, setAlert);
        }
    } catch (err) {
        console.log('Error in axios', err);
    }
}

const Welcome = (props) => {
    const classes = useStyles();
    const [loader, setLoader] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [usernameHost, setUsernameHost] = React.useState("");
    const [usernameGuest, setUsernameGuest] = React.useState("");
    const [meetingId, setMeetingId] = React.useState("");
    const [roomKey, setRoomKey] = React.useState("");

    return (<>
        <Switch>
            <Route exact path="/">
                {!loader && <>
                    <Box sx={{ flexGrow: 1 }}>
                        <br />
                        <br />
                        <Grid container spacing={2}>
                            <Grid item sm={1}></Grid>
                            <Grid item sm={4} className={classes.panel}>
                                <Paper elevation={4}>
                                <br />
                                <h1>New Meeting</h1>
                                <p>If you want to start a new meeting, enter your username below to get started.</p>
                                <TextField label="Username" placeholder="Username" variant="standard" onChange={($e) => { setUsernameHost($e.target.value) }} />
                                <br />
                                <br />
                                <br />
                                <Button variant="contained" color="primary" disabled={usernameHost == ""} type="button" onClick={() => {
                                    setMessage("Starting meeting...");
                                    setLoader(true); createRoom(usernameHost, props.history, setLoader)
                                }}>CREATE</Button>
                                <br />
                                <br />
                                <br />
                                </Paper>
                            </Grid>
                            <Grid item sm={2}></Grid>
                            <Grid item sm={4} className={classes.panel}>
                                <Paper elevation={4}>
                                <br />
                                <h1>Join Meeting</h1>
                                <p>If you want to join a meeting, enter your username and meeting id (optionally a room code as well) below to get started.</p>
                                <TextField label="Username" placeholder="Username" variant="standard" onChange={($e) => { setUsernameGuest($e.target.value) }} />
                                <br />
                                <br />
                                <TextField label="Meeting ID" placeholder="Meeting ID" variant="standard" onChange={($e) => { setMeetingId($e.target.value) }} />
                                <br />
                                <br />
                                <TextField label="Room Key" placeholder="Leave blank if not having" variant="standard" onChange={($e) => { setRoomKey($e.target.value) }} />
                                <br />
                                <br />
                                <br />
                                <Button variant="contained" color="secondary" disabled={usernameGuest == "" || meetingId == ""} type="button" onClick={() => {
                                    setMessage("Joining.. please wait...");
                                    setLoader(true); joinRoom(usernameGuest, meetingId, roomKey, props.history, setLoader, setMessage, setOpen)
                                }}>{roomKey == "" ? "REQUEST" : "JOIN"}</Button>
                                <br />
                                <br />
                                <br />
                                </Paper>
                            </Grid>
                            <Grid item sm={1}></Grid>
                        </Grid>
                    </Box>
                </>
                }
            </Route>
            <Route exact path="/meeting" render={(propas) => <Meeting {...propas} meetingData={credentials} />} />
        </Switch>

        <Dialog open={loader} aria-labelledby="alert-dialog-title2" aria-describedby="alert-dialog-description2">
            <DialogTitle id="alert-dialog-title2">Hold On!</DialogTitle>
            <DialogContent>
                <Typography>{message}</Typography>
                <LinearProgress />
            </DialogContent>
        </Dialog>
        <Dialog open={open} onClose={() => { setOpen(false) }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Request Timed Out!!!</DialogTitle>
            <DialogContent>
                <Typography>Seems like you were not allowed. Try requesting again or ask the host for the Room Key.</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setOpen(false) }} color="primary" autoFocus>Ok</Button>
            </DialogActions>
        </Dialog>
    </>
    );
}

export default Welcome;