import React, { Component } from 'react';

class ProgressBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pct: 0,
            currentCount: 0,
            goalCount: 100, // You can set the goal count to your desired value
        };
    }

    componentDidMount() {
        // You can add logic here to update the state and progress bar dynamically.
        // For example, you can use setInterval to simulate progress updates.
        // This is just a placeholder example.
        setInterval(() => {
            const { currentCount, goalCount } = this.state;
            if (currentCount < goalCount) {
                this.setState((prevState) => ({
                    currentCount: prevState.currentCount + 1,
                    pct: Math.floor((prevState.currentCount + 1) / goalCount * 100),
                }));
            }
        }, 1000); // Update every second
    }

    render() {
        const { pct, currentCount, goalCount } = this.state;

        return (
            <div className="progress-container">
                <div className="progress-bar" style={{ width: `${pct}%` }} id="myBar"></div>
                <div className="progress-text">
                    <span className="label">Daily Sub Goal</span>
                    <div className="inner-pct">
                        <span id="pct">{pct}</span>
                        <span>%</span>
                    </div>
                    <div className="current">
                        <span id="current_count">{currentCount}</span>
                        <span>/</span>
                        <span id="goal_count">{goalCount}</span>
                    </div>
                </div>
                <div className="completed">
                    <span>Goal Completed</span>
                </div>
            </div>
        );
    }
}

export default ProgressBar;
