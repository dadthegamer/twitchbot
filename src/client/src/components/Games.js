import React, { useState, useEffect } from 'react';
import '../styles/GUI/games.css';

function Games() {
    const [percentValue, setPercentValue] = useState(50);
    const [jackpotData, setJackpotData] = useState({});
    const [jackpot, setJackpot] = useState(0);

    const handlePCTChange = (e) => {
        setPercentValue(e.target.value);
    }

    useEffect(() => {
        // Get the jackpot data from the server
        fetch("/api/games/jackpot")
            .then((res) => res.json())
            .then((data) => {
                // Update the state with the jackpot data
                setJackpotData(data);
                setPercentValue(data.jackpotPCT);
                setJackpot(data.jackpot);
            });
    }
        , []);

    const handleInputChange = (e) => {
        setJackpot(e.target.value);
        // Make a put request to the server to update the jackpot
        const res = fetch("/api/games/jackpot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ jackpot: e.target.value })
        })
    }


    return (
        <div className="content">
            <div className="games-main-container">
                <div className="game">
                    <div className="game-info">
                        <h2>Spin</h2>
                    </div>
                    <div className="spin-details">
                        <label htmlFor="">Currency</label>
                        <select name="" id="">
                            <option value="">Points</option>
                            <option value="">Coins</option>
                        </select>
                        <label htmlFor="">Jackpot</label>
                        <input type="text" placeholder="set the value of the jackpot" value={jackpot} onChange={handleInputChange} />
                        <div>
                            <div>
                                <label htmlFor="">Minimum</label>
                                <input type="text" />
                            </div>
                            <div>
                                <label htmlFor="">Minimum</label>
                                <input type="text" />
                            </div>
                        </div>
                        <label htmlFor="">Win Percentage</label>
                        <div className="range-slider-div">
                            <input type="range" min="1" max="100" step="1" onChange={handlePCTChange} value={percentValue} />
                            <span className="range-slider-value">{percentValue}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Games;