import React from 'react';
import { makeStyles } from '@material-ui/core';
import ChatBubble from './ChatBubble';

const useStyles = makeStyles((theme) => ({
	chatBodyAreaIn: {
		maxHeight: '85vh',
		overflowY: 'auto',
		padding: 5
	}
}));

const ChatMessageArea = (data) => {

	const { chats, ownId } = data;
	const classes = useStyles();
	const chatBoxRef = React.useRef();

	const generateChatBox = (element) => {
		return chats.messages.map((msg1) =>
			React.cloneElement(element, {
				key: new Date(msg1.time).getTime() + "_" + msg1.sender,
				msg: msg1,
				ownId
			}),
		);
	}

	const generateUnreadChatBox = (element) => {
		return chats.unreadMessages.map((msg1) =>
			React.cloneElement(element, {
				key: new Date(msg1.time).getTime() + "_" + msg1.sender,
				msg: msg1,
				ownId
			}),
		);
	}

	React.useEffect(() => {
		if(chatBoxRef)
			chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
	});

	return (
		<div className={classes.chatBodyAreaIn} ref={chatBoxRef}>
			{generateChatBox(<ChatBubble />)}
			{/* <Divider>Unread Messages</Divider> */}
			{chats.unreadMessages.length > 0 && <>
				{generateUnreadChatBox(<ChatBubble />)}</>}
		</div>
	);
}

export default ChatMessageArea;