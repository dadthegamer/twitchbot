import React from 'react';
import '../../styles/GUI/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';

function TwitchMessage({ message, username, color }) {
    return (
        <div className="chat-message">
            <FontAwesomeIcon icon={faTwitch} className='fa-icon' />
            <span style={{ color: color }}>{username}</span>
            <span style={{ color: 'white' }}>: {message}</span>
        </div>
    )
}

export default TwitchMessage;