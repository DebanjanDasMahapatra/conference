
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './chatBubble.css';

const ChatBubble = props => {
    const { msg, ownId } = props; //1=sender and 0 receiver

    return <div className={`chat-box ${msg.isOwn ? 'self' : 'others'}`}>
        <small className="sender-name">{msg.senderName}</small>
        <p className="chat-message">{msg.message}</p>
        <small className="time-stamp">{msg.time}</small>
    </div>
}


export default ChatBubble;