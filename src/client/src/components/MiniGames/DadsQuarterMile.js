import React, { useState, useEffect } from 'react';
import '../../styles/miniGames/quarterMile.css';


function QuarterMile() {
    const [startGame, setStartGame] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState('');
    const [users, setUsers] = useState([]);
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [timer, setTimer] = useState(3);


    const wsurl = process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:8080';

    useEffect(() => {
        const establishConnection = () => {
            const ws = new WebSocket(wsurl);

            ws.onopen = () => {
                console.log('Connected to websocket server');
                setConnected(true);
                setSocket(ws);
                // startTimer();
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === 'miniGameUser') {
                    console.log('Adding user to game:', data.payload);
                    // Add a position property to the user
                    data.payload.position = 0;
                    setUsers(prevUsers => [...prevUsers, { ...data.payload }]);
                    startTimer();
                } else if (data.type === 'startGame') {
                    setStartGame(true);
                } else if (data.type === 'resetGame') {
                    setStartGame(false);
                    setGameOver(false);
                    setWinner('');
                    setUsers([]);
                    setTimer(3);
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

    const playSound = (soundUrl) => {
        if (soundUrl) {
            const audio = new Audio(soundUrl);
            audio.onerror = (e) => {
                console.error('Error loading audio file:', e);
            };
            audio.play().catch((err) => {
                console.log(err);
            });
        } else {
            console.log('No sound to play');
        }
    };

    const startTimer = () => {
        const intervalId = setInterval(() => {
            playSound(process.env.PUBLIC_URL + '/beep.mp3');
            setTimer((prevTimer) => {
                if (prevTimer === 1) {
                    startRace();
                    setTimer(null);
                    clearInterval(intervalId);
                    setStartGame(true);
                    return 0;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    // Method to send the winner to the server
    const sendWinner = (winner) => {
        if (socket) {
            socket.send(JSON.stringify({ type: 'miniGameWinner', game: 'Dads Quarter Mile', payload: winner }));
        }
    };

    // Function to start the race. Move all the cars. Check every .1 seconds to see if a car has stopped. If a car has stopped then move the car again
    const startRace = () => {
        setStartGame(true);
        const raceInterval = setInterval(() => {
            if (!gameOver) {
                setUsers(currentUsers =>
                    currentUsers.map(user => {
                        const finishLine = 1845;
                        let newPosition = user.position + Math.floor(Math.random() * 10);
                        let newSpeed = Math.random() * 1;
                        newPosition = newPosition > finishLine ? finishLine : newPosition;
                        return { ...user, position: newPosition, speed: newSpeed };
                    })
                );
            } else {
                clearInterval(raceInterval);
            }
        }, 100);
    };

    // useEffect hook to check for a winner after users state is updated
    useEffect(() => {
        const winningUser = users.find(user => user.position >= 1845);
        if (winningUser && !gameOver) {
            setGameOver(true);
            setWinner(winningUser);
            sendWinner(winningUser);
        }
    }, [users, gameOver]);

    // Function to generate a random color
    const randomColor = () => {
        const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
        return color;
    };

    return (
        <div>
            <h1>Dads Quarter Mile</h1>
            <div className='quarter-mile-winner-container'>
                {gameOver && <div className='quarter-mile-winner'>
                <img src={winner.profilePic} alt="" />
                    <h2>{winner.displayName}</h2>
                    <h2>WINS!</h2>
                </div>}
            </div>
            <img src={process.env.PUBLIC_URL + '/mini-games-logo.png'} alt="" className='mini-games-logo' />
            <h1 className='quarter-mile-timer'>{timer}</h1>
            <div className='quarter-mile-container'>
                {users.map((user, i) => {
                    return (
                        <div key={i} className='quarter-mile-user-container' data-user-id={user.userId}>
                            <h2 className='quarter-mile-user-display-name'>{user.displayName}</h2>
                            <div className='road-white-lines-container'>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                                <span className='road-white-lines'></span>
                            </div>
                            <div className='user-car-container' style={
                                {
                                    transform: `translateX(${user.position}px)`,
                                    transition: `transform ${user.speed}s`,
                                }
                            }>
                                <div className='user-car' style={
                                    {
                                        backgroundColor: user.color || randomColor(),
                                    }
                                }></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}


export default QuarterMile;