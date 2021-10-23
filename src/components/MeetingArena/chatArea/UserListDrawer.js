import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import SearchIcon from "@material-ui/icons/Search";
import SendIcon from '@material-ui/icons/Send';
import ClearSharpIcon from '@material-ui/icons/ClearSharp';
import MenuIcon from '@material-ui/icons/Menu'
import { Slide, List, IconButton, Divider, InputBase, Paper, ownerWindow } from '@material-ui/core';
import UserListElm from './UserListElm';

const drawerWidth = 200;
const useStyles = makeStyles((theme) => ({
    header: {
        top: 0,
        width: 230

    },
    header1: {
        display: 'flex',
        alignItems: 'center'
    },
    header2: {
        marginLeft: 10
    },

    main: {
        width: 230,
        maxWidth: 230,
        height: '100%',
        backgroundColor: theme.palette.background.paper,
        zIndex: 1000,
        backgroundColor: theme.palette.background.default
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

const UserListDrawer = (props) => {
    const { handleUserListOpenClick, open, userMap, saveLastTypedMessage, handleUserChange, selectedUser, ownId: userId} = props;
    const [userList, setUserList] = React.useState([]);
    const [filteredUserList, setFilteredUserList] = React.useState([]);
    const [oldUserMap, updateOlduserMap] = React.useState({});
    
    React.useEffect(() => {
        let userIds = Object.keys(userMap);
        let userArray = [];
        let newUserIds = userIds.filter(uid => {
            return !oldUserMap.hasOwnProperty(uid) && uid != userId;
        })
        newUserIds.forEach(userId => {
            updateOlduserMap({ ...oldUserMap, userIds: true })
            userArray.push({
                userId,
                name: userMap[userId].name,
                isHost: userMap[userId].isHost,
                pendingMessageCount: userMap[userId].unreadMessages.length,
                displayPic: userMap[userId].displayPic
            })
        })
        setUserList(userArray);
        setFilteredUserList(userArray);
    }, [userMap])
    const classes = useStyles();

    // const [selectedIndex, setSelectedIndex] = React.useState(0);

    function handleListItemClick(event, clickedUserId) {
        console.error("USER ID", clickedUserId, selectedUser)
        saveLastTypedMessage(selectedUser);
        handleUserChange(clickedUserId);
        handleUserListOpenClick();
        // setSelectedIndex(index);
    }
    function generate(element) {
        return filteredUserList.map((user) =>
            React.cloneElement(element, {
                key: user.userId,
                user: user,
                handleListItemClick: handleListItemClick,
                selected: user.userId == selectedUser
            }),
        );
    }
    const onSerachChange = (e) => {
        var sText = e.target.value;
        sText = sText.toLowerCase();
        console.log(sText);
        if (sText == "") {
            setFilteredUserList(userList);
        } else {
            let fUser = userList.filter(x => {
                return x.name.toLowerCase().indexOf(sText) != -1;
            });
            setFilteredUserList(fUser);
        }
    }

    return (
        <Slide direction="right" in={open} mountOnEnter unmountOnExit className={classes.main}>
            <div>
                <div className={classes.header}>
                    <div className={classes.header1}>
                        <span style={{ flex: 1, marginLeft: 13 }}>Participants</span>
                        <IconButton className={classes.iconButton} aria-label="close" onClick={handleUserListOpenClick}>
                            <ClearSharpIcon />
                        </IconButton>
                    </div>
                    <div className={classes.header2}>
                        <Paper component="form" className={classes.root}>
                            <InputBase className={classes.input} placeholder="Find User" inputProps={{ 'aria-label': 'Find' }} onChange={onSerachChange} />
                            <IconButton type="submit" className={classes.iconButton} aria-label="search">
                                <SearchIcon />
                            </IconButton>
                        </Paper>
                    </div>
                </div>
                <div style={{ position: "relative" }}>
                    {filteredUserList.length > 0 ? <List dense={true}> {generate(<UserListElm />)}</List> : "No User Found"}
                </div>
            </div>
        </Slide>
    );

}

export default UserListDrawer;