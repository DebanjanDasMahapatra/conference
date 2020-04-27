import React, { useState, useEffect } from 'react';
import "./Welcome.css";
import io from "socket.io-client";
import axios from "axios";
const ENDPOINT = "http://127.0.0.1:4001";

const Welcome = () => {
    const [response, setResponse] = useState("");

    useEffect(() => {
        axios.post('http://localhost:3000/createRoom').then(data => {
            if(data.data.status) {
                const socket = io('http://localhost:3000/'+data.data.data.roomId);
                    console.error('Socket...',socket);
                    socket.on("guest-request", data => {
                        setResponse(data);
                        console.log(data);
                    });
            } else {
                console.log('Error in response',data.data);
            }
        }).catch(err => {
            console.log('Error in axios',err);
        })
    }, []);

    return <React.Fragment>
        <div className="block">
            <h3>New Meeting</h3>
            <input type="text" placeholder="Your Username" />
            <button type="button">Create</button>
        </div>
        <div className="block">
            <h3>Join Meeting</h3>
            <input type="text" placeholder="Meeting ID" />
            <button type="button">Join</button>
        </div>
    </React.Fragment>;
}

export default Welcome;