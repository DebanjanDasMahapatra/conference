import React, { useRef } from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import InsertEmoticonIcon from "@material-ui/icons/InsertEmoticon";
import SendIcon from '@material-ui/icons/Send';
import Picker from 'emoji-picker-react';
import Avatar from '@material-ui/core/Avatar';
import MenuIcon from '@material-ui/icons/Menu'
import Drawer from '@material-ui/core/Drawer';
import UserListDrawer from './UserListDrawer';
import ChatBubble from './ChatBubble';
import ChatMessageArea from './ChatMessageArea';
import { Badge, TextField } from '@material-ui/core';
import { connect } from 'react-redux';
import { ADD_PARTICIPANT_INFO, SET_SOCKET, UPDATE_MEETING_INFO } from '../../../store/actionType';


const drawerWidth = 200;
const parentDrawerWidth = 300;
const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const useStyles = makeStyles((theme) => ({
	main: {
		height: '100%',
		position: 'fixed',
		display: 'flex',
		flexFlow: 'column'

	},
	chatBodyArea: {
		flexGrow: 1,
		width: '100%',
		padding: '5px'
	},
	header: {
		top: 0,
		display: 'flex',
		width: 295,
		alignItems: 'center'

	},
	footer: {
		bottom: 0

	},
	root: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 290,
		backgroundColor: "#606060"
	},
	input: {
		marginLeft: theme.spacing(1),
		flex: 1,
	},
	iconButton: {
		padding: 10,
	},
	divider: {
		height: 28,
		margin: 4,
	},
	emojiPanel: {
		width: '290px',
		height: '400px'
	},
	drawerPaper: {
		width: drawerWidth,
		position: 'absolute'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	userListOpened: {
		zIndex: 5,
		height: '100%'
	}
}));

