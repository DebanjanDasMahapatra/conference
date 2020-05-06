
import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import './chatBubble.css';



const ChatBubble = (props)=>{
    const {msg} = props; //1=sender and 0 receiver

    return (
            <div className={msg.type==1?"bubble sender":"bubble alt receiver"}>
                <div className="txt">
                <p className={msg.type==1?"name":"name alt"}>{msg.name}<span> ~ John</span></p>
                <p className="message">{msg.message}</p>
                <span className="timestamp">{msg.timestamp}</span>
                </div>
                
            </div>

    );



}


export default ChatBubble;