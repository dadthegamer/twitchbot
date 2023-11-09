import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI//subActions/queue.css';


function Queue({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);
    const [queueAction, setQueueAction] = useState('');

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    const handleActionSelected = () => {
        setShowAction(false);
        onActionSelected({ type: 'queue', response: queueAction, name: 'Queue' });
    }

    const handleQueueChange = (e) => {
        setQueueAction(e.target.value);
        console.log(queueAction);
    };

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faList} className='action-icon' />
                <p className='action-title'>Queue</p>
                <span>Add or remove from queue</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Queue</h2>
                    </div>
                    {data ?
                        <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQueueChange}>
                            <option value="add">Add to queue</option>
                            <option value="remove">Remove from queue</option>
                            <option value="get">Get the queue</option>
                        </select> :
                        <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQueueChange}>
                            <option value="add">Add to queue</option>
                            <option value="remove">Remove from queue</option>
                            <option value="get">Get the queue</option>
                        </select>}
                    <div className='actions-form-container-buttons'>
                        <button onClick={handleActionSelected}>Save</button>
                        <button onClick={handleToogleAction}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    )
}


export default Queue;