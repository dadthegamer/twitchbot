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
            <div className='random-viewer-bottom-left-container'>
                <span className='random-viewer'>Thank you {randomViewer} for supporting the stream!</span>
            </div>
        </div>
    );
}

export default RandomViewer;