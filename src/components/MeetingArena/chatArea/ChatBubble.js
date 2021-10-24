
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './chatBubble.css';

const ChatBubble = props => {
    const { msg, ownId } = props; //1=sender and 0 receiver

    return <div className={`chat-message ${msg.isOwn ? 'self' : 'others'}`}>
        <p className="sender-name">{msg.senderName}</p>
        <div>
            <p>{msg.message}</p>
            <span>{msg.time}</span>
        </div>
    </div>
}


export default ChatBubble;