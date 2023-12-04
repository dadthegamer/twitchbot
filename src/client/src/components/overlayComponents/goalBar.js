import React, { useState, useEffect } from 'react';
import '../../styles/overlay/progressBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';


function ProgressBar() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [subsCount, setSubsCount] = useState(0);
    const [goal, setGoal] = useState(0);
    const [progressStyle, setProgressStyle] = useState({ width: '0%' });
    const [isLoading, setIsLoading] = useState(true);

    const wsurl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';

    // useEffect hook to update the sub data every 5 seconds
    useEffect(() => {
        const establishConnection = () => {
            const ws = new WebSocket(wsurl);

            ws.onopen = () => {
                console.log('Connected to websocket server');
                setConnected(true);
                setSocket(ws);
                setIsLoading(false);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log(data);
                if (data.type === 'subsUpdate') {
                    const { streamSubGoal, streamSubs } = data.payload;
                    setSubsCount(streamSubs);
                    setGoal(streamSubGoal);
                    const percentage = Math.round((streamSubs / streamSubGoal) * 100);
                    setProgressStyle({ width: `${percentage > 100 ? 100 : percentage}%` });
                };
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = () => {
                console.log('Disconnected');
                setConnected(false);
                // Reconnection logic should not be here; it will be handled by the useEffect cleanup.
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


    return (
        <div className="progress-container">
            {isLoading && (
                <div className="loading-screen">
                    <p>Loading...</p>
                </div>
            )}
            <FontAwesomeIcon icon={faGift} className='progress-icon' />
            <div className="progress-bar-right-side">
                <span className="goal">Daily Sub Goal</span>
                <div className="progress-main">
                    <div className="goal-progress-bar">
                        <div className="progress" style={progressStyle}></div>
                    </div>
                    <div className="progress-details">
                        <span className="goal" id='current'>{subsCount}/{goal}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}


export default ProgressBar;
