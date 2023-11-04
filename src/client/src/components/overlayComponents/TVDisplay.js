import React, { useState, useEffect } from 'react';
import '../../styles/overlay/display.css';
import { wsurl } from '../../config';


function Display() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(true);

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
                    setShowMessage(true);
                } else if (data.type === 'subsUpdate') {
                    console.log(data.payload);
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
    return (
        <div>
            {showMessage && <div className="display">{message}</div>}
        </div>
    )
}

export default Display;