import { ADD_PARTICIPANT_INFO, SET_SOCKET, UPDATE_MEETING_INFO, } from "./actionType";

const initialState = {
    socket: null,
    meetingInfo: null,
    chatAreaState: {

    },
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
            return { ...state, participants: [...state.participants, ...action.participants] };
        default:
            return state;
    }
}

export default Reducer;