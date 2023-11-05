import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import CommandSubComponent from './SubComponents/CommandSubComponent';
import '../styles/GUI/commands.css';
import Actions from './Actions';
import NewCommand from './NewCommand'


function Commands() {
    const [commands, setCommands] = useState([]);
    const [editCommand, setEditCommand] = useState(false);
    const [newCommand, setNewCommand] = useState(false);

    useEffect(() => {
        fetch('/api/commands')
            .then(res => res.json())
            .then(commands => setCommands(commands));
    }, []);

    const handleNewCommandClose = () => {
        setNewCommand(false);
    };

    const handleNewCommandClick = () => {
        setNewCommand(true);
    };

    return (
        <div className="content">
            {newCommand ? <NewCommand handleNewCommandClose={handleNewCommandClose}/> : null}
            <div className="options-container">
                <button id="new-command-button" onClick={handleNewCommandClick}>New Command</button>
                <div className="search-bar">
                    <FontAwesomeIcon icon={faSearch} className="fa-icon" />
                    <input type="text" placeholder='search for commands...'/>
                </div>
            </div>
            <div className="commands-main-container">
                {commands.map((command) => (
                    <CommandSubComponent
                        commandNameProp={command.name}
                        commandIdProp={command._id}
                        commandEnabledProp={command.enabled}
                    />
                ))}
            </div>
        </div>
    )
}


export default Commands;