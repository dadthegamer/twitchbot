import React, { useState, useEffect } from 'react';
import '../../styles/overlay/tts.css';


function TTS() {
    const [imgSrc, setImgSrc] = useState('');
    const [message, setMessage] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [ttsQueue, setTTSQueue] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const socket = new WebSocket('ws://your-websocket-url');

        socket.onopen = () => {
            console.log('Connected to websocket server');
            setConnected(true);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'tts') {
                setTTSQueue([...ttsQueue, data.payload]);
            }
        };

        // Connection closed event
        socket.onclose = function (event) {
            console.log('Disconnected from WebSocket server');
            setConnected(false);
        };

        return () => {
            socket.close();
        }
    }, []);

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
    async function textToSpeech(message) {
        try {
            const res = await fetch(`http://${serverip}:${serverPort}/api/tts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            const audio = await res.blob();
            return new Audio(URL.createObjectURL(audio));
        }
        catch (err) {
            console.error('Error in textToSpeech:', err);
        }
    }

    // Queue handler
    useEffect(() => {
        if (ttsQueue.length > 0 && !isPlaying) {
            setIsPlaying(true);
            const data = audioQueue.shift();
            const { message, imgSrc } = data;
            const audio = await textToSpeech(data.message);
            audio.play();
            showMessage(imgSrc, message);
            audio.onended = () => {
                console.log('Audio ended');
                setTimeout(() => {
                    container.style.display = 'none';
                    setIsPlaying(false);
                    if (ttsQueue.length > 0) {
                        setIsPlaying(false);
                    }
                }, 5000);
            }
        }
    }, [ttsQueue, isPlaying]);

    return (
        <div className="tts-container">
            <img id="img" src={imgSrc} alt=""></img>
            <span id="message">{message}</span>
        </div>
    );
}