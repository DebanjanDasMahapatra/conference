import React from "react";
import VolumeOff from '@material-ui/icons/VolumeOff';
import VideocamOff from '@material-ui/icons/VideocamOff';
import PT from "../../../participants";
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import { Paper } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    }
}));

const Participant = () => {

    const classes = useStyles();
    const [participants, setParticipants] = React.useState([]);

    React.useEffect(() => {
        setParticipants(PT.people);
    },[PT.people])

    return(<> {
        participants.map(participant => {
            return (
            <div className={classes.root} key={participant._id}>
                <Paper>
            <Grid container spacing={1}>
                <Grid item xs={8}>
                    {participant.guestName} {participant.isHost ? "(Host)" : ""}
                </Grid>
                <Grid item xs={2}>
                <VolumeOff/>
                </Grid>
                <Grid item xs={2}>
                <VideocamOff/>
                </Grid>
            </Grid></Paper>
            </div>)
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