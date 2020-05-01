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

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    main: {
        height:'100%',
        position:'absolute'
        
    },
    header: {
      position:'absolute',
      top: 0,
      display:'flex'
        
    },
    footer: {
        position:'absolute',
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

return (
    <>
    <div id = "userListDrawer" className={clsx(userListOpen&&classes.userListOpened)}>
    <UserListDrawer handleUserListOpenClick={handleUserListOpenClick} open={userListOpen}/>
    </div>
    <div className={classes.main}>
    
    <div className={classes.header}>
    <IconButton className={classes.iconButton} aria-label="menu" onClick={handleUserListOpenClick}>
        <MenuIcon />
      </IconButton>
    <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
    <span>User</span>
 

    </div>
    <div>Body<br></br>This is</div>
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