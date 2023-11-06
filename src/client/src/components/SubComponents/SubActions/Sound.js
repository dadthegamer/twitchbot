import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI//subActions/display.css';


function Sound({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);
    const [message, setMessage] = useState('');
    const [sound, setSound] = useState('');

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    const handleActionSelected = () => {
        setShowAction(false);
        onActionSelected({type: 'sound', sound: sound, name: 'Sound'});
    }

    const handleInputChange = (e) => {
        setMessage(e.target.value);
    }

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faPlay} className='action-icon' />
                <p className='action-title'>Sound</p>
                <span>Play a sound on stream</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Sound</h2>
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


export default Sound;