import { ADD_PARTICIPANT_INFO, REMOVE_PARTICIPANT_INFO, SET_SOCKET, UPDATE_MEETING_INFO, } from "./actionType";

const initialState = {
    socket: null,
    meetingInfo: null,
    participants: [

    ]
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SOCKET:
            return { ...state, socket: action.socket };
        case UPDATE_MEETING_INFO:
            return { ...state, meetingInfo: { ...state.meetingInfo, ...action.meetingInfo } };
        case ADD_PARTICIPANT_INFO:
            return {
                ...state, participants: [...state.participants.map(parts => {
                    if (!action.participants.find(p => p.guestId == parts.guestId))
                        return parts;
                }).filter(parts => parts != undefined), ...action.participants]
            };
        case REMOVE_PARTICIPANT_INFO:
            return { ...state, participants: state.participants.filter(p => p.guestId != action.participantId) };
        default:
            return state;
    }
}

export default Reducer;