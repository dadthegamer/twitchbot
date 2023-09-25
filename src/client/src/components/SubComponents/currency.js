import React, { useState, useEffect } from 'react';
import '../styles/GUI/currency.css';

function Currency(props) {
    const [selectedOption, setSelectedOption] = useState('Option 1');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div class="content">
            <div className="currency-main-container">
                <div className="currency-container" id="new-currency-container">
                    <div className="currency-first">
                        <input type="text" placeholder="Currency Name" />
                        <i className="fa-solid fa-chevron-down"></i>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id="new-currency-checkbox" />
                            <label className="switch" htmlFor="new-currency-checkbox">
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
                                <label htmlFor="new-payout-interval">Payout Interval (Minutes)</label>
                                <input id="new-payout-interval" type="text" />
                            </div>
                            {/* Amount */}
                            <div>
                                <label htmlFor="new-payout-amount">Amount</label>
                                <input id="new-payout-amount" type="text" />
                            </div>
                            {/* Subs */}
                            <div>
                                <label htmlFor="new-payout-subs">Subs</label>
                                <input id="new-payout-subs" type="text" />
                            </div>
                            {/* Bits */}
                            <div>
                                <label htmlFor="new-payout-bits">Bits</label>
                                <input id="new-payout-bits" type="text" />
                                <label htmlFor="new-payout-bits-min">Minimum</label>
                                <input id="new-payout-bits-min" type="text" />
                            </div>
                            {/* Donations */}
                            <div>
                                <label htmlFor="new-payout-donations">Donations</label>
                                <input id="new-payout-donations" type="text" />
                                <label htmlFor="new-payout-donations-minimum">Minimum</label>
                                <input id="new-payout-donations-minimum" type="text" />
                            </div>
                            {/* Raids */}
                            <div>
                                <label htmlFor="new-payout-raids">Raids</label>
                                <input id="new-payout-raids" type="text" />
                            </div>
                            {/* Arrival */}
                            <div>
                                <label htmlFor="new-payout-arrival">Arrival</label>
                                <input id="new-payout-arrival" type="text" />
                            </div>
                        </div>
                        <h3>Bonus Settings</h3>
                        <span>Bonus rules for viewers who are in a specific role</span>
                        <div className="currency-payout-settings">
                            {/* Moderator */}
                            <div>
                                <label htmlFor="new-bonus-moderator">Moderator</label>
                                <input id="new-bonus-moderator" type="text" />
                            </div>
                            {/* Subscriber */}
                            <div>
                                <label htmlFor="new-bonus-subscriber">Subscriber</label>
                                <input id="new-bonus-subscriber" type="text" />
                            </div>
                            {/* Vip */}
                            <div>
                                <label htmlFor="new-bonus-vips">Vip</label>
                                <input id="new-bonus-vips" type="text" />
                            </div>
                            {/* Active Chat User */}
                            <div>
                                <label htmlFor="new-bonus-active-chat-user">Active Chat User</label>
                                <input id="new-bonus-active-chat-user" type="text" />
                            </div>
                            {/* Tier 1 Sub */}
                            <div>
                                <label htmlFor="new-bonus-tier1">Tier 1 Sub</label>
                                <input id="new-bonus-tier1" type="text" />
                            </div>
                            {/* Tier 2 Sub */}
                            <div>
                                <label htmlFor="new-bonus-tier2">Tier 2 Sub</label>
                                <input id="new-bonus-tier2" type="text" />
                            </div>
                            {/* Tier 3 Sub */}
                            <div>
                                <label htmlFor="new-bonus-tier3">Tier 3 Sub</label>
                                <input id="new-bonus-tier3" type="text" />
                            </div>
                        </div>
                        <h3>Restrictions</h3>
                        <span>Establish restrictions for a currency</span>
                        <div className="restrcitions-main-container">
                            {/* Followers Only */}
                            <div className="restrictions-container">
                                <label htmlFor="new-followers-only">Followers Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="new-followers-only" />
                                    <label className="switch" htmlFor="new-followers-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* Subscribers Only */}
                            <div className="restrictions-container">
                                <label htmlFor="new-subscribers-only">Subscribers Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="new-subscribers-only" />
                                    <label className="switch" htmlFor="new-subscribers-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* VIP's Only */}
                            <div className="restrictions-container">
                                <label htmlFor="new-vips-only">VIP's Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="new-vips-only" />
                                    <label className="switch" htmlFor="new-vips-only">
                                        <span className="slider"></span>
                                    </label>
                                </div>
                            </div>
                            {/* Active Chat User Only */}
                            <div className="restrictions-container">
                                <label htmlFor="new-active-chat-user-only">Active Chat User Only</label>
                                <div className="switch-container">
                                    <input type="checkbox" className="checkbox" id="new-active-chat-user-only" />
                                    <label className="switch" htmlFor="new-active-chat-user-only">
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
                                    <select id="dropdown" value={selectedOption} onChange={handleOptionChange}>
                                        <option value="Option 1">Never</option>
                                        <option value="Option 1">Every Stream</option>
                                        <option value="Option 3">Every Month</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="currency-buttons">
                            <button id="new-save-button">Save</button>
                            <button id="delete-button">Delete</button>
                            <button id="reset-button">Reset</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Currency;
