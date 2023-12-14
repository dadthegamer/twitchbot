import React, { useState, useEffect } from 'react';
import '../../styles/overlay/intermission.css';
import Leaderboard from './Leaderboard';

function Intermission() {

    return (
        <div className='intermission-container'>
            <div className='intermission-leaderboard'>
            </div>
            <div className='bottom-line-container'>
                <span>Test</span>
            </div>
        </div>
    )
}

export default Intermission;