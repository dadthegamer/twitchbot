import React, { useState, useEffect } from 'react';
import '../../styles/overlay/shoutout.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';


function Shoutout() {
    const [showShoutout, setShowShoutout] = useState(false);
    const [socket, setSocket] = useState(null);
    const [connected, setConnected] = useState(false);
    const [width, setWidth] = useState('180px');
    const [displayName, setDisplayName] = useState('');
    const [profilePic, setProfilePic] = useState('');
    const [lastSeen, setLastSeen] = useState('');
    const [animationClass, setAnimationClass] = useState('');
    const [shoutoutLength, setShoutoutLength] = useState(10); // In seconds

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
                console.log('Received data from websocket server:', data);
                if (data.type === 'shoutout') {
                    setDisplayName(data.payload.displayName);
                    setProfilePic(data.payload.profilePic);
                    setLastSeen(data.payload.lastSeen);
                    setShowShoutout(true);
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

    // Function to display the shoutout
    useEffect(() => {
        setTimeout(() => {
            setTimeout(() => {
                setWidth('800px')
                setTimeout(() => {
                    setWidth('180px');
                    setTimeout(() => {
                        setAnimationClass('hide-shoutout');
                        setTimeout(() => {
                            setAnimationClass('');
                            setShowShoutout(false);
                        }, 500);
                    }, 500);
                }, shoutoutLength * 1000 - 400);
            }, 50);
        }, 500);
    }, [displayName]);

    return (
        <div className={`shoutout-main-container ${animationClass}`}>
            {showShoutout && (
                <div className='shoutout-container' style={{
                    width: width,
                }}>
                    <img src={profilePic} alt="" />
                    <div className='shoutout-inner-container'>
                        <h1>Dad Squad check out {displayName}!</h1>
                        <p>Last seen playing: {lastSeen}</p>
                        <div className='shoutout--user-info'>
                            <FontAwesomeIcon icon={faTwitch} />
                            <span>twitch.tv/{displayName}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


export default Shoutout;