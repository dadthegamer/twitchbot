import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/camWidget.css';
import DailySubGoal from './camWidgetSubComponents/dailySubGoal';


function CamWidget() {
    const [showLatestEvents, setShowLatestEvents] = useState(false);
    const [latestEvents, setLatestEvents] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [containerHeight, setContainerHeight] = useState(150);
    const [showSubGoal, setShowSubGoal] = useState(true);
    const [subGoal, setSubGoal] = useState(20);
    const [currentSubs, setCurrentSubs] = useState(4);
    const [hideClass, setHideClass] = useState('');

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

    useEffect(() => {
        if (!showSubGoal) {
            setHideClass('hide');
        }
    }, [showSubGoal]);

    return (
        <div className='cam-widget-container' style={
            {
                height: `${containerHeight}px`
            }
        }>
            <DailySubGoal currentSubs={currentSubs} goalSubs={subGoal} hideClass={hideClass} />
        </div>
    )
}

export default CamWidget;