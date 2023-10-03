import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift, faStar, faBolt, faHeart, faGem, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import '../../styles/alert.css';


function Alert() {
    const [userDisplayName, setUserDisplayName] = useState(null);
    const [userImg, setUserImg] = useState(null);
    const [alertType, setAlertType] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    const [connected, setConnected] = useState(false);
    const [alertIcon, setAlertIcon] = useState(null);

    const playAudio = (url) => {
        new Audio(url).play();
    };

    useEffect(() => {
        const socket = new WebSocket('ws://your-websocket-url');

        socket.onopen = () => {
            console.log('Connected to websocket server');
            setConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'alert') {
                showAlert(data.payload);
            }
        };

        // Connection closed event
        socket.onclose = function (event) {
            console.log('Disconnected from WebSocket server');
            setConnected(false);
            reconnect();
        };

        return () => {
            socket.close();
        }
    }, []);

    // Function to show the icon based on the alert type
    function showIcon(alertType) {
        switch (alertType) {
            case 'sub':
                setAlertIcon(<FontAwesomeIcon icon={faStar} />);
                break;
            case 'resub':
                setAlertIcon(<FontAwesomeIcon icon={faStar} />);
                break;
            case 'giftedsub':
                setAlertIcon(<FontAwesomeIcon icon={faGift} />);
                break;
            case 'raid':
                setAlertIcon(<FontAwesomeIcon icon={faBolt} />);
                break;
            case 'follow':
                setAlertIcon(<FontAwesomeIcon icon={faHeart} />);
                break;
            case 'cheer':
                setAlertIcon(<FontAwesomeIcon icon={faGem} />);
                break;
            case 'donation':
                setAlertIcon(<FontAwesomeIcon icon={faDollarSign} />);
                break;
            default:
                setAlertIcon(<FontAwesomeIcon icon={faStar} />);
                break;
        }
    }

    function showAlert(data) {
        setAlertType(data.alertType);
        setAlertMessage(data.alertMessage);
        setUserImg(data.userImg);
        showIcon(data.alertType);
        setShowAlert(true);
        if (data.sound) {
            playAudio(data.sound);
        }
        setTimeout(() => {
            setShowAlert(false);
        }, (data.alertTime - 500));
    }

    // Function to reconnect to WebSocket server
    async function reconnect() {
        const intervalId = setInterval(() => {
            if (!connected || socket.readyState === WebSocket.CLOSED) {
                connectToWebSocketServer();
                if (connected) {
                    clearInterval(intervalId);
                }
            }
        }, 5000);
    }

    return (
        <>
            {showAlert && (
                <div className={`alert-container`}>
                    <div className="img-container">
                        <img src={userImg} alt={userDisplayName} />
                    </div>
                    <div className="alert-details">
                        <div className="alert-icon">{alertIcon}</div>
                        <div className="alert-details-inner">
                            <span className="alert-type">{alertType}</span>
                            <span className="alert-info">{alertMessage}</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Alert;