import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTiktok } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/overlay/bottomLeft.css';


function TikTok() {
    return (
        <div className='bottom-left-card' style={
            {
                backgroundColor: '#ff0050',
            }
        }>
            <FontAwesomeIcon className='social-media-icon' icon={faTiktok} />
            <span className='social-media-name'>dad.the.gamer</span>
        </div>
    );
}

export default TikTok;