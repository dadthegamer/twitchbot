import React, { useState, useEffect, useRef } from 'react';
import '../../styles/overlay/tts.css';


function TTS() {
    const [imgSrc, setImgSrc] = useState('');
    const [message, setMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [ttsQueue, setTTSQueue] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const queueRef = useRef([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Connected to websocket server');
            setConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'tts') {
                queueRef.current.push({
                    text: data.payload
                });
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

    useEffect(() => {

        const processQueue = async () => {
            if (queueRef.current.length === 0) {
                return;
            }

            const next = queueRef.current.shift();
            setMessage(next.text);

            const audio = await textToSpeech(next.text);
            audio.onended = () => {
                setIsPlaying(false);
                processQueue();
            }

            setIsPlaying(true);
            audio.play();
        }

        processQueue();

    }, [isPlaying])

    // Function to reconnect to WebSocket server
    async function reconnect() {
        setInterval(() => {
            if (!connected || socket.readyState === WebSocket.CLOSED) {
                connectToWebSocketServer();
                if (connected) {
                    clearInterval();
                }
            }
        }, 5000);
    }

    function addMessage(word) {
        try {
            const words = word.split(' ');
            let i = 0;
            container.style.display = 'flex';
            const interval = setInterval(() => {
                setMessage(message.innerHTML);
                i++;
                if (i >= words.length) {
                    clearInterval(interval);
                }
            }, 200);
        }
        catch (err) {
            console.error('Error in addMessage:', err);
        }
    }

    // Function to show the message
    function showMessage(img, message) {
        try {
            setImgSrc(img);
            userImg.src = img;
            userImg.addEventListener('error', () => {
                console.log('Error loading image');
                userImg.src = 'https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png';
            });
            addMessage(message);
        }
        catch (err) {
            console.error('Error in showMessage:', err);
        }
    }

    function autoScroll() {
        const duration = 8000;

        message.scrollTo({
            top: message.scrollHeight - message.clientHeight,
            behavior: 'smooth',
            duration: duration
        });
    }

    // Function to convert text to speech by making a post request to the server
    function textToSpeech(message) {
        try {
            const audio = new Audio();
            audio.src = `/api/tts?message=${message}`;
            return audio;
        }
        catch (err) {
            console.error('Error in textToSpeech:', err);
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
