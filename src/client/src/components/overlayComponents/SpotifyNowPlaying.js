import React, { useState, useEffect } from 'react';
import '../../styles/overlay/spotifyWidget.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';


function SpotifyNowPlaying() {
    const [showSpotify, setShowSpotify] = useState(true);
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');
    const [albumArtwork, setAlbumArtwork] = useState('');
    const [connected, setConnected] = useState(false);
    const [socket, setSocket] = useState(null);
    const [hideClass, setHideClass] = useState('');


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
                if (data.type === 'spotify') {
                    console.log('Spotify data:', data.payload.data);
                    setArtist(data.payload.data.item.artists[0].name);
                    setSong(data.payload.data.item.name);
                    setAlbumArtwork(data.payload.data.item.album.images[0].url);
                    toggleWidget();
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

    // Function to show/hide the widget
    const toggleWidget = () => {
        setShowSpotify(!showSpotify);
        setTimeout(() => {
            setHideClass('hide-spotify');
            setInterval(() => {
                setShowSpotify(false);
                setHideClass('');
            }, 500);
        }, 5000);
    };

    return (
        <>
            {showSpotify &&
                <div className={`intermission-spotify-container ${hideClass}`}>
                    <img src={albumArtwork} alt="Album Artwork" />
                    <div className='intermission-spotify-info'>
                        <span>{artist}</span>
                        <span>{song}</span>
                    </div>
                </div>}
        </>
    )
}

export default SpotifyNowPlaying;