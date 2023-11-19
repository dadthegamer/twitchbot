import React, { useState, useEffect } from 'react';
import '../../styles/overlay/progressBar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGift } from '@fortawesome/free-solid-svg-icons';


function Outcome({ outcomeData }) {
    let color = 'white';

    if (outcomeData.color === 'blue') {
        color = '#387ae1';
    } else if (outcomeData.color === 'pink') {
        color = '#f5009b';
    }

    return (
        <div className="outcome" data-outcome-id={outcomeData.id}>
            <div className="inner-outcome" style={{ color }}>
                <span className="outcome-title">{outcomeData.title}</span>
                <div className="pct-container">
                    <span className="pct" style={{ color }}>0</span>
                    <span>%</span>
                </div>
            </div>
            <div className="progress-bar-container">
                <div className="progress-bar" style={{ backgroundColor: color !== 'white' ? color : undefined }}></div>
            </div>
        </div>
    )
}

export default Outcome;