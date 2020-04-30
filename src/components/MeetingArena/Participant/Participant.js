import React from "react";
import VolumeOff from '@material-ui/icons/VolumeOff';
import VideocamOff from '@material-ui/icons/VideocamOff';
import PT from "../../../participants";

const Participant = () => {

    const [participants, setParticipants] = React.useState([]);

    React.useEffect(() => {
        setParticipants(PT.people);
    },[PT.people])

    return(<> 
        {
            participants.map(participant => {
                return <div key={participant._id}>{participant.guestName} {participant.isHost ? "(Host)" : ""}
                <VolumeOff/>
                <VideocamOff/>
                </div>
            })
        }
    </>
    );
}

export default Participant;