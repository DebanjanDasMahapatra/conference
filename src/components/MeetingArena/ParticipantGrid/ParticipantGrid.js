import { Grid, ImageList, ImageListItem, makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import './pg.css';
import clsx from 'clsx';
import { connect } from 'react-redux';
import useParticipantGrid from '../../../utils/participantGrid';

const useStyles = makeStyles((theme) => ({
    wrapper: {
    },
    mainGrid: {
        justifyContent: 'center',
        alignContent: 'center'
    },
    userNameText: {
        justifyContent: 'center',
        alignContent: 'center',
        display: 'grid',
        marginTop: '60px'
    },
    person: {
        color: 'white',
        backgroundImage: 'linear-gradient(to top right, #252525, #303030)'
    },
    '1_1': {
        height: 'calc(100vh)',
        maxWidth: 'calc(100vw)'
    },
    '1_2': {
        height: 'calc(100vh)',
        maxWidth: 'calc(100vw/2)'
    },
    '2_2': {
        height: 'calc(100vh/2)',
        maxWidth: 'calc(100vw/2)'
    },
    '2_3': {
        height: 'calc(100vh/2)',
        maxWidth: 'calc(100vw/3)'
    },
    '3_3': {
        height: 'calc(100vh/3)',
        maxWidth: 'calc(100vw/3)'
    },
    '3_4': {
        height: 'calc(100vh/3)',
        maxWidth: 'calc(100vw/4)'
    }
}));

const ParticipantGrid = props => {

    const { participants } = props;

    const [columns, rows, setLength] = useParticipantGrid(participants.length - 1);
    const classes = useStyles();

    React.useEffect(() => {
        setLength(participants.length - 1);
    },[participants]);

    return <div className={classes.wrapper}><Grid container className={classes.mainGrid}>
        {
            participants.map(person => {
                if (person.guestId != 'everyone')
                    return <Grid item sm={12 / (columns || 1)} key={person.guestId} className={clsx(classes.person, classes[`${rows}_${columns}`])}>
                        <div className={classes.userNameText}>
                        <Typography>{person.guestName}</Typography>
                        </div>
                        {/* } */}
                    </Grid>
            })
        }
    </Grid></div>

}

const mapStateToProps = (state) => {
    return {
        socket: state.socket,
        meetingInfo: state.meetingInfo,
        participants: state.participants
    };
}

export default connect(mapStateToProps)(ParticipantGrid);