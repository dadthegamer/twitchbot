import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function DailySubGoal() {
    const [showCard, setShowCard] = useState(false);
    const [dailySubGoal, setDailySubGoal] = useState(0);
    const [dailySubs, setDailySubs] = useState(0);
    const [pct, setPct] = useState(0);

    useEffect(() => {
        // Get the commands from the server. Then get a random command and description of a command that is enabled
        fetch('/api/goals')
            .then((res) => res.json())
            .then((data) => {
                // Find the daily sub goal
                const dailySubGoal = data.find((goal) => goal.name === 'dailySubGoal');
                setDailySubGoal(dailySubGoal.goal);
                setDailySubs(dailySubGoal.current);
                // If the pct is over 100, set it to 100
                const pct = (dailySubGoal.current / dailySubGoal.goal) * 100;
                setPct(pct > 100 ? 100 : pct);
                setShowCard(true);
            });
    }, []);

    return (
        <div className='bottom-left-card'>
            {showCard && (
                <>
                    <p style={
                        {
                            color: 'white',
                        }
                    }>Daily Sub Goal</p>
                    <div className="daily-sub-goal-progress-container">
                        <div className="daily-sub-goal-progress-bar" style={{ width: `${pct}%` }}></div>
                    </div>
                    <span style={
                        {
                            color: 'white',
                        }
                    } className='bottom-left-card-daily-sub-info'>{dailySubs}/{dailySubGoal}</span>
                </>
            )}
        </div>
    );
}

export default DailySubGoal;