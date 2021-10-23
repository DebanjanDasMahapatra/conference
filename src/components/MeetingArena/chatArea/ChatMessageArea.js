import React from 'react';
import { makeStyles, Paper } from '@material-ui/core';
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
	// let messages = [{
	// 	"type": 1,
	// 	"name": "cat",
	// 	"message": "Hey there i'm alasddasdive, catch me!",
	// 	"timestamp": "10:30 pm",
	// 	"userId": "122"
	// }, {
	// 	"type": 0,
	// 	"name": "cat",
	// 	"message": "Hello! Good Morning!",
	// 	"timestamp": "10:30 Am",
	// 	"userId": "123"
	// }, {
	// 	"type": 1,
	// 	"name": "dog",
	// 	"message": "Hey there i'm alive, catch me!",
	// 	"timestamp": "10:30 pm",
	// 	"userId": "124"
	// }];
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
			{chats.unreadMessages.length > 0 && generateUnreadChatBox(<ChatBubble />)}
		</Paper>
	);
}

export default ChatMessageArea;