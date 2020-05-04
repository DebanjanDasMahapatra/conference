import React from 'react';
import axios from "axios";
import "./Meeting.css";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import PeopleIcon from '@material-ui/icons/People';
import MicIcon from '@material-ui/icons/Mic';
import SmsIcon from '@material-ui/icons/Sms';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import VideocamIcon from '@material-ui/icons/Videocam';
import Info from '@material-ui/icons/Info';
import ChatArea from './chatArea/ChatArea';
import Participant from './Participant/Participant';
import NotificationSystem from "react-notification-system";
import { Button, IconButton, Drawer, Fab } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';

const colors = {
    'dark-grey':'#413535'
}
const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
    
    mic: {
        marginLeft: theme.spacing(-18),
        position: 'fixed',
        bottom: theme.spacing(2),
        backgroundColor:colors["dark-grey"],
        
    },
    cam: {
        marginLeft: theme.spacing(-12),
        position: 'fixed',
        bottom: theme.spacing(2),
        backgroundColor:colors["dark-grey"],
    },
    invite: {
        marginLeft: theme.spacing(-6),
        position: 'fixed',
        bottom: theme.spacing(2),
        backgroundColor:colors["dark-grey"]
    },
    participants: {
        // marginLeft: theme.spacing(0),
        position: 'fixed',
        bottom: theme.spacing(2),
        backgroundColor:colors["dark-grey"]
    },
    chat: {
        marginLeft: theme.spacing(22),
        position: 'fixed',
        bottom: theme.spacing(2),
        backgroundColor:colors["dark-grey"]
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    mainShrink:{
        width:windowWidth-drawerWidth,
        transition:'max-width 0.5s'
    },
    drawerPaper: {
        width: drawerWidth,
    },
}));

let hostSocket;

const participantToggle = (value,guestObj,meetingId) => {
    hostSocket.emit('guest-request-response', { 
        status: value,
        guestObj,
        meetingId
    });
    
}

const Meeting = (props) => {
    const {creds, isHost, status, socket, parts} = props.meetingData;
    const classes = useStyles();

    const [meetingId, setMeetingId] = React.useState("");
    const [roomKey, setRoomKey] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [participants, setParticipants] = React.useState(parts||[]);
    const notificationSystem = React.useRef();    
    const [chatOpen, setChatOpen] = React.useState(false);
    const [participantsOpen, setParticipantsOpen] = React.useState(false);
    
    const handleChatMenuClick = ()=>{
        if(chatOpen){
            setChatOpen(false);
        }else{
            setParticipantsOpen(false);
            setChatOpen(true);
        }
    }
    const handleParticipantsMenuClick = ()=>{
        if(participantsOpen){
            setParticipantsOpen(false);
        }else{
            setChatOpen(false);
            setParticipantsOpen(true);
        }
    }

    const notify = (pname,greq,meetingId) => {
        notificationSystem.current.addNotification({
            title: 'May I Come in?',
            message: `Allow ${pname} to join?`,
            autoDismiss: 15,
            position: 'bl',
            level: 'warning',
            children: (
                <>
                    <Button color="primary" onClick={() => {
                        participantToggle(true,greq,meetingId);
                    }}>Allow</Button>
                    <Button color="secondary" onClick={() => {
                        participantToggle(false,greq,meetingId);
                    }}>Deny</Button>
                </>
            )
        });
    };
    React.useEffect(() => {
        if(status) {
            hostSocket = socket;
            hostSocket.on('new-user-added', nua => {
                console.log(nua,"CHECK2",participants);
                let newPart = {
                    guestId: nua.userId,
                    guestName: nua.name,
                    isHost: false
                };
                setParticipants([...participants,newPart]);
            });
        }
    },[participants]);
    React.useEffect(() => {
        if(status) {
            setMeetingId(creds.meetingId);
            if(isHost) {
                setRoomKey(creds.roomKey);
                hostSocket.on('guest-request', greq => {
                    notify(greq.guestName,greq,creds.meetingId);
                    console.log(greq);
                })
            }
        }
    },[]);

    return <>
    <div className="meeting-area">
        <div className={clsx((chatOpen||participantsOpen) && classes.mainShrink)} className="info-meeting">
            <IconButton onClick={() => {setOpen(true)}}>
                <Info />
            </IconButton>
            <Dialog
                open={open}
                onClose={() => {setOpen(false)}}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Meeting Details</DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Meeting Title<br />Meeting ID: <b>{meetingId}</b><br />
                    <span className={isHost ? "" : "d-none"}>Room Key: <b>{roomKey}</b></span>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={() => {setOpen(false)}} color="primary" autoFocus>
                    Ok
                </Button>
                </DialogActions>
            </Dialog>
        </div>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={chatOpen}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <ChatArea participants={participants} socket={socket} />
        </Drawer>
        <Drawer
            className={classes.drawer}
            variant="persistent"
            anchor="right"
            open={participantsOpen}
            classes={{
            paper: classes.drawerPaper,
            }}
        >
            <Participant participants={participants} socket={socket}/>
        </Drawer>
        </div>
        <NotificationSystem  ref={notificationSystem} />
        <div className="action-menu">
            <Fab size="small" color="primary"  aria-label="add" className={classes.mic}>
                <MicIcon />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.cam}>
                <VideocamIcon />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.invite}>
                <PersonAddIcon />
            </Fab>
            <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                className={classes.participants}
                onClick={handleParticipantsMenuClick}
                >
                <PeopleIcon className={classes.extendedIcon} />
                Participants
            </Fab>
            <Fab
                variant="extended"
                size="medium"
                color="primary"
                aria-label="add"
                className={classes.chat}
                onClick={handleChatMenuClick}
                >
                <SmsIcon className={classes.extendedIcon} />
                Chat
            </Fab>
        </div>
    </>;
}

export default Meeting;