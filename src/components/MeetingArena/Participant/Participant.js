import React from "react";
import VolumeOff from '@material-ui/icons/VolumeOff';
import VideocamOff from '@material-ui/icons/VideocamOff';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction, IconButton, Avatar, List } from "@material-ui/core";
import { ADD_PARTICIPANT_INFO, SET_SOCKET, UPDATE_MEETING_INFO } from "../../../store/actionType";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	}
}));

const Participant = (props) => {
	const { participants } = props;

	const classes = useStyles();

	return <>
		{
			participants.map(participant => {
				if(participant.guestId != 'everyone')
				return (<List dense={true} key={participant.guestId}>
					<ListItem>
						<ListItemAvatar><Avatar>{participant.guestName.split(' ').map(word => word[0]).join('')}</Avatar></ListItemAvatar>
						<ListItemText primary={participant.guestName + (participant.isHost ? " (Host)" : "")} />
						<ListItemSecondaryAction>
							<IconButton edge="end"><VolumeOff /></IconButton>
							<IconButton edge="end"><VideocamOff /></IconButton>
						</ListItemSecondaryAction>
					</ListItem>
				</List>)
			})
		}
	</>
}

const mapStateToProps = (state) => {
	return {
		socket: state.socket,
		meetingInfo: state.meetingInfo,
		participants: state.participants
	};
}

// const mapDispatchToProps = (dispatch) => {
//     return {
//         setSocket: (socket) => {
//             dispatch({
//                 type: SET_SOCKET,
//                 socket
//             });
//         },
//         updateMeetingInfo: (meetingInfo) => {
//             dispatch({
//                 type: UPDATE_MEETING_INFO,
//                 meetingInfo
//             });
//         },
//         addParticipants: (participants) => {
//             dispatch({
//                 type: ADD_PARTICIPANT_INFO,
//                 participants
//             });
//         }
//     };
// }

export default connect(mapStateToProps)(Participant);