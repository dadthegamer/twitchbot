import React, { useState, useEffect } from 'react';
import '../../styles/GUI/currency.css';

function NewCurrency({ onCancel }) {

    const [currencyId, setCurrencyId] = useState('');

    // Handle cancel button click. Remove the currency from the DOM
    const handleCancel = (event) => {
        event.preventDefault();
        // Remove the currency from the DOM
        document.querySelector(`.currency-container[data-currencyId="${currencyId}"]`).remove();
        // onCancel(event);
    };

    // Function to get all the values from the input fields and send them to the server as a new currency
    const handleSave = () => {
        // Get the value of the input fields
        const payoutInterval = document.getElementById('payout-interval').value;
        const payoutAmount = document.getElementById('payout-amount').value;
        const payoutSubs = document.getElementById('payout-subs').value;
        const payoutSubsMin = document.getElementById('payout-subs-min').value;
        const payoutBits = document.getElementById('payout-bits').value;
        const payoutBitsMin = document.getElementById('payout-bits-min').value;
        const payoutDonations = document.getElementById('payout-donations').value;
        const payoutDonationsMin = document.getElementById('payout-donations-min').value;
        const payoutRaids = document.getElementById('payout-raids').value;
        const payoutFollowers = document.getElementById('payout-followers').value;
        const payoutArrival = document.getElementById('payout-arrival').value;
        const payoutFirst = document.getElementById('payout-first').value;
        const payoutSecond = document.getElementById('payout-second').value;
        const payoutThird = document.getElementById('payout-third').value;
        const payoutHypeTrain = document.getElementById('payout-hype-train').value;
        const bonusModerator = document.getElementById('bonus-moderator').value;
        const bonusSubscriber = document.getElementById('bonus-subscriber').value;
        const bonusVip = document.getElementById('bonus-vip').value;
        const bonusActiveChatUser = document.getElementById('bonus-active-chat-user').value;
        const bonusTier1 = document.getElementById('bonus-tier1').value;
        const bonusTier2 = document.getElementById('bonus-tier2').value;
        const bonusTier3 = document.getElementById('bonus-tier3').value;
        const limitValue = document.getElementById('new-limit-value').value;
        const autoResetValue = document.getElementById('auto-reset').value;
        const followersOnly = document.getElementById('raffle-followers-only').checked;
        const subscribersOnly = document.getElementById('subscribers-only').checked;
        const vipsOnly = document.getElementById('vips-only').checked;
        const activeChatUserOnly = document.getElementById('active-chat-user-only').checked;
        const currencyName = document.getElementById('currency-name').value;
        const currencyEnabled = document.getElementById(`toggle-currency-checkbox-${currencyId}`).checked;

        // Send the data to the server
        fetch('/api/currency/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                currencyName,
                currencyEnabled,
                payoutInterval,
                payoutAmount,
                payoutSubs,
                payoutSubsMin,
                payoutBits,
                payoutBitsMin,
                payoutDonations,
                payoutDonationsMin,
                payoutRaids,
                payoutFollowers,
                payoutArrival,
                payoutFirst,
                payoutSecond,
                payoutThird,
                payoutHypeTrain,
                bonusModerator,
                bonusSubscriber,
                bonusVip,
                bonusActiveChatUser,
                bonusTier1,
                bonusTier2,
                bonusTier3,
                limitValue,
                autoResetValue,
                followersOnly,
                subscribersOnly,
                vipsOnly,
                activeChatUserOnly
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
            .catch(err => console.log(err));
        };

    return (
        <div className="currency-container" data-currencyId={currencyId} >
            <div className="currency-first">
                <input id="currency-name" type="text" placeholder='Currency name' />
                <i className="fa-solid fa-chevron-down"></i>
                <div className="switch-container">
                    <input type="checkbox" className="checkbox" id={`toggle-currency-checkbox-${currencyId}`} />
                    <label className="switch" htmlFor={`toggle-currency-checkbox-${currencyId}`}>
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
                        <label htmlFor="payout-interval">Payout Interval (Minutes)</label>
                        <input id="payout-interval" name='payoutInterval' type="text" value='0' />
                    </div>
                    {/* Amount */}
                    <div>
                        <label htmlFor="payout-amount">Amount</label>
                        <input id="payout-amount" type="text" value='0' />
                    </div>
                    {/* Subs */}
                    <div>
                        <label htmlFor="payout-subs">Subs</label>
                        <input id="payout-subs" type="text" value='0' />
                        <label htmlFor="payout-subs-min">Minimum</label>
                        <input id="payout-subs-min" type="text" value='0' />
                    </div>
                    {/* Bits */}
                    <div>
                        <label htmlFor="payout-bits">Bits</label>
                        <input id="payout-bits" type="text" value='0' />
                        <label htmlFor="payout-bits-min">Minimum</label>
                        <input id="payout-bits-min" type="text" value='0' />
                    </div>
                    {/* Donations */}
                    <div>
                        <label htmlFor="payout-donations">Donations</label>
                        <input id="payout-donations" type="text" value='0' />
                        <label htmlFor="payout-donations-min">Minimum</label>
                        <input id="payout-donations-min" type="text" value='0' />
                    </div>
                    {/* Raids */}
                    <div>
                        <label htmlFor="payout-raids">Raids</label>
                        <input id="payout-raids" type="text" value='0' />
                    </div>
                    {/* Followers */}
                    <div>
                        <label htmlFor="payout-followers">Followers</label>
                        <input id="payout-followers" type="text" value='0' />
                    </div>
                    {/* Arrival */}
                    <div>
                        <label htmlFor="payout-arrival">Arrival</label>
                        <input id="payout-arrival" type="text" value='0' />
                    </div>
                    <div>
                        <label htmlFor="payout-first">First</label>
                        <input id="payout-first" type="text" value='0' />
                    </div>
                    <div>
                        <label htmlFor="payout-second">Second</label>
                        <input id="payout-second" type="text" value='0' />
                    </div>
                    <div>
                        <label htmlFor="payout-third">Third</label>
                        <input id="payout-third" type="text" value='0' />
                    </div>
                    <div>
                        <label htmlFor="payout-hype-train">Hype Train</label>
                        <input id="payout-hype-train" type="text" value='0' />
                    </div>
                </div>
                <h3>Bonus Settings</h3>
                <span>Bonus rules for viewers who are in a specific role</span>
                <div className="currency-payout-settings">
                    {/* Moderator */}
                    <div>
                        <label htmlFor="bonus-moderator">Moderator</label>
                        <input id="bonus-moderator" type="text" value='0' />
                    </div>
                    {/* Subscriber */}
                    <div>
                        <label htmlFor="bonus-subscriber">Subscriber</label>
                        <input id="bonus-subscriber" type="text" value='0' />
                    </div>
                    {/* Vip */}
                    <div>
                        <label htmlFor="bonus-vip">Vip</label>
                        <input id="bonus-vip" type="text" value='0' />
                    </div>
                    {/* Active Chat User */}
                    <div>
                        <label htmlFor="bonus-active-chat-user">Active Chat User</label>
                        <input id="bonus-active-chat-user" type="text" value='0' />
                    </div>
                    {/* Tier 1 Sub */}
                    <div>
                        <label htmlFor="bonus-tier1">Tier 1 Sub</label>
                        <input id="bonus-tier1" type="text" value='0' />
                    </div>
                    {/* Tier 2 Sub */}
                    <div>
                        <label htmlFor="bonus-tier2">Tier 2 Sub</label>
                        <input id="bonus-tier2" type="text" value='0' />
                    </div>
                    {/* Tier 3 Sub */}
                    <div>
                        <label htmlFor="bonus-tier3">Tier 3 Sub</label>
                        <input id="bonus-tier3" type="text" value='0' />
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
                        <label htmlFor="subscribers-only">Subscribers Only</label>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id="subscribers-only" />
                            <label className="switch" htmlFor="subscribers-only">
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    {/* VIP's Only */}
                    <div className="restrictions-container">
                        <label htmlFor="vips-only">VIP's Only</label>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id="vips-only" />
                            <label className="switch" htmlFor="raffle-vips-only">
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                    {/* Active Chat User Only */}
                    <div className="restrictions-container">
                        <label htmlFor="active-chat-user-only">Active Chat User Only</label>
                        <div className="switch-container">
                            <input type="checkbox" className="checkbox" id="active-chat-user-only" />
                            <label className="switch" htmlFor="active-chat-user-only">
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
                            <input id="new-limit-value" type="text" value='0' />
                        </div>
                    </div>
                    <div className="currency-option">
                        <h3>Auto Reset</h3>
                        <span>Automatically reset the currency</span>
                        <div>
                            <select id="auto-reset" value='False'>
                                <option value="False">Never</option>
                                <option value="Stream">Every Stream</option>
                                <option value="Monthly">Every Month</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="currency-buttons">
                    <button type="button" id="Cancel-button" onClick={handleCancel}>Cancel</button>
                    <button type="button" id="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
}

export default NewCurrency;
