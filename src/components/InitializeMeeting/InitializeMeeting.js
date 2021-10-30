import React from "react";
import { connect } from 'react-redux';
import { CONFIGS } from "../../config";
import Meeting from "../MeetingArena/Meeting";
import { SET_SOCKET, UPDATE_MEETING_INFO, ADD_PARTICIPANT_INFO } from "../../store/actionType";
import io from "socket.io-client";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper, LinearProgress, Grid, Typography, Backdrop, CircularProgress } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.appBar + 1,
      color: '#fff',
      position: 'fixed'
    },
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
    },
    dialog: {
        padding: theme.spacing(6)
    },
    centerVertical: {
        position: "absolute",
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    alignRight: {
        textAlign: 'right'
    }
}));

const InitializeMeeting = props => {

    const classes = useStyles();
    const { socket, meetingInfo, participants, setSocket, updateMeetingInfo, addParticipants, setDisplayAppBar } = props;
    const [loader, setLoader] = React.useState(true);
    const [isMeetingValid, setMeetingValid] = React.useState(false);
    const [isHost, setHost] = React.useState(false);
    const [username, setUsername] = React.useState("");
    const [roomKey, setRoomKey] = React.useState("");
    const [roomId, setRoomId] = React.useState("");
    const [message, setMessage] = React.useState("Initializing, Please Wait...");
    const [errorMessage, setErrorMessage] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [isErrorAlert, setErrorAlert] = React.useState(false);
    const [userId, setUserId] = React.useState(null);
    const [isConnected, setConnected] = React.useState(true);

    React.useEffect(() => {
        (async () => {
            const { meetingId } = props.match.params;
            const uId = localStorage.getItem(meetingId);
            updateMeetingInfo({ meetingId });
            try {
                let resp = await CONFIGS.API.get(`/meetings/getUserInfo?userId=${uId}&meetingId=${meetingId}`);
                if (resp.data.status) {
                    let userInfo = resp.data.userInfo;
                    setHost(userInfo.isHost);
                    if (uId) {
                        setUsername(userInfo.username);
                        setRoomId(userInfo.roomId);
                        setRoomKey(userInfo.roomKey);
                        setUserId(userInfo.userId);
                    } else {
                        setOpen(true);
                        setLoader(false);
                    }
                } else {
                    setErrorMessage("Some Problem Occurred:\n\n" + resp.data.msg);
                    setErrorAlert(true);
                }
            } catch (err) {
                setErrorMessage("Internal Server Error" + err.toString());
                setErrorAlert(true);
            }
        })();
    }, []);

    React.useEffect(() => {
        if (userId && roomId && username && !socket) {
            createSocket(roomId, userId, username);
        }
    }, [userId]);

    const createSocket = (roomId, userId, username) => {
        let time = Date.now();
        let newSocket = io(`${process.env.REACT_APP_API_URL}/${roomId}`, {
            query: { roomId, userId, time }
        });
        newSocket.on('connect', () => {
            setConnected(true);
        })
        newSocket.on('disconnect', reason => {
            setConnected(false);
        });
        newSocket.on("authenticate", auth => {
            if (auth.status) {
                newSocket["_ownId"] = userId;
                newSocket["_ownName"] = username;
                newSocket["_isHost"] = isHost;
                setLoader(false);
                addParticipants([{
                    guestId: "everyone",
                    guestName: "EVERYONE",
                    isHost: false
                }, ...auth.guests]);
                setSocket(newSocket);
                updateMeetingInfo({
                    roomId, roomKey, userId, username, isHost, status: true
                });
                setDisplayAppBar(false);
                setTimeout(() => {
                    setMeetingValid(() => { 
                        return true;
                    });
                })
            }
        });
    }

    const pingServer = (guestObj) => {
        let count = 0;
        let INTERVAL = setInterval(async () => {
            try {
                let resp = await CONFIGS.API.get(`/meetings/checkReqStatus?guestId=${guestObj.guestId}&meetingId=${meetingInfo.meetingId}`);
                if (resp.data.status) {
                    clearInterval(INTERVAL);
                    setRoomId(resp.data.roomId);
                    setHost(false);
                    if(CONFIGS.isSignedIn())
                        setUsername(CONFIGS.getUsername());
                    const token = localStorage.getItem('token');
                    localStorage.clear();
                    localStorage.setItem('token', token);
                    localStorage.setItem(meetingInfo.meetingId, resp.data.guestObj.guestId);
                    setUserId(resp.data.guestObj.guestId);
                    setMessage("Joining meeting...");
                }
                else if (count < 5)
                    count++;
                else {
                    clearInterval(INTERVAL);
                    setLoader(false);
                    setErrorMessage("Seems like you were not allowed. Try requesting again or ask the host for the Room Key.");
                    setErrorAlert(true);
                }
            } catch (err) {
                console.error(err);
            }
        }, 4000);
    }

    const joinRoom = async () => {
        try {
            let resp = await CONFIGS.API.post('/meetings/joinRoom', {
                username,
                meetingId: meetingInfo.meetingId,
                roomKey: roomKey == "" ? null : roomKey
            });
            if (resp.data.status) {
                setRoomId(resp.data.data.roomId);
                setHost(false);
                if(CONFIGS.isSignedIn())
                    setUsername(CONFIGS.getUsername());
                const token = localStorage.getItem('token');
                localStorage.clear();
                localStorage.setItem('token', token);
                localStorage.setItem(meetingInfo.meetingId, resp.data.data.guestObj.guestId);
                setUserId(resp.data.data.guestObj.guestId);
            } else {
                setMessage("Please wait for the host to let you in...");
                pingServer(resp.data.data.guestObj);
            }
        } catch (err) {
            console.log('Error in axios', err);
        }
    }

    return <>
        <Backdrop className={classes.backdrop} open={!isConnected}>
            <CircularProgress color="secondary" />
            <Typography>Disconnected... We are tying to connect you back...</Typography>
        </Backdrop>
        {
            !isMeetingValid && loader && <>
                <br /><br />
                <Grid container className={classes.centerVertical}>
                    <Grid item sm={3}></Grid>
                    <Grid item sm={6}>
                        <Paper elevation={10} className={classes.panel}>
                            <br />
                            <Typography variant="h2" color="error">Hold On!</Typography>
                            <br /><br />
                            <Typography>{message}</Typography>
                            <br /><br />
                            <LinearProgress />
                            <br />
                        </Paper>
                    </Grid>
                    <Grid item sm={3}></Grid>
                </Grid>
            </>
        }
        {
            isMeetingValid && !loader && <Meeting />
        }
        <Dialog open={open && !userId} aria-labelledby="alert-dialog-title2" aria-describedby="alert-dialog-description2">
            <DialogContent className={classes.dialog}>
                <br />
                <Typography variant="h4" color="error">Join meeting</Typography>
                <br />
                {CONFIGS.isSignedIn() && <><Typography>If you have a Room Key, please enter it below. Else, you can skip.</Typography>
                <br /></>}
                {!CONFIGS.isSignedIn() && <><Typography>Enter your Name and optionally a Room Key below to Request / Join.</Typography>
                <br />
                <TextField label="Name" placeholder="Name" variant="standard" onChange={($e) => { setUsername($e.target.value) }} />
                <br />
                <br /></>}
                <TextField label="Room Key" placeholder="Leave blank if not having" variant="standard" onChange={($e) => { setRoomKey($e.target.value) }} />
                <br />
                <br />
                <div className={classes.alignRight}>
                <Button variant="contained" color="secondary" disabled={!CONFIGS.isSignedIn() && username == ""} type="button" onClick={() => {
                    setLoader(true);
                    setOpen(false);
                    joinRoom();
                }}>{roomKey == "" ? "REQUEST" : "JOIN"}</Button></div>
            </DialogContent>
        </Dialog>
        <Dialog open={isErrorAlert} onClose={() => { setErrorAlert(false) }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">Request Timed Out!!!</DialogTitle>
            <DialogContent>
                <Typography>{errorMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => { setErrorAlert(false) }} color="primary" autoFocus>Ok</Button>
            </DialogActions>
        </Dialog>
    </>

}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        meetingInfo: state.meetingInfo,
        participants: state.participants
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSocket: (socket) => {
            dispatch({
                type: SET_SOCKET,
                socket
            });
        },
        updateMeetingInfo: (meetingInfo) => {
            dispatch({
                type: UPDATE_MEETING_INFO,
                meetingInfo
            });
        },
        addParticipants: (participants) => {
            dispatch({
                type: ADD_PARTICIPANT_INFO,
                participants
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(InitializeMeeting);