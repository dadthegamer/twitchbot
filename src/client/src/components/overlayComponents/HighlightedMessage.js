import React, { useState, useEffect } from 'react';
import '../../styles/overlay/highlighted.css';


function HighlightedMessage() {
    const [message, setMessage] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const [profilePic, setProfilePic] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [timer, setTimer] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const wsurl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';

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
                if (data.type === 'highlightedMessage') {
                    try {
                        setMessage(data.payload.message);
                        setDisplayName(data.payload.displayName);
                        setProfilePic(data.payload.profilePic);
                        setTimer(data.payload.alertTime);
                        showHideMessage(data.payload.alertTime);
                    }
                    catch (err) {
                        console.error(err);
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
    }, [connected, wsurl]);

    function showHideMessage(timer) {
        setShowMessage(true);
        setTimeout(() => {
            setShowMessage(false);
        }, timer);
    }

    return (
        <div className="highlighted-message-container">
            {showMessage && <div className="highlighted-message">
                <img src={profilePic} alt="" className='user-profile-image'/>
                <div className='message-details'>
                    <span>{displayName}</span>
                    <span>{message}</span>
                </div>
            </div>}
        </div>
    );
}

export default HighlightedMessage;