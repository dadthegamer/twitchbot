import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle, faEllipsisVertical, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import '../../styles/GUI/commands.css';
import EditCommand from './EditCommand';

const CommandSubComponent = ({ commandData }) => {
    const [commandName, setCommandName] = useState(commandData.name);
    const [enabled, setEnabled] = useState(commandData.enabled);
    const [editCommand, setEditCommand] = useState(false);
    const [editMenu, setEditMenu] = useState(false);


    const handleEditMenu = () => {
        setEditMenu(!editMenu);
    };

    const handleDeleteCommand = () => {
        // Make a DELETE request to the server to delete the command
        const response = fetch(`/api/commands/${commandName}`, {
            method: 'DELETE',
        });
        // If the response is successful, remove the command from the DOM
        if (response.status === 200) {
            const command = document.getElementById(commandName);
            command.remove();
        }
    };

    const setEditCommandTrue = () => {
        setEditCommand(true);
    };

    const setEditCommandFalse = () => {
        setEditCommand(false);
    };

    return (
        <div className="command-container" onClick={setEditCommandTrue}>
            <div className="command-left-options">
                <FontAwesomeIcon icon={faPlayCircle} className="fa-icon" />
                <span className="command-name">{commandName}</span>
            </div>
            <div className="command-right-options">
                <div className="switch-container">
                    <input type="checkbox" className="checkbox" id={`toggle-command-checkbox-${commandName}`} checked={enabled} />
                    <label className="switch" htmlFor={`toggle-command-checkbox-${commandName}`}>
                        <span className="slider"></span>
                    </label>
                </div>
                <FontAwesomeIcon icon={faEllipsisVertical} className="fa-icon" onClick={handleEditMenu} />
                {editMenu && (
                    <div className="command-menu">
                        <div>
                            <FontAwesomeIcon icon={faEdit} className="fa-icon" />
                            <span>Edit</span>
                        </div>
                        <div onClick={handleDeleteCommand}>
                            <FontAwesomeIcon icon={faTrash} className="fa-icon" />
                            <span>Delete</span>
                        </div>
                    </div>
                )}
            </div>
            {editCommand ? <EditCommand handleNewCommandClose={setEditCommandFalse} CommandData={commandData} /> : null}
        </div>
    );
}

export default CommandSubComponent;