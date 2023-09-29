import React, { useState, useEffect } from 'react';
import '../styles/GUI/games.css';

function Games() {
    const [percentValue, setPercentValue] = useState(50);

    const handlePCTChange = (e) => {
        setPercentValue(e.target.value);
    }


    return (
        <div className="content">
            <div className="games-main-container">
                <div className="game">
                    <div className="game-info">
                        <h2>Spin</h2>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" />
                            <label className="switch" htmlFor={`toggle-currency-checkbox}`}>
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className="spin-details">
                        <label htmlFor="">Currency</label>
                        <select name="" id="">
                            <option value="">Points</option>
                            <option value="">Coins</option>
                        </select>
                        <label htmlFor="">Jackpot</label>
                        <input type="text" placeholder="100" />
                        <label htmlFor="">Win Percentage</label>
                        <div className="range-slider-div">
                            <input type="range" min="1" max="100" step="1" onChange={handlePCTChange}/>
                            <span className="range-slider-value">{percentValue}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Games;