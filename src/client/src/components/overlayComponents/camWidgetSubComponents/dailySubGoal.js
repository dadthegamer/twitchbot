import React, { useState, useEffect, useRef } from 'react';
import '../../../styles/overlay/camWidget.css';


function DailySubGoal({ currentSubs, goalSubs, hideClass }) {
    const [progress, setProgress] = useState(0);
    const [goal, setGoal] = useState(0);

    useEffect(() => {
        setProgress(currentSubs);
        setGoal(goalSubs);
    }, [currentSubs, goalSubs]);

    return (
        <div className={`daily-sub-goal-main-container ${hideClass}`}>
            <div className="daily-sub-goal-progress-bar-container">
                <div
                    className="cam-widget-daily-sub-goal-progress-bar"
                    style={{ width: `${(progress / goal) * 100}%` }}
                ></div>
            </div>
            <div className="daily-sub-goal">
                <span className='daily-sub-goal-header'>Daily Sub Goal:</span>
                <div>
                    <span>{progress}</span>
                    <span>/</span>
                    <span>{goal}</span>
                </div>
            </div>
        </div>
    );
}

export default DailySubGoal;