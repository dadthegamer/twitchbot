import React, { useState, useEffect } from 'react';


function Welcome() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [username, setUsername] = useState(null);
    const [userImg, setUserImg] = useState(null);

    const wsurl = process.env.WEBSOCKET_URL || 'ws://localhost:3001';

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
                if (data.type === 'welcomeMessage') {
                    console.log(data.payload);
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
    return (
        <div className="welcome">
            <h1>Welcome to the chat!</h1>
            <p>Enter your name and start chatting!</p>
        </div>
    )
}

export default Welcome;