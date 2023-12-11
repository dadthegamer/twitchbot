import React, { useState, useEffect } from 'react';
import '../../styles/overlay/display.css';


function Display() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState(null);
    const [showMessage, setShowMessage] = useState(true);
    const [showVideo, setShowVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);


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
                    setShowMessage(true);
                } else if (data.type === 'displayVideo') {
                    console.log(data.payload);
                    playVideo(data.payload.videoUrl);
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

    const playVideo = (videoUrl) => {
        setVideoUrl(videoUrl);
        setShowVideo(true);
    };

    return (
        <div>
            {showMessage && <div className="display">{message}</div>}
            {showVideo && <div className="video">
                <video src=""></video>
            </div>}
        </div>
    )
}

export default Display;