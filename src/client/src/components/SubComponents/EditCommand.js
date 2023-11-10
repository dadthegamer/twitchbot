import React, { useState } from 'react';
import Actions from '../Actions';


function EditCommand({ handleNewCommandClose, CommandData }) {
    const [commandName, setCommandName] = useState(CommandData.name);
    const [description, setDescription] = useState(CommandData.description);
    const [showActions, setShowActions] = useState(false);
    const [actions, setActions] = useState([CommandData.handlers]);
    const [globalCooldown, setGlobalCooldown] = useState(CommandData.globalCooldown);
    const [userCooldown, setUserCooldown] = useState(CommandData.userCooldown);
    const [permissions, setPermissions] = useState(CommandData.permissions);
    const [everyone, setEveryone] = useState(true);
    const [subscriber, setSubscriber] = useState(false);
    const [vip, setVip] = useState(false);
    const [mods, setMods] = useState(false);

    console.log(actions);

    // Function to add action to actions array
    const addAction = (action) => {
        setActions([...actions, action]);
    }

    // Function to remove action from actions array
    const removeAction = (action) => {
        const updatedActions = actions.filter((a) => a !== action);
        setActions(updatedActions);
    }

    // Callback function to add actions to actions array
    const handleActionAdded = (action) => {
        console.log(action);
        addAction(action);
    }

    // Callback function to edit action
    const handleEditAction = () => {
        console.log('edit action');
    }

    const handleCheckboxChange = (e) => {
        const checkboxId = e.target.id;
        if (checkboxId === 'checkbox-everyone') {
            // If "Everyone" is checked, remove all other permissions and set only "everyone"
            setEveryone(!everyone);
            setSubscriber(false);
            setVip(false);
            setMods(false);
            setPermissions(['everyone']);
        } else {
            // If any other checkbox is checked, update the corresponding state
            switch (checkboxId) {
                case 'checkbox-subscriber':
                    setSubscriber(!subscriber);
                    setEveryone(false);
                    break;
                case 'checkbox-vip':
                    setVip(!vip);
                    setEveryone(false);
                    break;
                case 'checkbox-mods':
                    setMods(!mods);
                    setEveryone(false);
                    break;
                default:
                    break;
            }
            const updatedPermissions = [];
            if (everyone) updatedPermissions.push('everyone');
            if (subscriber) updatedPermissions.push('subscriber');
            if (vip) updatedPermissions.push('vip');
            if (mods) updatedPermissions.push('mods');

            setPermissions(updatedPermissions);
            console.log(permissions);
        }
    }

    const handleSaveCommand = () => {
        // Check if command name is empty or null if so, return
        if (!commandName || commandName.trim() === '') {
            return;
        } else {
            // If command name is not empty, create command object
            const command = {
                name: commandName,
                description: description,
                globalCooldown: globalCooldown,
                userCooldown: userCooldown,
                permissions: permissions,
                handlers: actions,
                enabled: true,
                liveOnly: false
            }
            // Make a POST request to create the command
            fetch('/api/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(command)
            })
                .then(res => res.json())
                .then(command => console.log(command))
                .catch(err => console.log(err));
            handleNewCommandClose();
        }
    }

    const handleShowActions = () => {
        setShowActions(false);
    }

    return (
        <div className="new-command-main-container">
            <div className="new-command-container">
                <div className="new-command-header">
                    <h1>Edit Command</h1>
                </div>
                <div className="new-command-body">
                    <div className='command-name-inner'>
                        <label htmlFor="">Command Name</label>
                        <input type="text" placeholder="command name..." value={commandName} onChange={(e) => setCommandName(e.target.value)} />
                    </div>
                    <div className='command-name-inner'>
                        <label htmlFor="">Description</label>
                        <input type="text" placeholder="command description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                    <div className='command-name-inner'>
                        <label htmlFor="">Global Cooldown</label>
                        <input type="text" placeholder="global cooldown..." value={globalCooldown} onChange={(e) => setGlobalCooldown(e.target.value)} />
                        <label htmlFor="">User Cooldown</label>
                        <input type="text" placeholder="user cooldown..." value={userCooldown} onChange={(e) => setUserCooldown(e.target.value)} />
                    </div>
                    <div className='permissions-container'>
                        <h2>Permissions</h2>
                        <div>
                            <div>
                                <input type="checkbox" id='checkbox-everyone' checked={everyone} onChange={handleCheckboxChange} />
                                <label htmlFor="checkbox-everyone">Everyone</label>
                            </div>
                            <div>
                                <input type="checkbox" id='checkbox-subscriber' checked={subscriber} onChange={handleCheckboxChange} />
                                <label htmlFor="checkbox-subscriber">Subscriber</label>
                            </div>
                            <div>
                                <input type="checkbox" id='checkbox-vip' checked={vip} onChange={handleCheckboxChange} />
                                <label htmlFor="checkbox-vip">VIP</label>
                            </div>
                            <div>
                                <input type="checkbox" id='checkbox-mods' checked={mods} onChange={handleCheckboxChange} />
                                <label htmlFor="checkbox-mods">Mods</label>
                            </div>
                        </div>
                    </div>
                    <div className='command-actions-main-wrapper'>
                        <div className='command-actions-header'>
                            <h2>Actions</h2>
                            <div className="new-command-actions">
                                <button className="add-action-btn" onClick={() => setShowActions(true)}>Add Action</button>
                                {showActions ? <Actions onAddAction={handleActionAdded} onActionsClose={handleShowActions} /> : null}
                            </div>
                        </div>
                        <div className='command-actions-selections'>
                            {actions.length === 0 ? (
                                <span>No actions</span>
                            ) : (
                                <div>
                                    {actions[0].map((action, index) => (
                                        <div key={index} className='actions-main-wrapper' onClick={handleEditAction}>
                                            <span>{action.name}</span>
                                            <button onClick={() => removeAction(action)}>Remove</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className='action-buttons-container'>
                <button id='cancel-command-btn' onClick={handleNewCommandClose}>Cancel</button>
                <button id='save-command-btn' onClick={handleSaveCommand}>Save</button>
            </div>
        </div>
    )
}


export default EditCommand;