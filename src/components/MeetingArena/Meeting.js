import React from 'react';
import "./Meeting.css";
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Info from '@material-ui/icons/Info';
import ChatArea from './chatArea/ChatArea';
import Participant from './Participant/Participant';
import NotificationSystem from "react-notification-system";
import { Button, IconButton, Drawer, Fab, Typography } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { connect } from 'react-redux';
import { ADD_PARTICIPANT_INFO, REMOVE_PARTICIPANT_INFO, RESET_ALL_INFO, SET_SOCKET, UPDATE_MEETING_INFO } from '../../store/actionType';
import { CallEnd, Mic, People, Person, Sms, Videocam } from '@material-ui/icons';
import useSocketProofState from '../../utils/socketProofState';

const colors = {
    'dark-grey': '#413535'
}
const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const drawerWidth = 300;
const useStyles = makeStyles((theme) => ({
    mic: {
        backgroundColor: colors["dark-grey"],
    },
    cam: {
        marginLeft: theme.spacing(2),
        backgroundColor: colors["dark-grey"],
    },
    invite: {
        marginLeft: theme.spacing(2),
        backgroundColor: colors["dark-grey"]
    },
    participants: {
        marginLeft: theme.spacing(2),
        backgroundColor: "green"
    },
    chat: {
        marginLeft: theme.spacing(2),
        backgroundColor: "green"
    },
    call: {
        marginLeft: theme.spacing(2),
        backgroundColor: "red"
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    mainShrink: {
        width: windowWidth - drawerWidth,
        transition: 'max-width 0.5s'
    },
    drawerPaper: {
        width: drawerWidth,
    },
    dialogContent: {
        padding: theme.spacing(2, 2, 1, 2)
    },
    dialogFooter: {
        padding: theme.spacing(1, 2, 2, 2)
    }
}));

const Meeting = props => {
    const { socket, meetingInfo, participants, setSocket, updateMeetingInfo, addParticipants, removeParticipant, resetReduxState, history } = props;
    const classes = useStyles();

    const [open, setOpen] = React.useState(false);
    const notificationSystem = React.useRef();
    const [chatOpen, setChatOpen, chatOpenRef] = useSocketProofState(false);
    const [isPendingMessage, setMessagePending] = React.useState(false);
    const [participantsOpen, setParticipantsOpen] = React.useState(false);

    const handleChatMenuClick = () => {
        if (chatOpen) {
            setChatOpen(false);
        } else {
            setParticipantsOpen(false);
            setChatOpen(true);
            setMessagePending(false);
        }
    }
    const handleParticipantsMenuClick = () => {
        if (participantsOpen) {
            setParticipantsOpen(false);
        } else {
            setChatOpen(false);
            setParticipantsOpen(true);
        }
    }

    const participantToggle = (status, guestObj, meetingId) => {
        socket.emit('guest-request-response', {
            status,
            guestObj,
            meetingId
        });
    }

    const notify = (pname, greq) => {
        notificationSystem.current.addNotification({
            title: `${pname.toUpperCase()} is waiting outside the meeting...`,
            message: `Allow ${pname.toUpperCase()} to join?`,
            autoDismiss: 15,
            position: 'bl',
            level: 'info',
            children: (
                <>
                    <Button variant="outlined" color="primary" onClick={() => {
                        participantToggle(true, greq, meetingInfo.meetingId);
                    }}>Allow</Button>
                    <Button variant="outlined" color="secondary" onClick={() => {
                        participantToggle(false, greq, meetingInfo.meetingId);
                    }}>Deny</Button>
                </>
            )
        });
    }

    const leaveMeeting = () => {
        console.warn('Meeting Left');
        window.location.href = '/';
    }

    React.useEffect(() => {
        if (meetingInfo.status) {
            socket.on('new-user-added', user => {
                if (meetingInfo.userId != user.userId) {
                    let newPart = {
                        guestId: user.userId,
                        guestName: user.name,
                        isHost: user.isHost
                    };
                    addParticipants([newPart]);
                    socket.emit('join-personal-room', {
                        ownId: meetingInfo.userId,
                        userId: user.userId
                    });
                }
            });
            socket.on('user-left', user => {
                removeParticipant(user.userId);
            });
        }
    }, []);

    React.useEffect(() => {
        if (meetingInfo.status) {
            if (meetingInfo.isHost) {
                socket.on('guest-request', greq => {
                    notify(greq.guestName, greq);
                    console.log(greq);
                })
            }
        }
    }, [meetingInfo.isHost]);

    return <>
        <div className="meeting-area">
            <div className={clsx((chatOpen || participantsOpen) && classes.mainShrink)} className="info-meeting">
                <IconButton onClick={() => { setOpen(true) }}><Info /></IconButton>
            </div>
            <Drawer className={classes.drawer} variant="persistent" anchor="right" open={chatOpen} classes={{ paper: classes.drawerPaper }}>
                <ChatArea setMessagePending={setMessagePending} chatOpen={chatOpenRef} />
            </Drawer>
            <Drawer className={classes.drawer} variant="persistent" anchor="right" open={participantsOpen} classes={{ paper: classes.drawerPaper }}>
                <Participant />
            </Drawer>
        </div>
        <NotificationSystem ref={notificationSystem} />
        <div className="action-menu">
            <Fab size="small" color="primary" aria-label="add" className={classes.mic}>
                <Mic />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.cam}>
                <Videocam />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.invite}>
                <Person />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.participants} onClick={handleParticipantsMenuClick}>
                <People />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={clsx([classes.chat, isPendingMessage ? "new-message-animation" : ""])} onClick={handleChatMenuClick}>
                <Sms />
            </Fab>
            <Fab size="small" color="primary" aria-label="add" className={classes.call} onClick={leaveMeeting}>
                <CallEnd />
            </Fab>
        </div>
        <Dialog open={open} onClose={() => { setOpen(false) }} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
            <DialogContent>
                <div className={classes.dialogContent}>
                    <Typography variant="h4" color="error">Meeting Title</Typography>
                    <br />
                    <Typography>Participant Name: <code>{meetingInfo.username} {meetingInfo.isHost && <span>(Host)</span>}</code></Typography>
                    <br />
                    <Typography>Participant ID: <code>{meetingInfo.userId}</code></Typography>
                    <br />
                    <Typography>Meeting ID: <code>{meetingInfo.meetingId}</code></Typography>
                    <br />
                    {meetingInfo.isHost && <Typography>Room Key: <code>{meetingInfo.roomKey}</code></Typography>}
                </div>
            </DialogContent>
            <DialogActions className={classes.dialogFooter}>
                <Button onClick={() => setOpen(false)} color="default" variant="outlined">Close</Button>
            </DialogActions>
        </Dialog>
    </>;
}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        meetingInfo: state.meetingInfo,
        participants: state.participants
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSocket: (socket) => {
            dispatch({
                type: SET_SOCKET,
                socket
            });
        },
        updateMeetingInfo: (meetingInfo) => {
            dispatch({
                type: UPDATE_MEETING_INFO,
                meetingInfo
            });
        },
        addParticipants: (participants) => {
            dispatch({
                type: ADD_PARTICIPANT_INFO,
                participants
            });
        },
        removeParticipant: (participantId) => {
            dispatch({
                type: REMOVE_PARTICIPANT_INFO,
                participantId
            });
        },
        resetReduxState: () => {
            dispatch({
                type: RESET_ALL_INFO,
                action: null
            });
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);