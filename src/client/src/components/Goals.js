import React, { useEffect, useState } from 'react';
import GoalSubComponent from './SubComponents/GoalSubComponent';
import '../styles/GUI/goals.css';


const Goals = () => {
    const [goals, setGoals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/goals')
            .then((res) => res.json())
            .then((data) =>
                setGoals(data));
        setIsLoading(false);
    }, []);


    return (
        <div className="content">
            {isLoading && (
                <div className="loading-screen">
                    <p>Loading...</p>
                </div>
            )}
            <div className="goals-main-container">
                {goals.map((goal) => (
                    <GoalSubComponent
                        key={goal.name}
                        goalNameProp={goal.name}
                        enabledProp={goal.enabled}
                        currentProp={goal.current}
                        goalProp={goal.goal}
                        descriptionProp={goal.description}
                        handlersProp={goal.handlers}
                    />
                ))}
            </div>
        </div>
    );
}

export default Goals;