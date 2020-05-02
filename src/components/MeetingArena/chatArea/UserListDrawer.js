import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from '@material-ui/icons/Send';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import MenuIcon from '@material-ui/icons/Menu'
import List from '@material-ui/core/List';
import Slide from '@material-ui/core/Slide';
import UserListElm from './UserListElm';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    header: {
      top: 0,
      width:230
        
    },
    header1:{
        display:'flex',
        alignItems:'center'
    },
    header2:{
        marginLeft:10
    },
    
    main: {
        width: 230,
        maxWidth: 230,
        height:'100%',
        backgroundColor: theme.palette.background.paper,
        zIndex:1000,
        backgroundColor:'lightgray'
    },
    root: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '200px'
    },
    input: {
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        padding: 10
    },
    divider: {
        height: 28,
        margin: 4,
    }
  }));

const UserListDrawer = (props)=>{
    const {handleUserListOpenClick,open} = props;
    let tempUser = [
        {'name':"Avnish kummar",
        'userId':'123',
        'pendingMessageCount':1,
        'displayPic':null,
        'userType':'HOST'
        },
        {'name':"Mohit kummar",
        'userId':'124',
        'pendingMessageCount':0,
        'displayPic':null,
        'userType':'GUEST'
        },
        {'name':"Debanjan",
        'userId':'125',
        'pendingMessageCount':3,
        'displayPic':null,
        'userType':'GUEST'
        },
        {'name':"Alka Prasad",
        'userId':'126',
        'pendingMessageCount':15,
        'displayPic':null,
        'userType':'GUEST'
        },
        {'name':"Abhishek Das",
        'userId':'127',
        'pendingMessageCount':0,
        'displayPic':null,
        'userType':'GUEST'
        },
    ]
    const [userList,setUserList] = React.useState(tempUser);
    const [filteredUserList,setFilteredUserList] = React.useState(tempUser);
    const classes = useStyles();

    const [selectedIndex, setSelectedIndex] = React.useState(1);

        function handleListItemClick(event, index) {
            setSelectedIndex(index);
        }
        function generate(element) {
            return filteredUserList.map((user) =>
              React.cloneElement(element, {
                key: user.userId,
                user:user
              }),
            );
          }
          const onSerachChange=(e)=>{
              var sText = e.target.value;
              sText=sText.toLowerCase();
              console.log(sText);
              if(sText==""){
                setFilteredUserList(userList);
              }else{
                  let fUser = userList.filter(x=>{
                      return x.name.toLowerCase().indexOf(sText)!=-1;
                  });
                  setFilteredUserList(fUser);
              }
              console.log(filteredUserList)
          }

    return (
        <Slide direction="right" in={open} mountOnEnter unmountOnExit  className={classes.main}>
        <div>
        <div className={classes.header}>    
             <div  className={classes.header1}>
                <span style={{flex:1,marginLeft:33}}>Participants</span>
                <IconButton className={classes.iconButton} aria-label="close" onClick={handleUserListOpenClick}>
                    <ClearSharpIcon />
                </IconButton>
            </div>
                    
            <div className={classes.header2}>
                <Paper component="form" className={classes.root}>
                        <InputBase
                            className={classes.input}
                            placeholder="Find User"
                            inputProps={{ 'aria-label': 'Find' }}
                            onChange={onSerachChange}
                        />
                        <IconButton type="submit" className={classes.iconButton} aria-label="search">
                            <SearchIcon />
                        </IconButton>
                </Paper>
            </div>
 

        </div>
        <div style={{position: "relative"}}>
            {filteredUserList.length>0?
            <List dense={true}>
                {generate(<UserListElm></UserListElm>)}
                
            </List>
            :"No User Found"}
        </div>
    </div>
    </Slide>
    );

}

export default UserListDrawer;