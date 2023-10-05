import React, { useState, useEffect } from 'react';
import '../../styles/overlay/cam.css';

function CamOverlay() {
    const [showAlert, setShowAlert] = useState(false);
    const [showAlertDetails, setShowAlertDetails] = useState(false);
    const [alertData, setAlertData] = useState({});
    const [connected, setConnected] = useState(false);
    const [userName, setUserName] = useState('DadTheGam3r');
    const [alertDisplayName, setAlertDisplayName] = useState('DadTheGam3r');
    const [alertIMG, setAlertIMG] = useState('https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png');
    const [alertMSG, setAlertMSG] = useState('has followed!');
    const [alertType, setAlertType] = useState('follower');
    const [animationDirection, setAnimationDirection] = useState('normal');
    const [animationDirection2, setAnimationDirection2] = useState('normal');
    const [alertColor, setAlertColor] = useState('black');
    const [fontColor, setFontColor] = useState('white');
    const [subsCount, setSubsCount] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Function to initiate the WebSocket connection
        const connect = () => {
            const ws = new WebSocket('ws://localhost:8080');

            ws.onopen = () => {
                console.log('Connected to websocket server');
                setConnected(true);
                setSocket(ws);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'alert') {
                    setAlertData(data.payload);
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



    useEffect(() => {
        // Function to animate the username
        const animateUsername = () => {
            const usernameElement = document.getElementById('username');
            usernameElement.textContent = ''; // Clear the username

            const usernameText = userName;
            let index = 0;

            const intervalId = setInterval(() => {
                if (index < usernameText.length) {
                    usernameElement.textContent += usernameText[index];
                    index++;
                } else {
                    clearInterval(intervalId);
                }
            }, 100); // Adjust the speed of animation by changing the interval duration (in milliseconds)
        };

        // Call the animateUsername function initially
        animateUsername();

        // Call the animateUsername function every 10 seconds
        const intervalId = setInterval(() => {
            animateUsername();
        }, 10000); // 10 seconds in milliseconds

        // Clear the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [userName]);

    useEffect(() => {
        // show the alert after 2 seconds of page load then hide it after 5 seconds
        setTimeout(() => {
            showTheAlert();
            setTimeout(() => {
                hideTheAlert();
            }, 5000);
        }, 2000);
    }, []);

    const showTheAlert = () => {
        setAlertColorBasedOnAlertType('donation');
        playAlertSound('/audio/cheer.mp3');
        animateSubsCount(100);
        setShowAlert(true);
        setAnimationDirection('normal');
        setAnimationDirection2('normal');

        setTimeout(() => {
            setShowAlertDetails(true);
        }, 500);
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
                setAlertColor('black');
            }, 500); // Assuming 500ms for the exit animation, adjust as needed
        }, 500); // Again assuming 500ms for the exit animation
    }

    // Function to set the alert color based on the alert type
    const setAlertColorBasedOnAlertType = (alertType) => {
        switch (alertType) {
            case 'sub':
                setAlertColor('blue');
                setFontColor('white');
                break;
            case 'resub':
                setAlertColor('blue');
                setFontColor('white');
                break;
            case 'giftedsub':
                setAlertColor('#44a6c6');
                setFontColor('black');
                break;
            case 'raid':
                setAlertColor('#FFC000');
                setFontColor('black');
                break;
            case 'follow':
                setAlertColor('#FFEA00');
                setFontColor('black');
                break;
            case 'cheer':
                setAlertColor('#9146FF');
                setFontColor('white');
                break;
            case 'donation':
                setAlertColor('#118c4f');
                setFontColor('white');
                break;
            default:
                setAlertColor('#9146FF');
                setFontColor('white');
                break;
        }
    }

    // Function to animate the subs count from the current value to the new value
    const animateSubsCount = (newSubsCount) => {
        const increment = subsCount < newSubsCount ? 1 : -1;  // Determine direction

        const intervalId = setInterval(() => {
            setSubsCount((prev) => {
                if ((increment > 0 && prev < newSubsCount) || (increment < 0 && prev > newSubsCount)) {
                    return prev + increment;
                } else {
                    clearInterval(intervalId);
                    return newSubsCount;  // Ensure we set the exact final value
                }
            });
        }, 50);  // Adjust this interval for faster/slower counting
    };

    // Function to play the alert sound
    const playAlertSound = (audio) => {
        const newAudio = new Audio(audio);
        newAudio.play();

        return () => {
            newAudio.pause();
            newAudio.remove();
        };
    };

    return (
        <div className="cam-container">
            <div className="cam-inner" style={{
                borderColor: alertColor,
            }}>
                <div className="cam-username">
                    <span id='username'></span>
                </div>
                <div className="top-accent">
                    <div className="rectangle" style={{
                        backgroundColor: alertColor,
                    }}></div>
                    <div className="triangle triangle-1" style={{
                        borderColor: alertColor,
                    }}></div>
                    <div className="triangle triangle-2" style={{
                        borderColor: alertColor,
                    }}></div>
                </div>
                <div className="bottom-accent">
                    <div className="rectangle" style={{
                        backgroundColor: alertColor,
                    }}></div>
                    <div className="triangle triangle-1" style={{
                        borderColor: alertColor,
                    }}></div>
                    <div className="triangle triangle-2" style={{
                        borderColor: alertColor,
                    }}></div>
                </div>
                <div className="monthly-subs-container">
                    <span>MONTHLY SUBS</span>
                    <span id='subs'>{subsCount}</span>
                </div>
            </div>
            {showAlert && (
                <div className={`alert-container`}>
                    <div className={`alert-type ${animationDirection2 === 'normal' ? 'slideDown' : 'slideUp'}`} style={{
                        backgroundColor: alertColor,
                        color: fontColor,
                    }}>
                        <span>New</span>
                        <span>{alertType}</span>
                    </div>
                    {showAlertDetails && (
                        <div className={`alert-details ${animationDirection === 'normal' ? 'slideRight' : 'slideLeft'}`}>
                            <div className='alert-details-inner' style={{
                                animationDirection: animationDirection, // Apply animation direction here
                            }}>
                                <span id='alert-username'>{alertDisplayName}</span>
                                <span id='alert-message'>{alertMSG}</span>
                            </div>
                            <div className="img-container">
                                <img src={alertIMG} alt="" />
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default CamOverlay;