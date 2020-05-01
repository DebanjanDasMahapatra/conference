import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';


import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import MailIcon from '@material-ui/icons/Mail';
import Badge from '@material-ui/core/Badge';

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
    console.log(props,user,key);



    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>
                </Avatar>
            </ListItemAvatar>

            <ListItemText
            primary={user.name}
            secondary={true ? user.userType : null}
            />
            {user.pendingMessageCount>0?
                <Badge badgeContent={user.pendingMessageCount} color={user.pendingMessageCount>5?'error':'primary'}>
                    <MailIcon />
                </Badge>
            :null}
        </ListItem>)

}
export default UserListElm;