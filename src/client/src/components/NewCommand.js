import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import '../styles/GUI/newCommand.css';
import Actions from './Actions';


function NewCommand() {
    const [commandName, setCommandName] = useState('');
    const [description, setDescription] = useState('');
    const [showActions, setShowActions] = useState(false);

    return (
        <div className="new-command-main-container">
            <div className="new-command-container">
                <div className="new-command-header">
                    <h1>New Command</h1>
                </div>
                <div className="new-command-body">
                    <div className='command-name-inner'>
                        <label htmlFor="">Command Name</label>
                        <input type="text" placeholder="command name..." onChange={(e) => setCommandName(e.target.value)} />
                    </div>
                    <div className='command-name-inner'>
                        <label htmlFor="">Description</label>
                        <input type="text" placeholder="command description..." onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='command-name-inner'>
                        <select multiple>
                            <option value="option1">Option 1</option>
                            <option value="option2">Option 2</option>
                            <option value="option3">Option 3</option>
                        </select>
                    </div>
                    <div className="new-command-actions">
                        <button className="add-action-btn" onClick={() => setShowActions(true)}>Add Action</button>
                        {showActions ? <Actions /> : null}
                    </div>
                </div>
            </div>
        </div>
    )
}


export default NewCommand;