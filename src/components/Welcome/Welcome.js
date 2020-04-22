import React from 'react';
import "./Welcome.css";


const Welcome = () => {
    return <React.Fragment>
        <div className="block">
            <h3>New Meeting</h3>
            <input type="text" placeholder="Your Username" />
            <button type="button">Create</button>
        </div>
        <div className="block">
            <h3>Join Meeting</h3>
            <input type="text" placeholder="Meeting ID" />
            <button type="button">Join</button>
        </div>
    </React.Fragment>;
}

export default Welcome;