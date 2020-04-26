import React, { useState, useEffect } from 'react';
import "./Welcome.css";
import io from "socket.io-client";
import axios from "axios";

let hostSocket;

let uname = "", mid = "", rk = "", meetingId = "", guestObj = {};

const changeUserName = (v) => {
    uname = v;
}
const changeMid = (v) => {
    mid = v;
}
const changeRk = (v) => {
    rk = v;
}

const toggleViews = (v) => {
    document.getElementById('allow').hidden = v;
    document.getElementById('deny').hidden = v;
    document.getElementById('pinfo').hidden = v;
}

const participantAllow = () => {
    hostSocket.emit('guest-request-response', { 
        status: true,
        guestObj,
        meetingId
    });
    toggleViews(true);
}

const participantDeny = () => {
    hostSocket.emit('guest-request-response', { 
        status: false,
        guestObj,
        meetingId
    });
    toggleViews(true);
}

const createRoom = async () => {
    try {
        let data = await axios.post('http://localhost:3000/createRoom',{
            username: uname
        });
        if(data.data.status) {
            hostSocket = io('http://localhost:3000/'+data.data.data.roomId,{query:{
                roomId: data.data.data.roomId,
                userId: data.data.data.host.hostId
            }});
            console.log('Socket...',hostSocket,"\n\n",data.data);
            document.getElementById('mid').innerHTML = "Meeting ID: "+data.data.data.meetingId+"<br>nRoom Key: "+data.data.data.roomKey;
            hostSocket.on("authenticate", auth => {
                console.log(auth);
            });
            hostSocket.on("guest-request", greq => {
                document.getElementById('pinfo').innerHTML = "Partipant Name: "+greq.guestName+" is asking permission to enter the meeting. Click Allow or Deny.";
                console.log(greq);
                guestObj = greq;
                meetingId = data.data.data.meetingId;
                toggleViews(false);
            });
            hostSocket.on("guest-joined", data => {
                console.log(data);
            });
        } else {
            console.log('Error in response',data.data);
        }
    } catch (err) {
        console.log('Error in axios',err);
    }
    alert('Hiii');
}

const joinRoom = async () => {
    try {
        let data = await axios.post('http://localhost:3000/joinRoom',{
            username: uname,
            meetingId: mid,
            roomKey: rk == "" ? null : rk
        });
        if(data.data.status) {
            const socket2 = io('http://localhost:3000/'+data.data.data.roomId,{query:{
                roomId: data.data.data.roomId,
                userId: data.data.data.guestObj.guestId
            }});
            console.log('Socket...',socket2,"\n\n",data.data);
            socket2.on("authenticate", data => {
                console.log(data);
            });
            socket2.on("guest-permitted", data => {
                console.log(data);
            });
        } else {
            console.log('Error in response',data.data);
        }
    } catch (err) {
        console.log('Error in axios',err);
    }
    alert('Hiii');
}

const Welcome = () => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        console.warn("ALERT")
    }, []);

    return <React.Fragment>
        <div className="block">
            <h3>New Meeting</h3>
            <p id="mid"></p>
            <input type="text" placeholder="Your Username" onChange={($e)=>{changeUserName($e.target.value)}} />
            <br />
            <button type="button" onClick={createRoom}>Create</button>
            <p id="pinfo" hidden></p>
            <button type="button" onClick={participantAllow} id="allow" hidden>Allow</button>
            <button type="button" onClick={participantDeny} id="deny" hidden>Deny</button>
        </div>
        <div className="block">
            <h3>Join Meeting</h3>
            <input type="text" placeholder="Username" onChange={($e)=>{changeUserName($e.target.value)}} />
            <br />
            <input type="text" placeholder="Meeting ID" onChange={($e)=>{changeMid($e.target.value)}} />
            <br />
            <input type="password" placeholder="Room Key" onChange={($e)=>{changeRk($e.target.value)}} />
            <br />
            <button type="button" onClick={joinRoom}>Join</button>
        </div>
    </React.Fragment>;
}

export default Welcome;