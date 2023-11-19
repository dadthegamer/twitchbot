import React from 'react';
import '../../styles/GUI/dashboard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';

function TikTokMessage({ message, username }) {
    return (
        <div className="chat-message">
            <FontAwesomeIcon icon={faTiktok} className='fa-icon' />
            <span style={{ color: 'white' }}>{username}</span>
            <span style={{ color: 'white' }}>: {message}</span>
        </div>
    )
}

export default TikTokMessage;