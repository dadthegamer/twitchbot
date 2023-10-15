import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faXmark } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI/actions.css';


function Chat({ onActionSelected }) {
    const [showAction, setShowAction] = useState(false);

    const handleActionSelected = () => {
        setShowAction(true);
    }

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleActionSelected}>
                <FontAwesomeIcon icon={faComment} className='action-icon' />
                <p className='action-title'>Chat</p>
                <span>Send a chat message</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Chat Effect</h2>
                        <FontAwesomeIcon icon={faXmark}/>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Chat;