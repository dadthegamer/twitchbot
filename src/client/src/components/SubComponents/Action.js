import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../../styles/GUI/actions.css';


function Actions({ action, icon }) {
    const [actions, setActions] = useState([]);

    return (
        <div className="action-container">
            <div className="action-inner">
                <FontAwesomeIcon icon={icon} />
                <p>{action}</p>
            </div>
        </div>
    )
}


export default Actions;