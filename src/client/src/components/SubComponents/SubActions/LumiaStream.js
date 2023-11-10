import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTerminal, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI//subActions/base.css';
import '../../../styles/GUI//subActions/lumiaStream.css';

function LumiaStream({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);
    const [command, setCommand] = useState('');
    const [commands, setCommands] = useState([]);


    // Get the commands from the server
    useEffect(() => {
        fetch('/api/lumiastream')
            .then(res => res.json())
            .then(data => {
                setCommands(data);
            })
            .catch(err => console.log(err));
    }, []);

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    const handleActionSelected = () => {
        setShowAction(false);
        onActionSelected({ type: 'lumiaStreamCommand', response: command, name: 'Lumia Stream Command' });
    }

    const handleQueueChange = (e) => {
        setCommand(e.target.value);
    };

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faTerminal} className='action-icon' />
                <p className='action-title'>Lumia Stream</p>
                <span>Send command to lumia stream</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Queue</h2>
                    </div>
                    {data ?
                        <div className='action-inner-container'>
                            <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQueueChange}>
                                {commands.map((command, index) => (
                                    <option key={index} value={command}>{command}</option>
                                ))}
                            </select>
                        </div> :
                        <div className='action-inner-container'>
                            <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQueueChange}>
                                {commands.map((command, index) => (
                                    <option key={index} value={command}>{command}</option>
                                ))}
                            </select>
                            <FontAwesomeIcon icon={faArrowsRotate} className='refresh-button' />
                        </div>}
                    <div className='actions-form-container-buttons'>
                        <button onClick={handleActionSelected}>Save</button>
                        <button onClick={handleToogleAction}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default LumiaStream;