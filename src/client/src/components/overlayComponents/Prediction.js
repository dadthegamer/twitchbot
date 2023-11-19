import React, { useState, useEffect } from 'react';
import '../../styles/overlay/predictions.css';


function Prediction() {
    const [showPrediction, setShowPrediction] = useState(false);
    const [totalVotes, setTotalVotes] = useState(0);
    const [totalPointsValue, setTotalPointsValue] = useState(0);
    const [predictionTitle, setPredictionTitle] = useState(null);
    const [outcomes, setOutcomes] = useState([]);
    const [color, setColor] = useState('white');
    const [outcomePCTs, setOutcomePCTs] = useState([]);


    // Get the prediction data from the API and set it to state
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/prediction')
                .then(res => res.json())
                .then(data => {
                    if (data.prediction !== null) {
                        if (data.prediction.locked === false) {
                            if (showPrediction === false) {
                                setShowPrediction(true);
                                console.log('showing prediction');
                                setPredictionTitle(data.prediction.title);
                                setOutcomes(data.prediction.outcomes);
                            } else {
                                console.log('updating prediction');
                                // const uniqueVotes = data.prediction.outcomes.reduce((acc, outcome) => {
                                //     return acc + outcome.users;
                                // }, 0);
                                // const totalPoints = data.prediction.outcomes.reduce((acc, outcome) => {
                                //     return acc + outcome.channelPoints;
                                // }, 0);
                                // setTotalVotes(uniqueVotes);
                                // setTotalPointsValue(totalPoints);
                                // // const pctArray = [];
                                // // for (let i = 0; i < data.prediction.outcomes.length; i++) {
                                // //     const outcome = data.prediction.outcomes[i];
                                // //     pctArray.push(Math.round((outcome.users / uniqueVotes) * 100));
                                // // }
                                // // setOutcomePCTs(pctArray);
                            }
                        } else if (data.locked === true) {
                            if (showPrediction) {
                                setPredictionTitle(null);
                                setTotalVotes(0);
                                setTotalPointsValue(0);
                                setShowPrediction(false);
                            }
                        }
                    }
                });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    function startTimer(ms) {
        const timer = document.getElementById('timer');
        let seconds = Math.floor(ms / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;
        timer.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        let intervalId = setInterval(() => {
            seconds--;
            if (seconds < 0) {
                seconds = 59;
                minutes--;
            }

            timer.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

            if (minutes === 0 && seconds === 0) {
                clearInterval(intervalId); // Stop the timer when it reaches 0
                // Optionally, you can call another function or perform some action here
            }
        }, 1000);
    }

    function getColor(outcome) {
        if (outcome.color === 'blue') return '#387ae1';
        if (outcome.color === 'pink') return '#f5009b';
        return 'white';
    }

    return (
        <>
            {showPrediction && (
                <div className="prediction-container" id="prediction-container">
                    <span id="prediction-title">{predictionTitle}</span>
                    <div className="outcomes-container">
                        {outcomes.map(outcome => (
                            <div className="outcome" data-outcome-id={outcome.id} key={outcome.id}>
                                <div className="inner-outcome" style={{ color }}>
                                    <span className="outcome-title">{outcome.title}</span>
                                    <div className="pct-container">
                                        <span className="pct" style={{ color }}>0</span>
                                        <span>%</span>
                                    </div>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{
                                        backgroundColor: color !== 'white' ? color : undefined
                                    }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bottom-container">
                        <div>
                            <span className="label">Unique Votes:</span>
                            <span id="total-votes">{totalVotes}</span>
                        </div>
                        <div>
                            <span className="label">Total Points:</span>
                            <span id="total-points">{totalPointsValue}</span>
                        </div>
                        <div>
                            <span className="label">Time Left:</span>
                            <span id="timer"></span>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Prediction;