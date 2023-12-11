import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/tts.css';


function TextToSpeech() {
    const [imgSrc, setImgSrc] = useState('https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png');
    const [message, setMessage] = useState('test message');
    const [isPlaying, setIsPlaying] = useState(false);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const queueRef = useRef([]);

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
                if (data.type === 'tts') {
                    console.log('Received message:', data);
                    queueRef.current.push({
                        text: data.payload.message,
                        img: data.payload.img,
                    });
                }
                if (!isPlaying) {
                    playNextMessage();
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

    const playNextMessage = () => {
        if (queueRef.current.length === 0) {
            setIsPlaying(false);
            setMessage('');
            setImgSrc('');
            return;
        }

        const next = queueRef.current.shift();
        setMessage(next.text);
        setImgSrc(next.img);
        getAudioStream(next.text);
    };

    // Function to make a request to the server to get the audio stream
    const getAudioStream = async (message) => {
        try {
            const res = await fetch(`/api/tts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': process.env.REACT_APP_API_KEY
                },
                body: JSON.stringify({ message })
            });
            const blob = await res.blob();
            const audio = new Audio();
            audio.src = URL.createObjectURL(blob);
            audio.onended = () => {
                setTimeout(() => {
                    const container = document.querySelector('.tts-container');
                    container.style.animation = 'slideDown 0.25s ease-in-out forwards';
                    setTimeout(() => {
                        playNextMessage();
                    }, 500);
                }, 2500);
            };
            audio.onplay = () => {
                setIsPlaying(true);
            };
            // Handle errors
            audio.onerror = (err) => {
                console.error('Error in getAudioStream:', err);
                playNextMessage();
            };
            audio.play();
            return audio;
        }
        catch (err) {
            console.error('Error in getAudioStream:', err);
        }
    }

    return (
        <>
            {isPlaying && (
                <div className="tts-container">
                    <img id="img" src={imgSrc} alt=""></img>
                    <span id="message">{message}</span>
                </div>
            )}
        </>
    );
}

export default TextToSpeech;
