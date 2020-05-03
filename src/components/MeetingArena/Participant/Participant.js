import React from "react";
import VolumeOff from '@material-ui/icons/VolumeOff';
import VideocamOff from '@material-ui/icons/VideocamOff';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Avatar, List } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
}));

const Participant = (props) => {
    const {socket, participants} = props;
    const classes = useStyles();

    return(<> {
        participants.map(participant => {
            return (<List dense={false}>
            <div key={participant.guestId}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant.isHost ? participant.guestName+" (Host)" : participant.guestName}
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end">
                        <VolumeOff/>
                    </IconButton>
                    <IconButton edge="end">
                        <VideocamOff/>
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
            </div></List>)
            })
        }
    </>
    );
}

export default Participant;