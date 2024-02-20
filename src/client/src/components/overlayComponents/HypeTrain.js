import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/hypeTrain.css';


function HypeTrain() {
    const [showHypeTrain, setShowHypeTrain] = useState(false);
    const [hypeTrainLevel, setHypeTrainLevel] = useState(0);
    const [hypeTrainGoal, setHypeTrainGoal] = useState(0);
    const [hypeTrainProgress, setHypeTrainProgress] = useState(0);
    const [hypeTrainPCT, setHypeTrainPCT] = useState(0);
    const [topContributor, setTopContributor] = useState({});
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [audioPlayed, setAudioPlayed] = useState(false);
    const [animationClass, setAnimationClass] = useState('');
    const [timer, setTimer] = useState(0);
    const [timerFormatted, setTimerFormatted] = useState('');


    const timerRef = useRef(timer);
    const timerIdRef = useRef(null);

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
                if (data.type === 'hypeTrain') {
                    if (data.payload.data.endDate) {
                        setAnimationClass('hide-hype-train');
                        setTimeout(() => {
                            setShowHypeTrain(false);
                            setAudioPlayed(true);
                            setAnimationClass('');
                            setTimer(0);
                        }, 1000);
                    } else {
                        timeRemaining(data.payload.data.expiryDate);
                        if (audioPlayed === false) {
                            playSound();
                            setAudioPlayed(true);
                            startTimer();
                        };
                        setHypeTrainLevel(data.payload.data.level);
                        setHypeTrainGoal(data.payload.data.goal);
                        setHypeTrainProgress(data.payload.data.progress);
                        setTopContributor(data.payload.data.topContributor);
                        setShowHypeTrain(true);
                        setHypeTrainPCT(data.payload.data.progress / data.payload.data.goal * 100);
                    }
                };
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
        timerRef.current = timer;
    }, [timer]);

    const playSound = () => {
        const soundUrl = process.env.PUBLIC_URL + `/hype-train-audio.mp3`;
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.onerror = (e) => {
                console.error('Error loading audio file:', e);
            };
            audio.play().catch((err) => {
                console.log(err);
            });
        } else {
            console.log('No sound to play');
        }
    };

    // Function to calculate the time remaining in the hype train
    const timeRemaining = (endDate) => {
        // Make sure the endDate is a valid date. If not format it to a valid date
        if (isNaN(endDate)) {
            endDate = new Date(endDate);
        }
        console.log(`End date: ${endDate}`);
        const now = new Date();
        const timeRemaining = endDate - now;

        if (timeRemaining > 0) {
            const seconds = Math.floor((timeRemaining / 1000) % 60);
            console.log(`Time remaining: ${seconds}`);
            setTimer(parseInt(seconds));
        }
    };

    // Function to format the timer from seconds to minutes and seconds
    const formatTimer = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        setTimerFormatted(`${minutes}m ${seconds}s`);
    };

    // Function to start the timer. This will be called when the hype train starts. Subtracts 1 from the timer every second
    const startTimer = () => {
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
        }
        timerIdRef.current = setInterval(() => {
            if (timerRef.current > 0) {
                timerRef.current = timerRef.current - 1;
                formatTimer(timerRef.current);
            } else {
                clearInterval(timerIdRef.current);
            }
        }, 1000);
    };

    return (
        <div className={`hype-train-container ${animationClass}`}>
            {showHypeTrain && (
                <div className="hype-train">
                    <div className="hype-train-header">
                        <h3>Hype Train</h3>
                        <p>Level {hypeTrainLevel}</p>
                    </div>
                    <div className="hype-train-progress-container">
                        <p>{hypeTrainPCT}%</p>
                        <div className="hype-train-progress-bar-container">
                            <div className="hype-train-progress-bar" style={{ width: `${hypeTrainPCT}%` }}></div>
                        </div>
                    </div>
                    <div className="top-contributor">
                        <h4>TOP CONTRIBUTOR</h4>
                        <img src={topContributor.profilePictureUrl} alt={topContributor.displayName} />
                        <p>{topContributor.displayName}</p>
                    </div>
                    <p className='hypetrain-timer'>{timerFormatted}</p>
                </div>
            )}
        </div>
    )
}

export default HypeTrain;