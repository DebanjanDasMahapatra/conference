import React from 'react';
import { Divider, makeStyles, Paper } from '@material-ui/core';
import ChatBubble from './ChatBubble';

const useStyles = makeStyles((theme) => ({
	chatBodyAreaIn: {
		minHeight: '100%',
		overflowY: 'auto',
		padding: 10
	}
}));

const ChatMessageArea = (data) => {

	const { chats, ownId } = data;
	const classes = useStyles();
	
	const generateChatBox = (element) => {
		return chats.messages.map((msg1) =>
			React.cloneElement(element, {
				key: new Date(msg1.time).getTime()+"_"+msg1.sender,
				msg: msg1,
				ownId
			}),
		);
	}
	
	const generateUnreadChatBox = (element) => {
		return chats.unreadMessages.map((msg1) =>
			React.cloneElement(element, {
				key: new Date(msg1.time).getTime()+"_"+msg1.sender,
				msg: msg1,
				ownId
			}),
		);
	}

	return (
		<Paper elevation={2} className={classes.chatBodyAreaIn}>
			{generateChatBox(<ChatBubble />)}
			{/* <Divider>Unread Messages</Divider> */}
			{chats.unreadMessages.length > 0 && <>
			{generateUnreadChatBox(<ChatBubble />)}</>}
		</Paper>
	);
}

export default ChatMessageArea;