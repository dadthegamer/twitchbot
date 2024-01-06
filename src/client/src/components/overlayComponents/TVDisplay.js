import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/display.css';


function Display() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('This is a test message');
    const [messageBackground, setMessageBackground] = useState('rgba(255, 255, 255, 0.10)');
    const [uptime, setUptime] = useState('0s');
    const [uptimeTimer, setUptimeTimer] = useState(0);
    const intervalRef = useRef(null);
    const [latestArrivalDisplayName, setLatestArrivalDisplayName] = useState('');
    const [latestArrivalProfilePic, setLatestArrivalProfilePic] = useState('');
    const [gameImg, setGameImg] = useState('https://static-cdn.jtvnw.net/ttv-boxart/512710-880x1280.jpg');


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
                if (data.type === 'displayMessage') {
                    console.log(data.payload);
                    setMessage(data.payload.message);
                    flashMessageBackground();
                } else if (data.type === 'userArrived') {
                    setLatestArrivalDisplayName(data.payload.displayName);
                    setLatestArrivalProfilePic(data.payload.profilePic);
                } else if (data.type === 'streamLive') {
                    if (data.payload.live) {
                        startUptimeTimer();
                        if (data.payload.streamInfo) {
                            setGameImg(data.payload.streamInfo.thumbnailUrl);
                        }
                    } else if (!data.payload.live) {
                        stopUptimeTimer();
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

    // Function that flashes the message background orange
    const flashMessageBackground = () => {
        const color = '#FF5F15';
        const previousColor = messageBackground;
        // Flash the color every .5 seconds for 5 seconds
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                setMessageBackground(color);
            }, i * 500);
            setTimeout(() => {
                setMessageBackground(previousColor);
            }, i * 500 + 250);
        }
    }

    // Function to start the uptime timer and format the time like 1d 2h 3m 4s. Only shows the highest time unit that is not 0
    // For example if the stream has been live for 1 day 2 hours 3 minutes and 4 seconds it will show 1d 2h 3m 4s or if the stream has been live for 2 hours 3 minutes and 4 seconds it will show 2h 3m 4s
    const startUptimeTimer = () => {
        // Clear any existing interval to avoid multiple intervals running
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setUptimeTimer(prevTime => {
                const newTime = prevTime + 1000;
                const seconds = Math.floor((newTime / 1000) % 60);
                const minutes = Math.floor((newTime / (1000 * 60)) % 60);
                const hours = Math.floor((newTime / (1000 * 60 * 60)) % 24);
                const days = Math.floor((newTime / (1000 * 60 * 60 * 24)));

                let uptime = '';
                if (days > 0) {
                    uptime += `${days}d `;
                }
                if (hours > 0) {
                    uptime += `${hours}h `;
                }
                if (minutes > 0) {
                    uptime += `${minutes}m `;
                }
                uptime += `${seconds}s`;
                setUptime(uptime);

                return newTime;
            });
        }, 1000);
    }

    // Function to stop the uptime timer
    const stopUptimeTimer = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    }


    return (
        <div className='tv-display-wrapper'>
            <div className='tv-display-background'></div>
            <div className='tv-display-inner'>
                <div className='now-playing-wrapper'>
                    {/* <div className='now-playing-banner-container'>
                        <span className="now-playing-banner">Now Playing</span>
                        <span className="now-playing-game">Twitch Plays Pokemon</span>
                    </div> */}
                    <img src={gameImg} alt="https://static-cdn.jtvnw.net/ttv-boxart/512710-880x1280.jpg" />
                </div>
                <div className='display-dashboard-info-container'>
                    <div className="latest-arrival-container">
                        <span>Latest Arrival</span>
                        <img src={latestArrivalProfilePic} alt="" />
                        <span className='latest-arrival-username'>{latestArrivalDisplayName}</span>
                    </div>
                    <div className="display-uptime-container">
                        <span>Uptime</span>
                        <span className='display-uptime'>{uptime}</span>
                    </div>
                </div>
            </div>
            <div className="scroll-message-container" style={
                {
                    backgroundColor: messageBackground,
                }
            }>
                <div className="scroll-chat-message">{message}</div>
            </div>
        </div>
    )
}

export default Display;