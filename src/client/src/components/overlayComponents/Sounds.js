import React, { useState, useEffect } from 'react';


function Sounds() {
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Establish a queue of sounds to play
    const queueRef = useRef([]);

    const wsurl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';

    // Queue handler. Plays the next sound in the queue if there is one. Checks the queue every 100ms.
    useEffect(() => {
        const intervalId = setInterval(() => {
            if (!isPlaying && queueRef.current.length > 0) {
                playNextSound();
            }
        }, 100);

        return () => {
            clearInterval(intervalId);
        };
    }, [isPlaying]);

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
                if (data.type === 'sound') {
                    if (!isPlaying) {
                        setIsPlaying(true);
                        playSound(data.payload.soundUrl)
                    } else {
                        queueRef.current.push({
                            soundUrl: data.payload.soundUrl,
                        });
                    }
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

    // Function to play the alert sound
    const playSound = (soundUrl) => {
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.onplay = () => {
                setIsPlaying(true);
            };
            audio.onerror = (e) => {
                console.error('Error loading audio file:', e);
            };
            audio.play().catch((err) => {
                console.log(err);
            });
            audio.onended = () => {
                setIsPlaying(false);
            };
            audio.play();
        } else {
            console.log('No alert sound to play');
        }
    };

    // Function to play the next sound in the queue
    const playNextSound = () => {
        if (queueRef.current.length === 0) {
            setIsPlaying(false);
            return;
        }
        const next = queueRef.current.shift();
        playSound(next.soundUrl);
    };

    return (
        <>
            {isPlaying && (
                <div className="sound-container">
                </div>
            )}
        </>
    );
}