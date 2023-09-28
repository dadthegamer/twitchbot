import React, { useState, useEffect } from 'react';
import '../../styles/overlay/progressBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';


function ProgressBar() {
    // Get the current sub data from the API
    const [subData, setSubData] = useState({});

    // useEffect hook to update the sub data every 5 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/goals')
                .then(res => res.json())
                .then(data => {
                    // Find the sub goal data named dailySubGoal
                    const subGoal = data.goalData.find(goal => goal.name === 'dailySubGoal');
                    setSubData(subGoal);
                });
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const { current, goal } = subData;

    // Calculate percentage
    const percentage = Math.round((current / goal) * 100);

    // Set the width of the progress bar
    // if the percentage is greater than 100, set it to 100
    const progressStyle = {
        width: `${percentage > 100 ? 100 : percentage}%`
    }


    return (
        <div className="progress-container">
            <FontAwesomeIcon icon={faGift} />
            <div className="right-side">
                <span className="goal">Daily Sub Goal</span>
                <div className="progress-main">
                    <div className="progress-bar">
                        <div className="progress" style={progressStyle}></div>
                    </div>
                    <div className="progress-details">
                        <span className="goal" id='current'>{current}</span>
                        <span className="goal">/</span>
                        <span className="goal" id='goal'>{goal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProgressBar;