const ChatArea = (props) => {
    const { socket, meetingInfo, participants, setSocket, updateMeetingInfo, addParticipants, setMessagePending, chatOpen } = props;
	
	const userMapRef = React.useRef({});
	const [userMap, updateUserMap] = React.useState({});

	const [emojiOpen, setEmojiOpen] = React.useState(false);
	const [userListOpen, setUserListOpen] = React.useState(false);
	const [selectedUser, setSelectedUser] = React.useState("everyone");
	const selectedUserRef = React.useRef(selectedUser);
	const [message, setMessage] = React.useState("");

	const participantMap = React.useMemo(() => {
		let map = {};
		participants.forEach(part => map[part.guestId] = part.guestName);
		return map;
	}, [participants]);

	React.useEffect(() => {
		userMapRef.current = userMap;
	}, [userMap]);

	React.useEffect(() => {
		selectedUserRef.current = selectedUser;
	}, [selectedUser]);

	React.useEffect(() => {
		let userMap1 = { ...userMap };
		let newParticipantIds = participants.filter(p => {
			return !userMap.hasOwnProperty(p.guestId);
		})
		newParticipantIds.forEach(parti => {
			userMap1[parti.guestId] = {
				'messages': [],
				'unreadMessages': [],
				'color': "INVALID",
				'lastTypedMessage': "Hello",
				'displayPic': "",
				'name': parti.guestName,
				'isHost': parti.isHost
			}
		})
		updateUserMap({...userMap1});
		console.warn("UPDATED USER MAP", userMap1);
	}, [participants])

	// console.warn("SUNO GAUR SE",participants);

	const handleUserListOpenClick = () => {
		setUserListOpen(!userListOpen);
	}
	const areEqual = (prevProps, nextProps) => true;
	const classes = useStyles();
	const addEmoji = (e, emojiObj) => {
		setEmojiOpen(false);
		setMessage(message + emojiObj.emoji);
	};
	const handleEmojiButtonClick = () => {
		setEmojiOpen(!emojiOpen);
	}
	const handleInputChange = (e) => {
		e.persist();
		console.warn(e)
		if (!e.shiftKey && e.code == 'Enter')
			sendMessage();
		else if (e.shiftKey && e.code == 'Enter')
			setMessage(e.target.value + "\n");
		else
			setMessage(e.target.value);
	}
	const EmojiPicker = React.memo(props => {
		return (<Picker onEmojiClick={addEmoji} className={classes.emojiPanel} />);
	}, areEqual);

	const handleUserChange = (userId) => {
		console.warn("USER CHANGE", selectedUser, userId)
		let userMapNew = { ...userMap };
		setMessage(userMapNew[userId].lastTypedMessage);
		userMapNew[userId].lastTypedMessage = "";
		setSelectedUser(userId);
		userMapNew[userId].messages = [...userMapNew[userId].messages, ...userMapNew[userId].unreadMessages];
		userMapNew[userId].unreadMessages = [];
		updateUserMap(userMapNew);
	}

	const saveLastTypedMessage = (oldUserId) => {
		let userMapNew = { ...userMap };
		userMapNew[oldUserId].lastTypedMessage = message;
		updateUserMap(userMapNew);
	}

	console.warn("USER SELECTED", selectedUser)
	const handleIncomingMessage = (msgObj) => {
		if(!chatOpen.current) {
			console.log("INCOMING ANIMATION")
			setMessagePending(true);
		}
		let userMapNew = { ...userMapRef.current };
		let msgBoxId = msgObj.from;
		if (msgObj.to == 'everyone') {
			msgBoxId = msgObj.to;
		}
		console.warn("USER INCOMING MESSAGE", selectedUserRef.current)
		if (selectedUserRef.current == msgBoxId)
			userMapNew[msgBoxId].messages = [...userMapNew[msgBoxId].messages, {
				'time': msgObj.time,
				'sender': msgObj.from,
				'message': msgObj.msg,
				'type': 1,
				'isOwn': msgObj.from == meetingInfo.userId,
				'senderName': participantMap[msgObj.from]
			}];
		else
			userMapNew[msgBoxId].unreadMessages = [...userMapNew[msgBoxId].unreadMessages, {
				'time': msgObj.time,
				'sender': msgObj.from,
				'message': msgObj.msg,
				'type': 1,
				'isOwn': msgObj.from == meetingInfo.userId,
				'senderName': participantMap[msgObj.from]
			}];
		updateUserMap(userMapNew);
	}

	const handleMessageAction = (msgObj) => {
		switch (msgObj.type) {
			case 1:
				delete msgObj['type'];
				handleIncomingMessage(msgObj);
				break;
		}
	}

	const sendMessageToUser = () => {
		console.warn("PERSONAL MESSAGE >>>>");
		socket.emit('personal-message', {
			type: 1,
			from: meetingInfo.userId,
			to: selectedUser,
			msg: message,
			time: new Date().toLocaleString()
		});
		setMessage("");
	}

	const sendMessageToAll = () => {
		console.warn("GROUP MESSAGE >>>>");
		socket.emit('group-message', {
			type: 1,
			from: meetingInfo.userId,
			to: selectedUser,
			msg: message,
			time: new Date().toLocaleString()
		});
		setMessage("");
	}

	const sendMessage = () => {
		if (selectedUser == 'everyone')
			sendMessageToAll()
		else
			sendMessageToUser()
	}

	React.useEffect(() => {
		console.error("USER MAP");
		console.log(userMap);
		socket.on('personal-message-reply', msg => {
			console.warn("PM", msg);
			console.log(userMap);
			handleMessageAction(msg)
		})
		socket.on('group-message-reply', msg => {
			console.warn("GM", msg);
			console.log(userMap);
			if(meetingInfo.userId != msg.from)
				handleMessageAction(msg)
		})
	}, [])

	console.warn("USER MAP GLOBAL", userMap);
	const totalUnreadCount = React.useMemo(() => {
		return Object.keys(userMap).reduce((a, b) => a + userMap[b].unreadMessages.length, 0);
	}, [userMap]);

	return <>
		<div id="userListDrawer" className={clsx(userListOpen && classes.userListOpened)}>
			<UserListDrawer handleUserListOpenClick={handleUserListOpenClick} open={userListOpen} userMap={userMap}
				saveLastTypedMessage={saveLastTypedMessage} ownId={meetingInfo.userId} handleUserChange={handleUserChange} selectedUser={selectedUser} />
		</div>
		<div className={classes.main}>
			<div className={classes.header}>
				<IconButton className={classes.iconButto} aria-label="menu" onClick={handleUserListOpenClick}>
				<Badge badgeContent={totalUnreadCount} color="primary">
                <MenuIcon />
            </Badge>
					</IconButton>
				{userMap[selectedUser] ? <>
					<span style={{ flex: 1 }}>{userMap[selectedUser].name}</span>
					<Avatar alt={userMap[selectedUser].name} src="/static/images/avatar/1.jpg" />
				</> : 'Loading'}
			</div>
			{userMap[selectedUser] ? <>
				<div className={classes.chatBodyArea}>
					<ChatMessageArea chats={userMap[selectedUser]} ownId={meetingInfo.userId} />
				</div>
			</> : <></>}
			<div className={classes.footer}>
				{emojiOpen ? <EmojiPicker /> : null}
				<Paper component="form" className={classes.root}>
					<IconButton className={classes.iconButton} aria-label="menu" onClick={handleEmojiButtonClick}>
						<InsertEmoticonIcon color="secondary" />
					</IconButton>
					<TextField className={classes.input} placeholder="Message" inputProps={{ "aria-label": "" }} onInput={handleInputChange} value={message} multiline={true} />
					<Divider className={classes.divider} orientation="vertical" />
					<IconButton color="secondary" className={classes.iconButton} aria-label="directions" onClick={sendMessage}><SendIcon /></IconButton>
				</Paper>
			</div>
		</div>
	</>
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
        }
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatArea);