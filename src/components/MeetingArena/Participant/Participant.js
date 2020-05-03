import React from "react";
import VolumeOff from '@material-ui/icons/VolumeOff';
import VideocamOff from '@material-ui/icons/VideocamOff';
import Grid from '@material-ui/core/Grid';
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
                {/* <Paper>
            <Grid item xs={12}>
                <Grid item xs={8}>
                    {participant.guestName} {participant.isHost ? "(Host)" : ""}
                </Grid>
                <Grid item xs={2}>
                <VolumeOff/>
                </Grid>
                <Grid item xs={2}>
                <VideocamOff/>
                </Grid>
            </Grid></Paper> */}
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
        {/* {
            participants.map(participant => {
                return <div key={participant._id}>{participant.guestName} {participant.isHost ? "(Host)" : ""}
                <VolumeOff/>
                <VideocamOff/>
                </div>
            })
        } */}
    </>
    );
}

export default Participant;