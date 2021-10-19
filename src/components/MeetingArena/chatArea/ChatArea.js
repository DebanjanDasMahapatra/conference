import React from 'react';
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
import { TextField } from '@material-ui/core';


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
    backgroundColor: "#fafafa",
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
    backgroundColor: "#e0e0e0"
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

const getPersonalRoomId = (to, from) => {
  return to < from ? to + '_' + from : from + '_' + to;
}

let sockett;

const ChatArea = (props) => {
  const { socket, participants } = props;
  const [userMap, updateUserMap] = React.useState({});
  React.useEffect(() => {
    let userMap1 = { ...userMap };
    let newParticipantId = participants.filter(p => {
      return !userMap.hasOwnProperty(p.guestId);
    })
    newParticipantId.forEach(parti => {
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
    updateUserMap(userMap1);
    console.log(" effect ", userMap);
  }, [participants])
  // console.warn("SUNO GAUR SE",participants);
  const [emojiOpen, setEmojiOpen] = React.useState(false);
  const [userListOpen, setUserListOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState("everyone");

  const handleUserListOpenClick = () => {
    setUserListOpen(!userListOpen);
  }
  const [message, setMessage] = React.useState("");
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

  const handleIncomingMessage = (msgObj) => {
    let userMapNew = { ...userMap };
    let msgBoxId = msgObj.from;
    if (msgObj.to == 'everyone') {
      msgBoxId = msgObj.to;
    }
    if (selectedUser == msgBoxId)
      userMapNew[msgBoxId].messages = [...userMapNew[msgBoxId].messages, {
        'msgTime': msgObj.time,
        'sender': msgObj.from,
        'message': msgObj.msg,
        'msgType': 1
      }];
    else
      userMapNew[msgBoxId].unreadMessages = [...userMapNew[msgBoxId].unreadMessages, {
        'msgTime': msgObj.time,
        'sender': msgObj.from,
        'message': msgObj.msg,
        'msgType': 1
      }];
    updateUserMap(userMapNew);
  }

  const handleMessageAction = React.useCallback((msgObj) => {
    switch (msgObj.type) {
      case 1:
        delete msgObj['type'];
        handleIncomingMessage(msgObj);
        break;
    }
  });

  const sendMessageToUser = () => {
    console.warn("PERSONAL MESSAGE >>>>");
    socket.emit('personal-message', {
      type: 1,
      from: socket._ownId,
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
      from: socket._ownId,
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
  // let usersMap = {
  //   'users':{
  //     'user1':{
  //       'messages':[{
  //         'msgTime':'time',
  //         'sender':'',
  //         'message':'',
  //         'msgType':''
  //       }],
  //       'unreadMessages':[{
  //         'msgTime':'time',
  //         'sender':'',
  //         'message':'',
  //         'msgType':''
  //       }],
  //       'color':"RED",
  //       'lastTypedMessage':"Hello",
  //       'displayPic':"",
  //       'name':"",
  //       'isHost':false
  //     }
  //   }
  // }
  React.useEffect(() => {
    sockett = socket;
    sockett.on('personal-message-reply', msg => {
      console.warn("PM", msg);
      handleMessageAction(msg)
    })
    sockett.on('group-message-reply', msg => {
      console.warn("GM", msg);
      handleMessageAction(msg)
    })
  }, [])

  console.log("return ", userMap);

  return <>
      <div id="userListDrawer" className={clsx(userListOpen && classes.userListOpened)}>
        <UserListDrawer handleUserListOpenClick={handleUserListOpenClick} open={userListOpen} userMap={userMap}
          saveLastTypedMessage={saveLastTypedMessage} ownId={socket._ownId} handleUserChange={handleUserChange} selectedUser={selectedUser} />
      </div>
      <div className={classes.main}>
        <div className={classes.header}>
          <IconButton className={classes.iconButto} aria-label="menu" onClick={handleUserListOpenClick}><MenuIcon /></IconButton>
          {userMap[selectedUser] ? <>
            <span style={{ flex: 1 }}>{userMap[selectedUser].name}</span>
            <Avatar alt={userMap[selectedUser].name} src="/static/images/avatar/1.jpg" />
          </> : 'Loading'}
        </div>
        {userMap[selectedUser] ? <>
          <div className={classes.chatBodyArea}>
            <ChatMessageArea chats={userMap[selectedUser]} ownId={socket._ownId} />
          </div>
        </> : <></>}
        <div className={classes.footer}>
          {emojiOpen ? <EmojiPicker /> : null}
          <Paper component="form" className={classes.root}>
            <IconButton className={classes.iconButton} aria-label="menu" onClick={handleEmojiButtonClick}>
              <InsertEmoticonIcon color="primary" />
            </IconButton>
            <TextField className={classes.input} placeholder="Message" inputProps={{ "aria-label": "" }} onInput={handleInputChange} value={message} multiline={true} />
            <Divider className={classes.divider} orientation="vertical" />
            <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={sendMessage}><SendIcon /></IconButton>
          </Paper>
        </div>
      </div>
    </>
}

export default ChatArea;