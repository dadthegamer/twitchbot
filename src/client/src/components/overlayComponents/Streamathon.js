import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../styles/overlay/streamathon.css';

function StreamathonOverlay() {
    const [timer, setTimer] = useState(0);
    const [active, setActive] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        fetch('/api/streamathon')
            .then(res => res.json())
            .then(res => {
                setActive(res.streamathonActive);
                if (res.currentTimer !== null && res.currentTimer > 0) {
                    setTimer(res.streamathonCurrentTimer);
                };
            })
            .catch(err => console.log(err));
    }, []);

    useEffect(() => {
        // Function to initiate the WebSocket connection
        const connect = () => {
            const ws = new WebSocket('ws://192.168.1.31:3505');

            ws.onopen = () => {
                console.log('Connected to websocket server');
                setConnected(true);
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    console.log(data.payload);
                    setAlertData(data.payload);
                    playAlert(data.payload.alertTime);
                }
            };

            ws.onerror = (error) => {
                console.error('WebSocket Error:', error);
            };

            ws.onclose = (event) => {
                console.log('Disconnected from WebSocket server');
                setConnected(false);
                setSocket(null);
                // If connection is closed, try to reconnect after 1 second
                setTimeout(() => {
                    console.log('Attempting to reconnect...');
                    if (!socket || socket.readyState === WebSocket.CLOSED || connected === false) {
                        connect();
                    }
                }, 1000);
            };
        }

        // Initially connect
        connect();

        // Cleanup function to clear the resources when component unmounts
        return () => {
            if (socket) {
                socket.close();
            }
        }
    }, []);
}