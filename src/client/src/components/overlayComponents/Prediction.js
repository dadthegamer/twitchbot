import React, { useState, useEffect } from 'react';
import '../../styles/overlay/predictions.css';


function Prediction() {
    const [showPrediction, setShowPrediction] = useState(false);
    const [totalUsers, setTotalVotes] = useState(0);
    const [totalPointsValue, setTotalPointsValue] = useState(0);
    const [predictionTitle, setPredictionTitle] = useState('Test Title');
    const [outcomes, setOutcomes] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [timer, setTimer] = useState('0:00');
    const [timerStarted, setTimerStarted] = useState(false);
    const [predictionData, setPredictionData] = useState(null);

    // Get the prediction data from the API and set it to state
    const wsurl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';

    useEffect(() => {
        const establishConnection = () => {
            const ws = new WebSocket(wsurl);

            ws.onopen = () => {
                console.log('Connected to websocket server');
                setConnected(true);
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                if (data.type === 'prediction') {
                    setPredictionData(data.payload.data);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = () => {
                console.log('Disconnected');
                setConnected(false);
            };

            return ws;
        };

        let ws = establishConnection();

        // Reconnection logic
        const intervalId = setInterval(() => {
            if (!connected && (!ws || ws.readyState === WebSocket.CLOSED)) {
                console.log('Reconnecting...');
                ws = establishConnection();
            }
        }, 5000);

        // Cleanup function to clear the resources when component unmounts
        return () => {
            clearInterval(intervalId); // Clear the interval for reconnection attempts
            if (ws) {
                ws.close(); // Close the WebSocket connection if it's open
            }
        };
    }, []);

    useEffect(() => {
        if (predictionData) {
            const { active, title, outcomes, predictionWindow, totalChannelPoints, totalUsers } = predictionData;

            setShowPrediction(active);
            if (active) {
                setPredictionTitle(title);
                setOutcomes(outcomes);
                startTimer(predictionWindow);
                setTotalPointsValue(numberWithCommas(totalChannelPoints));
                setTotalVotes(totalUsers);
            }
        }
    }, [predictionData]); // Effect runs when predictionData changes

    function startTimer(ms) {
        if (!timerStarted) {
            setTimerStarted(true);
            let time = ms / 1000;
            let minutes = Math.floor(time / 60);
            let seconds = time % 60;
            let timerString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
            setTimer(timerString);
            let timerInterval = setInterval(() => {
                time--;
                minutes = Math.floor(time / 60);
                seconds = time % 60;
                timerString = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                setTimer(timerString);
                if (time <= 0) {
                    clearInterval(timerInterval);
                }
            }, 1000);
        }
    }

    function getColor(outcome) {
        if (outcome.color === 'blue') return '#387ae1';
        if (outcome.color === 'pink') return '#f5009b';
        return 'white';
    }

    // Function to format a number with commas
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    return (
        <>
            {showPrediction && (
                <div className="prediction-container" id="prediction-container">
                    <span id="prediction-title">{predictionTitle}</span>
                    <div className="outcomes-container">
                        {outcomes.map(outcome => (
                            <div className="outcome" data-outcome-id={outcome.id} key={outcome.id}>
                                <div className="inner-outcome" style={{ color: getColor(outcome) }}>
                                    <span className="outcome-title">{outcome.title}</span>
                                    <div className="pct-container">
                                        <span className="pct" style={{ color: getColor(outcome) }}>{outcome.percentage}</span>
                                        <span>%</span>
                                    </div>
                                </div>
                                <div className="progress-bar-container">
                                    <div className="progress-bar" style={{
                                        backgroundColor: getColor(outcome),
                                        width: outcome.percentage + '%'
                                    }}></div>
                                </div>
                            </div>
                        ))}
                        )
                    </div>
                    <div className="bottom-container">
                        <div>
                            <span className="label">Unique Votes:</span>
                            <span id="total-votes">{totalUsers}</span>
                        </div>
                        <div>
                            <span className="label">Total Points:</span>
                            <span id="total-points">{totalPointsValue}</span>
                        </div>
                        <div className='prediction-timer-container'>
                            <span className="label">Time Left:</span>
                            <span id="prediction-timer">{timer}</span>
                        </div>
                    </div>
                    <span className='top-predictors-title'>Top Predictors</span>
                    <div className="top-predictors-container">
                        {outcomes.map(outcome => (
                            <div className="top-predictors" key={outcome.id}>
                                <span className="top-predictors-title" style={{ color: getColor(outcome) }}>{outcome.title}</span>
                                <div className="top-predictors-list">
                                    {outcome.topPredictors.map(predictor => (
                                        <div className="top-predictor" key={predictor.userId} style={
                                            {
                                                color: getColor(outcome),
                                            }
                                        
                                        }>
                                            <span className="predictor-name">{predictor.userDisplayName}</span>
                                            <span className="predictor-points">{numberWithCommas(predictor.channelPointsUsed)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

export default Prediction;