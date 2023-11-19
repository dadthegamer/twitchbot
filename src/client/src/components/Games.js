import React, { useState, useEffect } from 'react';
import '../styles/GUI/games.css';

function Games() {
    const [loading, setLoading] = useState(true);
    const [percentValue, setPercentValue] = useState(50);
    const [jackpot, setJackpot] = useState(0);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [currencies, setCurrencies] = useState([]);

    const handlePCTChange = (e) => {
        setPercentValue(e.target.value);
        // Make a put request to the server to update the jackpot
        const res = fetch("/api/games/jackpot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update: "jackpotPCT",
                jackpotPCT: e.target.value,
            })
        })
    }

    useEffect(() => {
        // Get the jackpot data from the server
        fetch("/api/games/jackpot")
            .then((res) => res.json())
            .then((data) => {
                // Update the state with the jackpot data
                console.log(data);
                setPercentValue(data.jackpotPCT);
                setJackpot(data.jackpot);
                setMin(data.increaseBy.min);
                setMax(data.increaseBy.max);
                setLoading(false);
            });
        fetch("/api/currency")
            .then((res) => res.json())
            .then((data) => {
                // Update the state with the jackpot data
                console.log(data);
                setCurrencies(data);
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
            body: JSON.stringify({
                update: "jackpot",
                jackpot: e.target.value
            })
        })
    }

    const handleMinChange = (e) => {
        setMin(e.target.value);
        // Make a put request to the server to update the jackpot
        const res = fetch("/api/games/jackpot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update: "increaseBy",
                min: e.target.value,
                max: max,
            })
        })
    }

    const handleMaxChange = (e) => {
        setMax(e.target.value);
        // Make a put request to the server to update the jackpot
        const res = fetch("/api/games/jackpot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update: "increaseBy",
                min: min,
                max: e.target.value,
            })
        })
    }

    const handleCurrencyChange = (e) => {
        // Make a put request to the server to update the jackpot
        const res = fetch("/api/games/jackpot", {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                update: "currency",
                currency: e.target.value
            })
        })
    }


    return (
        <div className="content">
            {loading ? (<p>Loading...</p>
            ) : (
                <div className="games-main-container">
                    <div className="game">
                        <div className="game-info">
                            <h2>Spin</h2>
                        </div>
                        <div className="spin-details">
                            <label htmlFor="">Currency</label>
                            <select name="" onChange={handleCurrencyChange}>
                                {currencies.map((currency) => {
                                    return (
                                        <option value={currency.name}>{currency.name}</option>
                                    )
                                })}
                            </select>
                            <label htmlFor="">Jackpot</label>
                            <input type="text" placeholder="set the value of the jackpot" value={jackpot} onChange={handleInputChange} />
                            <div>
                                <div>
                                    <label htmlFor="">Minimum</label>
                                    <input type="text" value={min} onChange={handleMinChange}/>
                                </div>
                                <div>
                                    <label htmlFor="">Minimum</label>
                                    <input type="text" value={max} onChange={handleMaxChange}/>
                                </div>
                            </div>
                            <label htmlFor="">Win Percentage</label>
                            <div className="range-slider-div">
                                <input type="range" min="1" max="100" step="1" onChange={handlePCTChange} value={percentValue} />
                                <span className="range-slider-value">{percentValue}%</span>
                            </div>
                        </div>
                    </div>
                </div>)}
        </div>
    )
}

export default Games;