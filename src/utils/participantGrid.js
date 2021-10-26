import React from 'react';

const useParticipantGrid = (numOfParticipants) => {
    const [gridSize, setSize] = React.useState(numOfParticipants || 0);
    const [columns, setColumns] = React.useState(0);
    const [rows, setRows] = React.useState(0);

    React.useEffect(() => {
        if (gridSize) {
            if (gridSize == 1)
                setColumns(1);
            else if (gridSize <= 4)
                setColumns(2);
            else if (gridSize <= 9)
                setColumns(3);
            else
                setColumns(4);
        }
    }, [gridSize]);

    React.useEffect(() => {
        if (gridSize) {
            if (gridSize <= 2)
                setRows(1);
            else if (gridSize <= 6)
                setRows(2);
            else if (gridSize <= 12)
                setRows(3);
            else
                setRows(4);
        }
    }, [gridSize]);

    return [columns, rows, setSize];
}

export default useParticipantGrid;