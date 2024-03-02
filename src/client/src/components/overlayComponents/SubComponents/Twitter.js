import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import '../../../styles/overlay/bottomLeft.css';


function Twitter() {
    return (
        <div className='bottom-left-card'>
            <FontAwesomeIcon className='social-media-icon' icon={faTwitter} />
            <span className='social-media-name'>@Dad_The_Gam3r</span>
        </div>
    );
}

export default Twitter;