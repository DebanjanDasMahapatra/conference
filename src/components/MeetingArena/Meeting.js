import React from 'react';
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
const colors = {
    'dark-grey':'#413535'
}
const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const drawerWidth = 240;
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

const Meeting = (props) => {
    const classes = useStyles();
    console.log("masakkali ",props);

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
    return <>
    <div className="meeting-area">
        <div className={clsx((chatOpen||participantsOpen) && classes.mainShrink)}>
            <h1>Meeting in Progress...{props.name}</h1>
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
            Chat
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
            Participants
        </Drawer>
      </div>
    
        
        {/* <div className="chatbox"></div> */}
    </>;
}

export default Meeting;