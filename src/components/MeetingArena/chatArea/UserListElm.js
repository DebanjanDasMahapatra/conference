import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import MailIcon from '@material-ui/icons/Mail';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Badge } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    header: {
        position: 'absolute',
        top: 0,
        width: 230

    },
    userListItem: {
        cursor: 'pointer'
    }
}));


const UserListElm = (props) => {
    const { user, selected, handleListItemClick } = props;
    const classes = useStyles();

    return <ListItem className={classes.userListItem} onClick={(event) => { handleListItemClick(event, user.userId) }} key={user.userId} selected={selected}>
        <ListItemAvatar>
            <Badge badgeContent={user.pendingMessageCount} color={user.pendingMessageCount > 5 ? 'error' : 'primary'}>
            <Avatar>{user.name.split(' ').map(word => word[0]).join('')}</Avatar>
            </Badge>
        </ListItemAvatar>
        <ListItemText primary={user.name} secondary={user.isHost ? 'Host' : ''} />            
    </ListItem>
}

export default UserListElm;