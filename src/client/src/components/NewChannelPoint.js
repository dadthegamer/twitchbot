import React, { useEffect, useState } from 'react';
import '../styles/GUI/newChannelPoint.css';
import Actions from './Actions';


function NewChannelPoint({ handleNewChannelPointClose }) {
    const [channelPointName, setChannelPointName] = useState(null);
    const [description, setDescription] = useState(null);
    const [showActions, setShowActions] = useState(false);
    const [actions, setActions] = useState([]);
    const [prompt, setPrompt] = useState(null);
    const [userInputRequired, setUserInputRequired] = useState(false);
    const [cost, setCost] = useState(0);
    const [globalCooldown, setGlobalCooldown] = useState(0);
    const [background, setBackground] = useState(null);
    const [autofill, setAutofill] = useState(false);
    const [maxRedemptions, setMaxRedemptions] = useState(0);
    const [maxRedemptionsPerUser, setMaxRedemptionsPerUser] = useState(0);

    useEffect(() => {
        setBackground(generateRandomColor());
    }, []);

    // Function to generate a random hex color
    const generateRandomColor = () => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        return `#${randomColor}`;
    }

    const setBackgroundColor = (color) => {
        setBackground(color);
    };

    const handleShowActions = () => {
        setShowActions(false);
    }

    // Callback function to add actions to actions array
    const handleActionAdded = (action) => {
        addAction(action);
    }

    // Function to add action to actions array
    const addAction = (action) => {
        setActions([...actions, action]);
    }

    // Function to remove action from actions array
    const removeAction = (action) => {
        const updatedActions = actions.filter((a) => a !== action);
        setActions(updatedActions);
    }

    const handleEditAction = () => {
        console.log('edit action');
    }

    const handleNameChange = (e) => {
        setChannelPointName(e.target.value);
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    }

    const handleCostChange = (e) => {
        setCost(e.target.value);
    }

    const handleInputRequiredChange = (e) => {
        setUserInputRequired(e.target.checked);
    }

    const handleCooldownChange = (e) => {
        setGlobalCooldown(e.target.value);
    }

    const handleMaxRedemptionsChange = (e) => {
        setMaxRedemptions(e.target.value);
    }

    const handleSaveReward = () => {
        // Send a post request to the server to save the reward
        const reward = {
            title: channelPointName,
            prompt: description,
            userInputRequired: userInputRequired,
            cost: cost,
            backgroundColor: background,
            globalCooldown: globalCooldown,
            maxRedemptionsPerStream: maxRedemptions,
            maxRedemptionsPerUserPerStream: maxRedemptionsPerUser,
            handlers: actions
        }
        const res = fetch('/api/rewards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reward)
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                handleNewChannelPointClose();
            })
            .catch((err) => console.log(err));
    }


    return (
        <div className='new-redemption-main-container'>
            <div className="new-redemption-container">
                <div className="new-redemption-header">
                    <h1>New Channel Point Reward</h1>
                </div>
                <div className="new-redemption-body">
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">Name</label>
                        <input type="text" id='reward-name' placeholder='name of reward...' value={channelPointName} onChange={handleNameChange} />
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">Description</label>
                        <input type="text" id='reward-description' placeholder='description of the reward...' value={description} onChange={handleDescriptionChange} />
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">Cost</label>
                        <input type="text" id='reward-cost' placeholder='cost of the reward...' value={cost} onChange={handleCostChange} />
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">User Input Required?</label>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id={`toggle-command-checkbox`} checked={userInputRequired} onChange={handleInputRequiredChange} />
                            <label className="switch" htmlFor={`toggle-command-checkbox`}>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="background-color">Background Color</label>
                        <input
                            type="color"
                            id="background-color"
                            value={background}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                        />
                        <input type="text" value={background} onChange={(e) => setBackgroundColor(e.target.value)} />
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">Redemption Cooldown</label>
                        <div>
                            <input type="text" id='reward-cooldown' placeholder='redemption cooldown...' value={globalCooldown} onChange={handleCooldownChange} />
                            <span className='input-description'>Time between each redemption</span>
                        </div>
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="reward-name">Max Redemptions Per Stream</label>
                        <div>
                            <input type="text" id='max-redemptions-per-stream' placeholder='max redemptions per stream...' value={maxRedemptions} onChange={handleMaxRedemptionsChange} />
                            <span className='input-description'>Set the maximum Redemptions per stream</span>
                        </div>
                    </div>
                    <div className="redemption-body-inner">
                        <label htmlFor="max-redemptions-per-stream-per-user">Max Redemptions Per User Per Stream</label>
                        <div>
                            <input type="text" id='max-redemptions-per-stream-per-user' placeholder='max redemptions per stream per user...' value={maxRedemptionsPerUser}/>
                            <span className='input-description'>Set the maximum Redemptions per user per stream</span>
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
                                    {actions.map((action, index) => (
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
                <button id='delete-command-btn' onClick={handleNewChannelPointClose}>Cancel</button>
                <button id='save-command-btn' onClick={handleSaveReward}>Save</button>
            </div>
        </div>
    );
}


export default NewChannelPoint;