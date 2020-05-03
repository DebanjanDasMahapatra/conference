import React from 'react';
import {
    BrowserRouter as Router,
    Route
  } from "react-router-dom";
import "./Welcome.css";
import io from "socket.io-client";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button, Paper } from '@material-ui/core';
import Meeting from '../MeetingArena/Meeting';
import { Config } from '../../config';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, LinearProgress } from '@material-ui/core';

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
      }
}));

let hostSocket, participantSocket, INTERVAL;

const createSocket = (roomId,guestObj,meetingId,history,setLoader) => {
    participantSocket = io(Config.apiUrl+roomId,{query:{
        roomId: roomId,
        userId: guestObj.guestId
    }});
    console.log('Socket...',participantSocket);
    participantSocket.on("authenticate", auth => {
        console.log(auth);
        if(auth.status) {
            credentials.creds = {
                roomId, guestObj, meetingId
            };
            credentials.isHost = false;
            credentials.status = true;
            credentials.socket = participantSocket;
            credentials.parts = auth.guests;
            setLoader(false);
            history.push('/meeting');
        }
    });
}

let credentials = {};

const pingServer = (creds,history,setLoader,setMessage,setAlert) => {
    let count = 0;
    INTERVAL = setInterval(async() => {
        try {
            let resp = await axios.get(Config.apiUrl+'checkReqStatus?'+
                `guestId=${creds.guestObj.guestId}&meetingId=${creds.meetingId}`);
            console.log(resp.data)
            if(resp.data.status) {
                clearInterval(INTERVAL);
                setMessage("Starting meeting...");
                createSocket(resp.data.roomId,resp.data.guestObj,creds.meetingId,history,setLoader);
            }
            else if(count < 5)
                count++;
            else {
                clearInterval(INTERVAL);
                setLoader(false);
                setAlert(true);
            }
        } catch(err) {
            console.error(err);
        }
    },4000);
}

const createRoom = async (username,history,setLoader) => {
    try {
        let resp = await axios.post(Config.apiUrl+'createRoom',{
            username
        });
        if(resp.data.status) {
            hostSocket = io(Config.apiUrl+resp.data.data.roomId,{query:{
                roomId: resp.data.data.roomId,
                userId: resp.data.data.host.hostId
            }});
            console.log('Socket...',hostSocket);
            hostSocket.on("authenticate", auth => {
                console.log(auth);
                if(auth.status) {
                    credentials.creds = resp.data.data;
                    credentials.isHost = true;
                    credentials.status = true;
                    credentials.socket = hostSocket;
                    credentials.parts = auth.guests;
                    setLoader(false);
                    history.push('/meeting');
                }
            });
        } else {
            console.log('Error in response',resp.data);
        }
    } catch (err) {
        console.log('Error in axios',err);
    }
}

const joinRoom = async (username,mid,rk,history,setLoader,setMessage,setAlert) => {
    try {
        let resp = await axios.post(Config.apiUrl+'joinRoom',{
            username,
            meetingId: mid,
            roomKey: rk == "" ? null : rk
        });
        if(resp.data.status)
            createSocket(resp.data.data.roomId,resp.data.data.guestObj,mid,history,setLoader);
        else {
            setMessage("Wait till host admits you...");
            pingServer(resp.data.data,history,setLoader,setMessage,setAlert);
        }
    } catch (err) {
        console.log('Error in axios',err);
    }
}

const Welcome = (props) => {
    const classes = useStyles();
    const [loader, setLoader] = React.useState(false);
    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState("");
    const [uname, setUname] = React.useState("");
    const [mid, setMid] = React.useState("");
    const [rk, setRk] = React.useState("");

    return(<> 
        <Route exact path="/">
        <div className={"block" + (!loader ? "" : " d-none")}>
            <Paper elevation={4}>
                <br />
            <h1>New Meeting</h1>
            <p id="mid"></p>
            <TextField label="Username" placeholder="Username" variant="outlined" onChange={($e)=>{setUname($e.target.value)}} />
            <br />
            <br />
            <Button variant="contained" color="primary" className={!loader ? "" : "d-none"} type="button" onClick={() => {
                if(uname !== "") {
                    setMessage("Starting meeting..."); 
                    setLoader(true); createRoom(uname,props.history, setLoader)
                }
            }}>CREATE</Button>
            <br />
            <br />
            </Paper>
        </div>
        <div className={"block" + (!loader ? "" : " d-none")}>
            <Paper elevation={4}>
                <br />
            <h1>Join Meeting</h1>
            <TextField label="Username" placeholder="Username" variant="outlined" onChange={($e)=>{setUname($e.target.value)}} />
            <br />
            <br />
            <TextField label="Meeting ID" placeholder="Meeting ID" variant="outlined" onChange={($e)=>{setMid($e.target.value)}} />
            <br />
            <br />
            <TextField label="Room Key" placeholder="Leave blank if not having" variant="outlined" onChange={($e)=>{setRk($e.target.value)}} />
            <br />
            <br />
            <Button variant="contained" color="secondary" className={!loader ? "" : "d-none"} type="button" onClick={() => {
                if(uname !== "" && mid !== "") {
                    setMessage("Joining.. please wait...");
                    setLoader(true); joinRoom(uname,mid,rk,props.history, setLoader, setMessage, setOpen)
                }
            }}>{rk == "" ? "REQUEST" : "JOIN"}</Button>
            <br />
            <br />
            </Paper>
        </div>
        <Dialog
            open={loader}
            aria-labelledby="alert-dialog-title2"
            aria-describedby="alert-dialog-description2"
        >
            <DialogTitle id="alert-dialog-title2">Hold On!</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description2">
            <h1>{message}</h1>
            <LinearProgress />
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            </DialogActions>
        </Dialog>
        <Dialog
            open={open}
            onClose={() => {setOpen(false)}}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">Request Timed Out!!!</DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                Seems like you were not allowed. Try requesting again or ask the host for the Room Key.
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={() => {setOpen(false)}} color="primary" autoFocus>
                Ok
            </Button>
            </DialogActions>
        </Dialog>
        </Route>
    <Route
    exact
    path="/meeting"
    render={(propas)=><Meeting {...propas} meetingData={credentials}/>}
    />
    </>
    );
}

export default Welcome;