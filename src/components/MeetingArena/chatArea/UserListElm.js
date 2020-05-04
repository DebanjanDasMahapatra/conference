import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

import MailIcon from '@material-ui/icons/Mail';
import { ListItem, ListItemAvatar, ListItemText, Avatar, Badge } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    header: {
      position:'absolute',
      top: 0,
      width:230
        
    }
}));


const UserListElm = (props)=>{
    const {user,open,key} = props;
    const classes = useStyles();

    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                </Avatar>
            </ListItemAvatar>

            <ListItemText
            primary={user.guestName}
            secondary={user.isHost ? 'Host' : ''}
            />
            {user.pendingMessageCount>0?
                <Badge badgeContent={user.pendingMessageCount} color={user.pendingMessageCount>5?'error':'primary'}>
                    <MailIcon />
                </Badge>
            :null}
        </ListItem>)

}
export default UserListElm;