import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiscord } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/overlay/bottomLeft.css';


function Discord() {
    return (
        <div className='bottom-left-card'>
            <FontAwesomeIcon className='social-media-icon' icon={faDiscord} />
            <span className='social-media-name'>The Dad Squad</span>
        </div>
    );
}

export default Discord;