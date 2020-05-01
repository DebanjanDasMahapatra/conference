import React, { useState, useEffect } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    useRouteMatch
  } from "react-router-dom";
import "./Welcome.css";
import io from "socket.io-client";
import axios from "axios";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { render } from '@testing-library/react';
import Meeting from '../MeetingArena/Meeting';
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
      }
}));

let hostSocket, participantSocket;

let uname = "", mid = "", rk = "";

const changeUserName = (v) => {
    uname = v;
}
const changeMid = (v) => {
    mid = v;
}
const changeRk = (v) => {
    rk = v;
}

const createSocket = (roomId,guestObj,meetingId,history) => {
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
            history.push('/meeting');
        }
    });
}

let credentials = {};

const pingServer = (creds,history,setLoader) => {
    let count = 0;
    let interval = setInterval(async() => {
        try {
            let resp = await axios.get(Config.apiUrl+'checkReqStatus?'+
                `guestId=${creds.guestObj.guestId}&meetingId=${creds.meetingId}`);
            console.log(resp.data)
            {
                if(resp.data.status) {
                    clearInterval(interval);
                    createSocket(resp.data.roomId,resp.data.guestObj,creds.meetingId,history);
                } else {
                    clearInterval(interval);
                    setLoader(false);
                    alert('You were not allowed!!! Try joining again or ask the host for the room key!!!');
                }
            }
            {
                if(count < 5)
                    count++;
                else {
                    clearInterval(interval);
                    setLoader(false);
                    alert('Request for Joining Timed Out !!! Try joining again or ask the host for the room key!!!');
                }
            }
        } catch(err) {
            console.error(err);
            clearInterval(interval);
        }
    },4000);
}

const createRoom = async (history) => {
    try {
        let resp = await axios.post(Config.apiUrl+'createRoom',{
            username: uname
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

const joinRoom = async (history,setLoader,setMessage) => {
    try {
        let resp = await axios.post(Config.apiUrl+'joinRoom',{
            username: uname,
            meetingId: mid,
            roomKey: rk == "" ? null : rk
        });
        if(resp.data.status)
            createSocket(resp.data.data.roomId,resp.data.data.guestObj,mid,history);
        else {
            setMessage("Wait till host admits you...");
            pingServer(resp.data.data,history,setLoader);
        }
    } catch (err) {
        console.log('Error in axios',err);
    }
}

// let name = "";
// const test = (h) => {
//     name = "Avnish vs Mosquitoes"
//     h.push('/meeting');
// }
// const test2 = (h,r) => {
//     h(!r);
// }

const Welcome = (props) => {
    const classes = useStyles();
    const [loader, setLoader] = useState(false);
    const [message, setMessage] = React.useState("");

    return(<> 
        <Route exact path="/">
        <div className={"block" + (!loader ? "" : " d-none")}>
            <Paper elevation={4}>
                <br />
            <h1>New Meeting</h1>
            <p id="mid"></p>
            <TextField id="outlined-basic" label="Username" placeholder="Username" variant="outlined" onChange={($e)=>{changeUserName($e.target.value)}} />
            <br />
            <br />
            <Button variant="contained" color="primary" className={!loader ? "" : "d-none"} type="button" onClick={() => {
                if(uname !== "") {
                    setMessage("Starting meeting..."); 
                    setLoader(true); createRoom(props.history)
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
            <TextField id="outlined-basic" label="Username" placeholder="Username" variant="outlined" onChange={($e)=>{changeUserName($e.target.value)}} />
            <br />
            <br />
            <TextField id="outlined-basic" label="Meeting ID" placeholder="Meeting ID" variant="outlined" onChange={($e)=>{changeMid($e.target.value)}} />
            <br />
            <br />
            <TextField id="outlined-basic" label="Room Key" placeholder="Leave blank if not having" variant="outlined" onChange={($e)=>{changeRk($e.target.value)}} />
            <br />
            <br />
            <Button variant="contained" color="secondary" className={!loader ? "" : "d-none"} type="button" onClick={() => {
                if(uname !== "" && mid !== "") {
                    setMessage("Joining.. please wait...");
                    setLoader(true); joinRoom(props.history, setLoader, setMessage)
                }
            }}>JOIN</Button>
            <br />
            <br />
            </Paper>
        </div>
        <div className={loader ? "" : "d-none"}>
            <h1>{message}</h1>
        </div>
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