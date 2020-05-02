import React from 'react';
import axios from "axios";
import "./Meeting.css";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import PeopleIcon from '@material-ui/icons/People';
import MicIcon from '@material-ui/icons/Mic';
import SmsIcon from '@material-ui/icons/Sms';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import NavigationIcon from '@material-ui/icons/Navigation';
import Drawer from '@material-ui/core/Drawer';
import ChatArea from './chatArea/ChatArea';
import Participant from './Participant/Participant';
import { Config } from '../../config';
import PT from "../../participants";
import NotificationSystem from "react-notification-system";

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
    const classes = useStyles();
    const [meetingId, setMeetingId] = React.useState("");
    const [roomKey, setRoomKey] = React.useState("");
    const [isHost, setIsHost] = React.useState(false);
    const notificationSystem = React.createRef();

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

    const notify = (message) => {
        notificationSystem.current.addNotification({
            message,
            level: 'warning',
            callback: (v) => {
                console.log('Notification button clicked!',v);
            }
        });
    };

    React.useEffect(() => {
        let init = async () => {
            const {creds, isHost, status, socket} = props.meetingData;
            if(status) {
                hostSocket = socket;
                setMeetingId(creds.meetingId);
                try {
                    let resp = await axios.get(Config.apiUrl+'roomGuests?'+`roomId=${creds.roomId}`);
                    PT.people = resp.data.status == 1 ? resp.data.roomGuests : [];
                } catch(err) {
                    console.error(err);
                }

                if(isHost) {
                    setIsHost(true);
                    setRoomKey(creds.roomKey);
                    hostSocket.on('guest-request', greq => {
                        participantToggle(window.confirm("Partipant Name: "+greq.guestName+" is asking permission to enter the meeting. Allow?"),
                        greq,creds.meetingId);
                        notify("Partipant Name: "+greq.guestName);
                        console.log(greq);
                    })
                }
            }
        }
        init();
    },[]);

    return <>
    <div className="meeting-area">
        <div className={clsx((chatOpen||participantsOpen) && classes.mainShrink)}>
            <h2 className={!isHost ? "" : "d-none"}>Meeting in Progress... ID: {meetingId}</h2>
            <h2 className={isHost ? "" : "d-none"}>Meeting in Progress... ID: {meetingId}, Room Key: {roomKey}</h2>
            
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
            <ChatArea />
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
            <Participant />
        </Drawer>
      </div>
      <NotificationSystem ref={notificationSystem} />
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
        
        {/* <div className="chatbox"></div> */}
    </>;
}

export default Meeting;