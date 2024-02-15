import React, { useState, useEffect } from 'react';
import '../../styles/miniGames/movieQuote.css';


function MovieQuote() {
    const [answer, setAnswer] = useState('');
    const [movieQuote, setMovieQuote] = useState('');
    const [options, setOptions] = useState([]);
    const [timer, setTimer] = useState(10);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);
    const [showQuote, setShowQuote] = useState(false);
    const [showAnswer, setShowAnswer] = useState(false);
    const [data, setData] = useState({});
    const [gameSettings, setGameSettings] = useState({});

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
                if (data.type === 'twitchChatMessage') {
                    // Check if  the player is already in the list
                    const player = players.find((p) => p.userId === data.userId);
                    if (!player) {
                        setPlayers((prev) => [...prev, { userId: data.userId, displayName: data.displayName, score: 0 }]);
                    } else {
                        // Check if the answer is correct
                        checkAnswer(data.message, data.userId);
                    }
                } else if (data.type === 'startGame') {
                    setStartGame(true);
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

    // UseEffect to get the game settings from the server
    useEffect(() => {
        const getGameSettings = async () => {
            const response = await fetch('/api/games');
            const data = await response.json();
            setGameSettings(data);
        }
        getGameSettings();
    }, []);

    useEffect(() => {
        // Get a new movie quote. Make sure it is a different quote than the previous one
        if (showQuote) {
            getMovieQuote().then((data) => {
                setMovieQuote(data.quote);
                setOptions(data.options);
            });
        }

    }, [showQuote]);

    // Function to send a post request to the server to reward ta user with points
    const rewardUser = async (userId, value) => {
        const response = await fetch('/api/points/reward', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, value, currencyName: gameSettings.currency, update: 'add' }),
        });

        const data = await response.json();
        console.log(data);
    };


    // Function to get a random movie quote from the server
    const getMovieQuote = async () => {
        const response = await fetch('/api/games/movie-quote');
        const data = await response.json();
        return data;
    };

    // Function to check if a users answer is correct. The answers will be a, b, c, or d
    const checkAnswer = (answer, userId) => {
        if (answer.toLowerCase() === data.answerLetter.toLowerCase()) {
            console.log('Correct');
            const player = players.find((p) => p.userId === userId);
            if (player) {
                player.score += gameSettings.perQuestion;
                setPlayers([...players]);
                rewardUser(userId, gameSettings.perQuestion);
            }
        }
    };

    // Function to start the timer
    const startTimer = () => {
        let time = 10;
        const intervalId = setInterval(() => {
            time--;
            setTimer(time);
            if (time === 0) {
                clearInterval(intervalId);
            }
        }, 1000);
    };
}


export default MovieQuote;