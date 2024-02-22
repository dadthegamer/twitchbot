import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/overlay/bottomLeft.css';


function Youtube() {
    return (
        <div className='bottom-left-card' style={
            {
                backgroundColor: '#FF0000',
            }
        }>
            <FontAwesomeIcon className='social-media-icon' icon={faYoutube} />
            <span className='social-media-name'>Dad The Gamer Games</span>
        </div>
    );
}

export default Youtube;