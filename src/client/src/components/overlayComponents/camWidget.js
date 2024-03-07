import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/camWidget.css';
import DailySubGoal from './camWidgetSubComponents/dailySubGoal';
import LatestEvents from './camWidgetSubComponents/latestEvents';


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
    const [latestEventsCurrentIndex, setLatestEventsCurrentIndex] = useState(0);
    const [latestEventsOpacity, setLatestEventsOpacity] = useState('1');
    const [latestEventsHideClass, setLatestEventsHideClass] = useState('');
    const [latestEventInterval, setLatestEventInterval] = useState(5); // In Seconds
    const [showInterval, setShowInterval] = useState(1); // In Minutes

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
                if (data.type === 'subsUpdate') {
                    const { streamSubGoal, streamSubs } = data.payload;
                    setSubGoal(streamSubGoal);
                    setCurrentSubs(streamSubs);
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
        let currentIndex = 0;
        if (currentIndex >= latestEvents.length) {
            currentIndex = 0;
        }
    
        const processEvents = async () => {
            if (currentIndex < latestEvents.length) {
                console.log(`Processing event ${currentIndex} of ${latestEvents.length}`);
                setLatestEventsCurrentIndex(currentIndex);
                setLatestEventsOpacity('1'); // Show the event immediately
                currentIndex++;
                await new Promise(resolve => setTimeout(resolve, (latestEventInterval * 1000)));
    
                // Hide the event immediately before waiting for the next one
                setLatestEventsOpacity('0');
    
                // Wait for the specified interval before processing the next event
                await new Promise(resolve => setTimeout(resolve, 500));
    
                // Recursive call to process the next event
                processEvents();
            } else {
                console.log('No more events to process');
                setLatestEventsOpacity('0');
                setHideClass('')
                setShowLatestEvents(false);
                setShowSubGoal(true);
            }
        };
    
        processEvents();
    }, [latestEvents]);
    

    useEffect(() => {
        if (!showSubGoal) {
            console.log('Setting showLatestEvents to true');
            setHideClass('hide');
            getLatestEvents();
            setTimeout(() => {
                setShowLatestEvents(true);
            }, 750);
        }
    }, [showSubGoal]);


    setInterval(() => {
        console.log('Setting showSubGoal to true');
        setShowSubGoal(false);
    }, (showInterval * 60000));

    const getLatestEvents = async () => {
        try {
            const response = await fetch('/api/stream/events');
            const data = await response.json();
            console.log(data);
            setLatestEvents(data);
        } catch (error) {
            console.error('Error fetching latest events:', error);
        }
    };

    return (
        <div className='cam-widget-container' style={
            {
                height: `${containerHeight}px`
            }
        }>
            <DailySubGoal currentSubs={currentSubs} goalSubs={subGoal} hideClass={hideClass} />
            {showLatestEvents && <LatestEvents event={latestEvents[latestEventsCurrentIndex].type} displayName={latestEvents[latestEventsCurrentIndex].displayName} hideClass={latestEventsHideClass} opacity={latestEventsOpacity}/>}
        </div>
    )
}

export default CamWidget;