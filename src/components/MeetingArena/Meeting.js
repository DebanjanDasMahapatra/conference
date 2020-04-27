import React from 'react';
import "./Meeting.css";

const Meeting = (props) => {
    console.log("masakkali ",props);
    return <>
        <h1>Meeting in Progress...{props.name}</h1>
        <div className="chatbox"></div>
    </>;
}

export default Meeting;