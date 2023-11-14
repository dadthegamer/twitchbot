import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStopwatch } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI//subActions/display.css';


function Delay({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);
    const [message, setMessage] = useState('');

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    const handleActionSelected = () => {
        setShowAction(false);
        onActionSelected({type: 'display', response: message, name: 'Display'});
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faStopwatch} className='action-icon' />
                <p className='action-title'>Delay</p>
                <span>Set a delay</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Poll</h2>
                    </div>
                    {data ?
                        <input type="text" value={data} /> :
                        <input type="text" placeholder="Enter a message..." value={message} onChange={handleInputChange} />}
                    <div className='actions-form-container-buttons'>
                        <button onClick={handleActionSelected}>Save</button>
                        <button onClick={handleToogleAction}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Delay;