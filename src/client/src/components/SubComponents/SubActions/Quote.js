import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
import '../../../styles/GUI//subActions/queue.css';


function Quote({ onActionSelected, data }) {
    const [showAction, setShowAction] = useState(false);
    const [quoteAction, setQuoteAction] = useState('add');

    const handleToogleAction = () => {
        setShowAction(!showAction);
    }

    const handleActionSelected = () => {
        setShowAction(false);
        onActionSelected({ type: 'quote', response: quoteAction, name: 'Quote' });
    }

    const handleQuoteChange = (e) => {
        setQuoteAction(e.target.value);
    };

    return (
        <div className="action-container">
            <div className="action-inner" onClick={handleToogleAction}>
                <FontAwesomeIcon icon={faQuoteLeft} className='action-icon' />
                <p className='action-title'>Quote</p>
                <span>Add or get a quote</span>
            </div>
            {showAction && (
                <div className='actions-form-container'>
                    <div className="actions-form-header">
                        <h2>Quote</h2>
                    </div>
                    {data ?
                        <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQuoteChange}>
                            <option value="get">Get a quote</option>
                            <option value="create">Create a quote</option>
                        </select> :
                        <select name="queue-options-selector-container" id="queue-options-selector-container" onChange={handleQuoteChange}>
                            <option value="get">Get a quote</option>
                            <option value="create">Create a quote</option>
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


export default Quote;