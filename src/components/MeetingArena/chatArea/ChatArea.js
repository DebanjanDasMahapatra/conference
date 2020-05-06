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


const drawerWidth = 200;
const parentDrawerWidth =300;
const { innerWidth: windowWidth, innerHeight: windowHeight } = window;
const useStyles = makeStyles((theme) => ({
    main: {
        height:'100%',
        position:'fixed',
        display: 'flex',
        flexFlow: 'column'
        
    },
    chatBodyArea:{
      backgroundColor:"#fafafa",
      flexGrow:1,
      width:'100%',
      padding:'5px'
    },
    chatBodyAreaIn:{
      minHeight:'100%',
      overflowY:'auto',
      padding:10
    },
    header: {
      top: 0,
      display:'flex',
      width:295,
      alignItems:'center'
        
    },
    footer: {
        bottom: 0
        
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: 290,
        backgroundColor:"#e0e0e0"
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
    emojiPanel:{
      width:'290px',
      height:'400px'
    },
    drawerPaper: {
      width: drawerWidth,
      position:'absolute'
     },
     drawer: {
      width: drawerWidth,
      flexShrink: 0,
      },
      userListOpened:{
        zIndex:5,
        height:'100%'
      }
  }));

const ChatArea = (props)=>{
  const {socket, participants} = props;
  // console.warn("SUNO GAUR SE",participants);
  const [emojiOpen,setEmojiOpen] = React.useState(false);
  const [userListOpen,setUserListOpen] = React.useState(false);

  const handleUserListOpenClick = ()=>{
    setUserListOpen(!userListOpen);
  }
  const [message,setMessage]  = React.useState("");
  const areEqual = (prevProps, nextProps) => true;
    const classes = useStyles();
    const addEmoji = (e,emojiObj)=>{
      setEmojiOpen(false);
      setMessage(message+emojiObj.emoji);
    };
    const handleEmojiButtonClick = ()=>{
      setEmojiOpen(!emojiOpen);
    }
    const handleInputChange = (e)=>{
      setMessage(e.target.value);
    }
    const EmojiPicker = React.memo(props => {
      return (<Picker onEmojiClick={addEmoji} className={classes.emojiPanel}/>);
    }, areEqual);


    let messages = [{
      "type" : 1,
      "name": "cat",
      "message": "Hey there i'm alasddasdive, catch me!",
      "timestamp":"10:30 pm",
      "userId":"122"
    },{
      "type" : 0,
      "name": "cat",
      "message": "Hello! Good Morning!",
      "timestamp":"10:30 Am",
      "userId":"123"
  }, {
    "type" : 1,
    "name": "dog",
    "message": "Hey there i'm alive, catch me!",
    "timestamp":"10:30 pm",
    "userId":"124"
  }];
    const generateChatBox=(element)=>{
      return messages.map((msg1) =>
        React.cloneElement(element, {
          key: msg1.userId,
          msg:msg1
        }),
      );
    }
    

return (
    <>
    <div id = "userListDrawer" className={clsx(userListOpen&&classes.userListOpened)}>
    <UserListDrawer handleUserListOpenClick={handleUserListOpenClick} open={userListOpen} participants={participants}/>
    </div>
    <div className={classes.main}>
    
    <div className={classes.header}>
    <IconButton className={classes.iconButto} aria-label="menu" onClick={handleUserListOpenClick}>
        <MenuIcon />
      </IconButton>
    <span style={{flex:1}}>User</span>
    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
    </div>



    <div className={classes.chatBodyArea}>
      <Paper elevation={3} className={classes.chatBodyAreaIn}>
      {generateChatBox(<ChatBubble/>)}
      
      </Paper>

    </div>


    <div className={classes.footer}>
      {emojiOpen?<EmojiPicker/> :null}
    <Paper component="form" className={classes.root}>
      <IconButton className={classes.iconButton} aria-label="menu" onClick={handleEmojiButtonClick}>
        <InsertEmoticonIcon color="primary" />
      </IconButton>
      <InputBase
        className={classes.input}
        placeholder="Message"
        inputProps={{ "aria-label": "" }}
        onChange={handleInputChange}
        value={message}
        multiline={true}
      />

      <Divider className={classes.divider} orientation="vertical" />
      <IconButton
        color="primary"
        className={classes.iconButton}
        aria-label="directions"
      >
        <SendIcon />
      </IconButton>
    </Paper>
    </div>

    </div>


    </>

)

}

export default ChatArea;