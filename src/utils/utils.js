import React from 'react';

const useSocketProofState = (initialState) => {
    const [state, updateState] = React.useState(initialState);
    const stateRef = React.useRef(initialState);
    React.useEffect(() => {
        stateRef.current = state;
    }, [state]);
    return [state, updateState, stateRef];
}

export default useSocketProofState;