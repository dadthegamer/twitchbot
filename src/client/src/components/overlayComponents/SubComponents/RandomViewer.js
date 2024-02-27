import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function RandomViewer() {
    const [randomViewer, setRandomViewer] = useState('Random Viewer');

    useEffect(() => {
        fetch('/api/stream/viewers')
            .then((res) => res.json())
            .then((data) => {
                // Get a random viewer from the list of viewers
                const randomViewer = data[Math.floor(Math.random() * data.length)];
                if (randomViewer) {
                    setRandomViewer(randomViewer.userDisplayName);
                }
            });
    }, []);

    return (
        <div className='bottom-left-card' style={{ backgroundColor: '#E5E5E5' }}>
            <span className='random-viewer-bottom-left-container'>Thank you {randomViewer} for supporting the stream!</span>
        </div>
    );
}

export default RandomViewer;