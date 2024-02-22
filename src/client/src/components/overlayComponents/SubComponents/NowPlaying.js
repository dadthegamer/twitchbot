import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function NowPlaying() {
    const [showSpotify, setShowSpotify] = useState(true);
    const [artist, setArtist] = useState('');
    const [song, setSong] = useState('');
    const [albumArtwork, setAlbumArtwork] = useState('');
    const [showCard, setShowCard] = useState(true);


    useEffect(() => {
        // Get the commands from the server. Then get a random command and description of a command that is enabled
        fetch('/api/spotify')
            .then((res) => res.json())
            .then((data) => {
                if (data === null) {
                    setShowSpotify(false);
                } else {
                    setArtist(data.item.artists[0].name);
                    setSong(data.item.name);
                    setAlbumArtwork(data.albumArtwork);
                }
            });
    }, []);

    return (
        <div className='bottom-left-card' style={{ backgroundColor: '#FF0000' }}>
            {showCard && (
                <>
                    <span className='bottom-left-label'>Currently Playing</span>
                    <div className='spotify-bottom-left-container'>
                        <span>{artist}</span>
                        <span>{song}</span>
                    </div>
                </>
            )}
        </div>
    );

}

export default NowPlaying;