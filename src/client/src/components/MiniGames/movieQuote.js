import React, { useState, useEffect, useRef } from 'react';
import '../../styles/miniGames/movieQuote.css';


function MovieQuote() {
    const [answer, setAnswer] = useState('');
    const [movieQuote, setMovieQuote] = useState('');
    const [options, setOptions] = useState([]);
    const [timer, setTimer] = useState(10);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [players, setPlayers] = useState([]);
    const [currentPlayers, setCurrentPlayers] = useState([]);
    const [showQuote, setShowQuote] = useState(true);
    const [showAnswer, setShowAnswer] = useState(false);
    const [data, setData] = useState({});
    const [gameSettings, setGameSettings] = useState({});
    const [revealAnswer, setRevealAnswer] = useState(false);
    const [correctAnswerLetter, setCorrectAnswerLetter] = useState('');
    const [isFetching, setIsFetching] = useState(false);

    const dataRef = useRef({});
    const gameRef = useRef({});
    const currentPlayersRef = useRef(currentPlayers);
    const timerRef = useRef(timer);
    const timerIdRef = useRef(null);

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
                console.log('Received:', data);
                if (data.type === 'twitchChatMessage') {
                    checkAnswer(data.payload.message, data.payload.userId, data.payload.displayName);
                } else if (data.type === 'startGame') {
                    console.log('Starting game');
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
        timerRef.current = timer;
    }, [timer]);


    // UseEffect to get the game settings from the server
    useEffect(() => {
        const getGameSettings = async () => {
            const response = await fetch('/api/games');
            // Find the movie quote game
            const game = (await response.json()).find((g) => g.game === 'Movie Quote Game');
            console.log(game);
            if (game) {
                gameRef.current = game;
            }
        }
        getGameSettings();
    }, []);

    useEffect(() => {
        // Get a new movie quote. Make sure it is a different quote than the previous one
        getMovieQuote().then((data) => {
            setMovieQuote(data.quote);
            setOptions(data.options);
        });

    }, []);

    useEffect(() => {
        currentPlayersRef.current = currentPlayers;
    }, [currentPlayers]);

    // Function to send a post request to the server to reward ta user with points
    const rewardUser = async (userId, value) => {
        const response = await fetch('/api/currency/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.REACT_APP_API_KEY
            },
            body: JSON.stringify({ userId, value, currencyName: gameRef.current.currency, update: 'add' }),
        });

        const data = await response.json();
        console.log(data);
    };


    // Function to get a random movie quote from the server
    const getMovieQuote = async () => {
        if (!isFetching) {
            setIsFetching(true);
            const response = await fetch('/api/games/movie-quote');
            const data = await response.json();
            setData(data);
            dataRef.current = data;
            setCorrectAnswerLetter(data.answerLetter);
            setTimeout(() => {
                startTimer();
                setIsFetching(false);
            }, 1000);
            return data;
        }
    };

    // Function to check if a users answer is correct. The answers will be a, b, c, or d
    const checkAnswer = (answer, userId, displayName) => {
        const currentData = dataRef.current;
        if (timerRef.current === 0) {
            console.log('Time is up');
            return;
        } else {
            // Check if the user has already submitted an answer for the current question
            if (!currentPlayersRef.current.includes(userId)) {
                if (currentData && currentData.answerLetter && answer.toLowerCase() === currentData.answerLetter.toLowerCase()) {
                    console.log('Correct answer from user:', displayName);
                    const amount = gameRef.current.perQuestion;
                    rewardUser(userId, amount);

                    setPlayers((prevPlayers) => {
                        const playerIndex = prevPlayers.findIndex((player) => player.userId.toString() === userId.toString());

                        if (playerIndex !== -1) {
                            // Player exists, update their score
                            return prevPlayers.map((player, index) => {
                                if (index === playerIndex) {
                                    return { ...player, score: player.score + amount };
                                }
                                return player;
                            });
                        } else {
                            // Player doesn't exist, add them to the players array
                            return [...prevPlayers, { userId, displayName, score: amount }];
                        }
                    });
                }

                // Regardless of the answer being correct or not, add the user to currentPlayers to prevent multiple answers
                setCurrentPlayers((prevCurrentPlayers) => [...prevCurrentPlayers, userId]);
            } else {
                console.log('User has already submitted an answer for this question:', displayName);
            }
        }
    };

    // Function to start the timer
    const startTimer = () => {
        if (timerIdRef.current) {
            clearInterval(timerIdRef.current);
        }
        setShowQuote(true);
        let time = 10;
        setTimer(time);
        timerIdRef.current = setInterval(() => {
            time--;
            setTimer(time);
            if (time === 0) {
                clearInterval(timerIdRef.current);
                setTimeout(() => {
                    setRevealAnswer(true);
                }, 500);
                setTimeout(() => {
                    setShowQuote(false);
                    setRevealAnswer(false);
                    getMovieQuote().then((data) => {
                        setMovieQuote(data.quote);
                        setOptions(data.options);
                    });
                    setCurrentPlayers([]);
                }, 5000);
            }
        }, 1000);
    };

    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="movie-quote">
            <img src={process.env.PUBLIC_URL + '/mini-games-logo.png'} alt="" className='mini-games-logo' />
            <div className="movie-quote-container">
                {showQuote && <span className='movie-quote-timer'>{timer}</span>}
                {showQuote && <h2 id='movie-quote'>"{movieQuote}"</h2>}
                {showQuote && <div className="movie-quote-options">
                    {options.map((option, index) => (
                        <div key={index} className={`movie-quote-option ${revealAnswer && option.letter === correctAnswerLetter ? 'correct-answer' : ''}`}>
                            <div>
                                <span>{option.letter}</span>
                                <span>:</span>
                            </div>
                            <span>{option.option}</span>
                        </div>
                    ))}
                </div>}
            </div>
            <div className="movie-quote-leaderboard">
                <h2>LEADERBOARD</h2>
                <div className='movie-quote-leaderboard-container'>
                    {sortedPlayers.map((player, index) => (
                        <div key={index} className="movie-quote-leaderboard-entry">
                            <span className="player-display-name">{player.displayName}</span>
                            <span className="player-score">{player.score}</span>
                        </div>
                    ))}
                </div>
                <span className='movie-quote-payout-info'>Earn {gameRef.current.perQuestion} {gameRef.current.currency} points per correct answer</span>
            </div>
        </div>
    );
}


export default MovieQuote;