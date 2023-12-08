import React, { useState, useEffect } from 'react';
import '../../styles/overlay/cam.css';


function CamOverlay() {
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDetails, setShowAlertDetails] = useState(false);
    const [alertData, setAlertData] = useState({});
    const [connected, setConnected] = useState(false);
    const [animationDirection, setAnimationDirection] = useState('normal');
    const [animationDirection2, setAnimationDirection2] = useState('normal');
    const [alertColor, setAlertColor] = useState('#111111');
    const [fontColor, setFontColor] = useState('white');
    const [subsCount, setSubsCount] = useState(0);
    const [displayAlertType, setDisplayAlertType] = useState(null);
    const [socket, setSocket] = useState(null);
    const [alertMessage, setAlertMessage] = useState('');

    // Get the websocket connection url from the environment variables if there is one if not use the default one
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
                    console.log(data.payload);
                    setAlertData(data.payload);
                    playAlert(data.payload.alertTime);
                    playAlertSound(data.payload.sound);
                    setAlertMessage(data.payload.alertMessage);
                } else if (data.type === 'subsUpdate') {
                    setSubsCount(data.payload.monthlySubs);
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
            setAlertColorBasedOnAlertType(alertData.alertType);
            setShowAlert(true);
            setAnimationDirection('normal');
            setAnimationDirection2('normal');
    
            setTimeout(() => {
                setShowAlertDetails(true);
            }, 500);
        }
        catch (err) {
            console.log(err);
        }
    };

    // Function to hide the alert
    const hideTheAlert = () => {
        // Apply the exit animation for the alert-details
        setAnimationDirection('reverse');

        // Use a timeout to wait for the exit animation to finish
        setTimeout(() => {
            setAnimationDirection2('reverse');
            setShowAlertDetails(true);
            // Further wait to hide the entire alert-container after alert-details has exited
            setTimeout(() => {
                setShowAlert(true);
                setAlertColor('#111111');
            }, 500); // Assuming 500ms for the exit animation, adjust as needed
        }, 500); // Again assuming 500ms for the exit animation
    }

    // Function to set the alert color based on the alert type
    const setAlertColorBasedOnAlertType = (alertType) => {
        switch (alertType) {
            case 'sub':
                setDisplayAlertType('Subscriber');
                setAlertColor('blue');
                setFontColor('white');
                break;
            case 'resub':
                setDisplayAlertType('re-Subscriber');
                setAlertColor('blue');
                setFontColor('white');
                break;
            case 'giftedSub':
                setDisplayAlertType('Gifted Sub');
                setAlertColor('#44a6c6');
                setFontColor('black');
                break;
            case 'raid':
                setDisplayAlertType('Raid');
                setAlertColor('#FFC000');
                setFontColor('black');
                break;
            case 'follow':
                setDisplayAlertType('Follower');
                setAlertColor('#FFEA00');
                setFontColor('black');
                break;
            case 'cheer':
                setDisplayAlertType('Cheer');
                setAlertColor('#9146FF');
                setFontColor('white');
                break;
            case 'donation':
                setDisplayAlertType('Donation');
                setAlertColor('#118c4f');
                setFontColor('white');
                break;
            default:
                setDisplayAlertType('Alert');
                setAlertColor('#9146FF');
                setFontColor('white');
                break;
        }
    }

    // Function to play the alert sound
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
        <div className="cam-container">
            <div className="cam-inner" style={{
                borderColor: alertColor,
                backgroundColor: 'transparent',
            }}>
            </div>
            {showAlert && (
                <div className={`alert-container`}>
                    <div className={`alert-type ${animationDirection2 === 'normal' ? 'slideDown' : 'slideUp'}`} style={{
                        backgroundColor: alertColor,
                        color: fontColor,
                    }}>
                        <span>New</span>
                        <span>{displayAlertType}</span>
                    </div>
                    {showAlertDetails && (
                        <div className={`alert-details ${animationDirection === 'normal' ? 'slideRight' : 'slideLeft'}`}>
                            <div className='alert-details-inner' style={{
                                animationDirection: animationDirection, // Apply animation direction here
                            }}>
                                <span id='alert-message'>{alertMessage}</span>
                            </div>
                            {/* <div className="img-container">
                                <img src={alertData.profileImg} alt="" />
                            </div> */}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CamOverlay;