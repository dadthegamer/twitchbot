import React, { useState, useEffect } from 'react';
import '../../styles/overlay/intermission.css';
import Leaderboard from './Leaderboard';
import BottomLeft from './SubComponents/BottomLeft';


function Intermission() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertColor, setAlertColor] = useState('');
    const [month, setMonth] = useState('');
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [alertData, setAlertData] = useState({});
    const [fontColor, setFontColor] = useState('white');
    const [subsCount, setSubsCount] = useState(0);
    const [gameImg, setGameImg] = useState('https://static-cdn.jtvnw.net/ttv-boxart/512710-1548x2252.jpg');
    const [gameTitle, setGameTitle] = useState('Call Of Duty Warzone');

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
                if (data.type === 'alert') {
                    setAlertData(data.payload);
                    playAlertSound(data.payload.sound);
                    setAlertMessage(data.payload.alertMessage);
                    setAlertColor(data.payload.alertColor);
                    setFontColor(data.payload.fontColor);
                    playAlert(data.payload.alertTime);
                } else if (data.type === 'subsUpdate') {
                    setSubsCount(data.payload.monthlySubs);
                } else if (data.type === 'streamLive') {
                    // setGameImg(data.payload.streamInfo.thumbnailUrl);
                    // setGameTitle(data.payload.streamInfo.gameName);
                    console.log('Stream is live');
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

    useEffect(() => {
        getMonth();
    });

    const playAlert = (time) => {
        try {
            showTheAlert();
            setTimeout(() => {
                hideTheAlert();
            }
                , (time - 1500));
        }
        catch (err) {
            console.log(err);
        }
    };

    const showTheAlert = () => {
        try {
            if (!alertData) {
                return;
            }
            setShowAlert(true);
        }
        catch (err) {
            console.log(err);
        }
    };

    const hideTheAlert = () => {
        try {
            setShowAlert(false);
        }
        catch (err) {
            console.log(err);
        }
    }

    // Function to get the current month in a string format
    const getMonth = () => {
        const date = new Date();
        const month = date.toLocaleString('default', { month: 'long' });
        setMonth(month);
        return month;
    };

    const playAlertSound = (soundUrl) => {
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.onerror = (e) => {
                console.error('Error loading audio file:', e);
            };
            audio.play().catch((err) => {
                console.log(err);
            });
        } else {
            console.log('No alert sound to play');
        }
    };


    return (
        <div className='intermission-container'>
            <div className="intermission-monthly-subs-container">
                <span>{month} Subs</span>
                <span>{subsCount}</span>
            </div>
            <div className='intermission-left-container'>
                {/* <Leaderboard /> */}
                Leaderboard Coming Soon!
            </div>
            <div className='bottom-line-container'>
                <BottomLeft />
                <div className='bottom-line-middle-container'>
                    <div className='game-image-container'>
                        <img src={gameImg} alt="" />
                    </div>
                    <div className='bottom-line-currently-playing'>
                        <span>Currently Playing</span>
                        <span>{gameTitle}</span>
                    </div>
                    {showAlert &&
                        <div
                            className={`intermission-alert`}
                            style={{
                                backgroundColor: alertColor || 'red',
                                color: fontColor || 'white'
                            }}
                        >
                            {/* <span className='intermission-alert-display-name'>{userDisplayName}</span> */}
                            <span className='intermission-alert-message'>{alertMessage}</span>
                        </div>}
                </div>
            </div>
        </div>
    )
}

export default Intermission;