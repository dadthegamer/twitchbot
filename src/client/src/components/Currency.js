import React, { useState, useEffect } from 'react';
import '../styles/GUI/currency.css';

function Currency() {
    const [selectedOption, setSelectedOption] = useState('Option 1');
    const [currencies, setCurrencies] = useState([]);
    const [raffleId, setRaffleId] = useState('');

    document.title = 'Currencies';

    // Get all currencies from the server
    const getCurrencies = async () => {
        const response = await fetch('/api/currency');
        const data = await response.json();
        console.log(data);
        setCurrencies(data);
        // Map through the currencies array, find the currency named raffle, get its Id and set it as the raffleId
        data.map((currency) => {
            if (currency.name === 'raffle') {
                setRaffleId(currency._id);
            }
        });
    };

    // Get all currencies from the server on component mount
    useEffect(() => {
        getCurrencies();
    }, []);

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    // Handle input change. Get the value of the input and set it as the new value of the input and get the id of the input and set it as the new id of the input
    const handleInputChange = (event) => {
        console.log(`Input value: ${event.target.value}`);
        const value = event.target.value;
        const id = event.target.id;
        // Get the id of the currencyId of the currency container
        const currencyId = document.querySelector('#raffle-container').dataset.currencyid;
        // Update the currency with the new data
        updateCurrency(currencyId, id, value);
    };

    // Function to send a POST request to the server with the new currency data
    const updateCurrency = (currencyId, containerID, value) => {
        // Define the URL of your server endpoint to fetch user data
        const response = fetch('/api/currency', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currencyId: currencyId,
                update: containerID,
                value: value,
            }),
        });
    };


    return (
        <div class="content">
            <div className="currency-main-container">
                <button id="add-currency">Add A Currency</button>
                <div className="currency-container" id="raffle-container" data-currencyId={raffleId}>
                    <div className="currency-first">
                        <h2>Raffle Tickets</h2>
                        <i className="fa-solid fa-chevron-down"></i>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id="raffle-checkbox" />
                            <label className="switch" htmlFor="raffle-checkbox">
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    <div className="currency-container-inner">
                        <h3>Payout Settings</h3>
                        <span>How often are viewers rewarded. How much currency is rewarded for each sub, bits, etc</span>
                        <div className="currency-payout-settings">
                            {/* Payout Interval */}
                            <div>
                                <label htmlFor="raffle-payout-interval">Payout Interval (Minutes)</label>
                                <input id="raffle-payout-interval" type="text" onBlur={handleInputChange} />
                            </div>
                            {/* Amount */}
                            <div>
                                <label htmlFor="raffle-payout-amount">Amount</label>
                                <input id="raffle-payout-amount" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Subs */}
                            <div>
                                <label htmlFor="raffle-payout-subs">Subs</label>
                                <input id="raffle-payout-subs" type="text" onBlur={handleInputChange}/>
                                <label htmlFor="raffle-payout-subs-min">Minimum</label>
                                <input id="raffle-payout-subs-min" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Bits */}
                            <div>
                                <label htmlFor="raffle-payout-bits">Bits</label>
                                <input id="raffle-payout-bits" type="text" onBlur={handleInputChange}/>
                                <label htmlFor="raffle-payout-bits-min">Minimum</label>
                                <input id="raffle-payout-bits-min" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Donations */}
                            <div>
                                <label htmlFor="raffle-payout-donations">Donations</label>
                                <input id="raffle-payout-donations" type="text" onBlur={handleInputChange}/>
                                <label htmlFor="raffle-payout-donations-min">Minimum</label>
                                <input id="raffle-payout-donations-min" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Raids */}
                            <div>
                                <label htmlFor="raffle-payout-raids">Raids</label>
                                <input id="raffle-payout-raids" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Followers */}
                            <div>
                                <label htmlFor="raffle-payout-followers">Followers</label>
                                <input id="raffle-payout-followers" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Arrival */}
                            <div>
                                <label htmlFor="raffle-payout-arrival">Arrival</label>
                                <input id="raffle-payout-arrival" type="text" onBlur={handleInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="raffle-payout-first">First</label>
                                <input id="raffle-payout-first" type="text" onBlur={handleInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="raffle-payout-second">Second</label>
                                <input id="raffle-payout-second" type="text" onBlur={handleInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="raffle-payout-third">Third</label>
                                <input id="raffle-payout-third" type="text" onBlur={handleInputChange}/>
                            </div>
                            <div>
                                <label htmlFor="raffle-payout-hype-train">Hype Train</label>
                                <input id="raffle-payout-hype-train" type="text" onBlur={handleInputChange}/>
                            </div>
                        </div>
                        <h3>Bonus Settings</h3>
                        <span>Bonus rules for viewers who are in a specific role</span>
                        <div className="currency-payout-settings">
                            {/* Moderator */}
                            <div>
                                <label htmlFor="raffle-bonus-moderator">Moderator</label>
                                <input id="raffle-bonus-moderator" type="text" onBlur={handleInputChange} />
                            </div>
                            {/* Subscriber */}
                            <div>
                                <label htmlFor="raffle-bonus-subscriber">Subscriber</label>
                                <input id="raffle-bonus-subscriber" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Vip */}
                            <div>
                                <label htmlFor="raffle-bonus-vip">Vip</label>
                                <input id="raffle-bonus-vip" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Active Chat User */}
                            <div>
                                <label htmlFor="raffle-bonus-active-chat-user">Active Chat User</label>
                                <input id="raffle-bonus-active-chat-user" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Tier 1 Sub */}
                            <div>
                                <label htmlFor="raffle-bonus-tier1">Tier 1 Sub</label>
                                <input id="raffle-bonus-tier1" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Tier 2 Sub */}
                            <div>
                                <label htmlFor="raffle-bonus-tier2">Tier 2 Sub</label>
                                <input id="raffle-bonus-tier2" type="text" onBlur={handleInputChange}/>
                            </div>
                            {/* Tier 3 Sub */}
                            <div>
                                <label htmlFor="raffle-bonus-tier3">Tier 3 Sub</label>
                                <input id="raffle-bonus-tier3" type="text" onBlur={handleInputChange}/>
                            </div>
                        </div>
                        <h3>Restrictions</h3>
                        <span>Establish restrictions for a currency</span>
                        <div className="restrcitions-main-container">
                            {/* Followers Only */}
                            <div className="restrictions-container">
                                <label htmlFor="raffle-followers-only">Followers Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="raffle-followers-only" />
                                    <label className="switch" htmlFor="raffle-followers-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* Subscribers Only */}
                            <div className="restrictions-container">
                                <label htmlFor="raffle-subscribers-only">Subscribers Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="raffle-subscribers-only" />
                                    <label className="switch" htmlFor="raffle-subscribers-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* VIP's Only */}
                            <div className="restrictions-container">
                                <label htmlFor="raffle-vips-only">VIP's Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="raffle-vips-only" />
                                    <label className="switch" htmlFor="raffle-vips-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* Active Chat User Only */}
                            <div className="restrictions-container">
                                <label htmlFor="raffle-active-chat-user-only">Active Chat User Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="raffle-active-chat-user-only" />
                                    <label className="switch" htmlFor="raffle-active-chat-user-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="currency-options-container">
                            <div className="currency-option">
                                <h3>Limit</h3>
                                <span>Establish a limit on the currency</span>
                                <span>(0 is no limit)</span>
                                <div className="limit-container">
                                    <input id="new-limit-value" type="text" value="0" />
                                </div>
                            </div>
                            <div className="currency-option">
                                <h3>Auto Reset</h3>
                                <span>Automatically reset the currency</span>
                                <div>
                                    <select id="dropdown" value={selectedOption} onBlur={handleOptionChange}>
                                        <option value="Option 1">Never</option>
                                        <option value="Option 1">Every Stream</option>
                                        <option value="Option 3">Every Month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="currency-buttons">
                            <button id="new-save-button">Save</button>
                            <button id="reset-button">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Currency;
