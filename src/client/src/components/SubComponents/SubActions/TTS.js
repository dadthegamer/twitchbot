import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRobot, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI/actions.css';


function TTS({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faRobot} className='action-icon' />
                <p className='action-title'>TTS</p>
                <span>Send a TTS message</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>TTS</h2>
                    </div>
                    {data ?
                        <input type="text" value={data} /> :
                        <input type="text" placeholder="Enter a message..." />}
                    <div className='actions-form-container-buttons'>
                        <button>Save</button>
                        <button onClick={handleToogleAction}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default TTS;