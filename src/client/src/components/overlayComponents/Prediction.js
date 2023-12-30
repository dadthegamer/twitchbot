import React, { useState, useEffect } from 'react';
import '../../styles/overlay/predictions.css';


function Prediction() {
    const [showPrediction, setShowPrediction] = useState(false);
    const [totalUsers, setTotalVotes] = useState(0);
    const [totalPointsValue, setTotalPointsValue] = useState(0);
    const [predictionTitle, setPredictionTitle] = useState('Test Title');
    const [outcomes, setOutcomes] = useState([]);
    const [color, setColor] = useState('white');
    const [outcomePCTs, setOutcomePCTs] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [timer, setTimer] = useState('0:00');

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
                    if (data.payload.data.active === true) {
                        console.log(`Show prediction: ${showPrediction}`)
                        if (showPrediction === false) {
                            console.log('New prediction');
                            setShowPrediction(true);
                            const { title, outcomes, predictionWindow } = data.payload.data;
                            setPredictionTitle(title);
                            setOutcomes(outcomes);
                            startTimer(predictionWindow);
                        } else {
                            console.log('Updating prediction');
                            const { outcomes } = data.payload.data;
                            setOutcomes(outcomes);
                            // Map over the outcomes and set the total points
                            let totalPoints = totalPointsValue;
                            let totalVotes = totalUsers;
                            outcomes.forEach(outcome => {
                                totalPoints += outcome.channelPoints;
                                totalVotes += outcome.users;
                            });
                            console.log(totalPoints);
                            setTotalVotes(totalVotes);
                            setTotalPointsValue(totalPoints);
                        }
                    } else if (data.payload.data.active === false) {
                        setShowPrediction(false);
                    }
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

    function startTimer(ms) {
        const startTime = Date.now();
        const endTime = startTime + ms;
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            if (currentTime >= endTime) {
                clearInterval(intervalId);
                setTimer('0:00');
                return;
            }
            const timeLeft = endTime - currentTime;
            const minutes = Math.floor(timeLeft / 60000);
            const seconds = Math.floor((timeLeft % 60000) / 1000);
            setTimer(`${minutes}:${seconds < 10 ? '0' + seconds : seconds}`);
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
                                <div className="inner-outcome" style={{ color: outcome.color }}>
                                    <span className="outcome-title">{outcome.title}</span>
                                    <div className="pct-container">
                                        <span className="pct" style={{ color: outcome.color }}>0</span>
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
                </div>
            )}
        </>
    )
}

export default Prediction;