import { ADD_PARTICIPANT_INFO, REMOVE_PARTICIPANT_INFO, RESET_ALL_INFO, SET_SOCKET, UPDATE_MEETING_INFO, } from "./actionType";

const initialState = {
    socket: null,
    meetingInfo: null,
    participants: [

    ]
};

const Reducer = (state = initialState, action) => {
    switch (action.type) {
        case RESET_ALL_INFO:
            console.warn("RESET")
            console.log(state, action)
            return initialState;
        case SET_SOCKET:
            return { ...state, socket: action.socket };
        case UPDATE_MEETING_INFO:
            return { ...state, meetingInfo: { ...state.meetingInfo, ...action.meetingInfo } };
        case ADD_PARTICIPANT_INFO:
            console.warn("ADD_P")
            console.log(state, action)
            return { ...state, participants: [...state.participants, ...action.participants] };
        case REMOVE_PARTICIPANT_INFO:
            return { ...state, participants: state.participants.filter(p => p.guestId != action.participantId) };
        default:
            return state;
    }
}

export default Reducer;