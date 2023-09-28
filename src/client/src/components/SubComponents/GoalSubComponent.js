import React, { useEffect, useState } from 'react';
import '../../styles/GUI/goals.css';


const GoalSubComponent = ({ goalNameProp, enabledProp, currentProp, goalProp, descriptionProp, handlersProp }) => {
    const [goalName, setGoalName] = useState(goalNameProp);
    const [enabled, setEnabled] = useState(enabledProp);
    const [current, setCurrent] = useState(currentProp);
    const [goal, setGoal] = useState(goalProp);
    const [description, setDescription] = useState(descriptionProp);
    const [handlers, setHandlers] = useState(handlersProp);

    useEffect(() => {
        setGoalName(goalNameProp);
        setEnabled(enabledProp);
        setCurrent(currentProp);
        setGoal(goalProp);
        setDescription(descriptionProp);
        setHandlers(handlersProp);
    }, [goalNameProp, enabledProp, currentProp, goalProp, descriptionProp, handlersProp]);

    useEffect(() => {
        // Rename the goal names to be more user friendly
        switch (goalName) {
            case 'dailySubGoal':
                setGoalName('Daily Sub Goal');
                break;
            case 'monthlySubGoal':
                setGoalName('Monthly Sub Goal');
                break;
            case 'dailyDonationGoal':
                setGoalName('Daily Donation Goal');
                break;
            case 'monthlyDonationGoal':
                setGoalName('Monthly Donation Goal');
                break;
            case 'dailyFollowersGoal':
                setGoalName('Daily Follower Goal');
                break;
            case 'monthlyFollowersGoal':
                setGoalName('Monthly Follower Goal');
                break;
            case 'dailyBitsGoal':
                setGoalName('Daily Bits Goal');
                break;
            case 'monthlyBitsGoal':
                setGoalName('Monthly Bits Goal');
                break;
        }
    });

    const handleReset = () => {
        setCurrent(0);
        // Send a PUT request to the server to reset the goal
        fetch('/api/goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goal: goalName, update: { current: 0 } })
        })
    };

    const handCurrentChange = (e) => {
        setCurrent(e.target.value);
        // Convert the value to a number
        e.target.value = Number(e.target.value);
        // Send a PUT request to the server to update the goal
        fetch('/api/goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goal: goalName, update: { current: e.target.value } })
        })
    };

    const handleGoalChange = (e) => {
        setGoal(e.target.value);
        // Convert the value to a number
        e.target.value = Number(e.target.value);
        // Send a PUT request to the server to update the goal
        fetch('/api/goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goal: goalName, update: { goal: e.target.value } })
        })
    }

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
        // Send a PUT request to the server to update the goal
        fetch('/api/goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goal: goalName, update: { description: e.target.value } })
        })
    }

    const handleEnabledChange = (e) => {
        setEnabled(e.target.checked);
        // Send a PUT request to the server to update the goal
        fetch('/api/goals', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ goal: goalName, update: { enabled: e.target.checked } })
        })
    }


    return (
        <div className="goal-container">
            <div className="goal-title">
                <h2>{goalName}</h2>
                <div className="switch-container">
                    <input type="checkbox" className="checkbox" id={`toggle-currency-checkbox-${goalName}`} checked={enabled} onChange={handleEnabledChange}/>
                    <label className="switch" htmlFor={`toggle-currency-checkbox-${goalName}`}>
                        <span className="slider"></span>
                    </label>
                </div>
            </div>
            <div className="goal-inputs">
                <div>
                    <input type="text" id={`current-${goalName}`} value={current} onChange={handCurrentChange}/>
                    <label htmlFor="">Current</label>
                </div>
                <h1>/</h1>
                <div>
                    <input type="text" id={`goal-${goalName}`} value={goal} onChange={handleGoalChange} />
                    <label htmlFor="">Goal</label>
                </div>
            </div>
            <div className='description-container'>
                <input type="text" id={`description-${goalName}`} value={description} onChange={handleDescriptionChange}/>
                <label htmlFor="">Description</label>
            </div>
            <button id='reset-button' onClick={handleReset}>Reset</button>
        </div>
    );
}

export default GoalSubComponent;