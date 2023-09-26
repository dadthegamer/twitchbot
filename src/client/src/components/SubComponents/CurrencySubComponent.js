import React, { useState, useEffect } from 'react';
import '../../styles/GUI/currency.css';
import Confirmation from './confirm';

function CurrencySubComponent({ props }) {

    const {
        _id,
        name,
        enabled,
        payoutSettings,
        roleBonuses,
        autoReset,
        limit
    } = props;

    const [currencyId, setCurrencyId] = useState(_id);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const [currencyName, setCurrencyName] = useState(name);
    const [currencyEnabled, setCurrencyEnabled] = useState(enabled);
    const [payoutInterval, setPayoutInterval] = useState(payoutSettings.interval);
    const [payoutAmount, setPayoutAmount] = useState(payoutSettings.amount);
    const [payoutSubs, setPayoutSubs] = useState(payoutSettings.subs.amount);
    const [payoutSubsMin, setPayoutSubsMin] = useState(payoutSettings.subs.minimum);
    const [payoutBits, setPayoutBits] = useState(payoutSettings.bits.amount);
    const [payoutBitsMin, setPayoutBitsMin] = useState(payoutSettings.bits.minimum);
    const [payoutDonations, setPayoutDonations] = useState(payoutSettings.donations.amount);
    const [payoutDonationsMin, setPayoutDonationsMin] = useState(payoutSettings.donations.minimum);
    const [payoutRaids, setPayoutRaids] = useState(payoutSettings.raids);
    const [payoutFollowers, setPayoutFollowers] = useState(payoutSettings.followers);
    const [payoutArrival, setPayoutArrival] = useState(payoutSettings.arrival);
    const [payoutFirst, setPayoutFirst] = useState(payoutSettings.first.first);
    const [payoutSecond, setPayoutSecond] = useState(payoutSettings.first.second);
    const [payoutThird, setPayoutThird] = useState(payoutSettings.first.third);
    const [payoutHypeTrain, setPayoutHypeTrain] = useState(payoutSettings.hypeTrain);
    const [bonusModerator, setBonusModerator] = useState(roleBonuses.moderator);
    const [bonusSubscriber, setBonusSubscriber] = useState(roleBonuses.subscriber);
    const [bonusVip, setBonusVip] = useState(roleBonuses.vip);
    const [bonusActiveChatUser, setBonusActiveChatUser] = useState(roleBonuses.activeChatUser);
    const [bonusTier1, setBonusTier1] = useState(roleBonuses.tier1);
    const [bonusTier2, setBonusTier2] = useState(roleBonuses.tier2);
    const [bonusTier3, setBonusTier3] = useState(roleBonuses.tier3);
    const [limitValue, setLimit] = useState(limit);
    const [autoResetValue, setAutoReset] = useState(autoReset);

    // Function to handle cancellation
    const handleResetConfirmation = () => {
        // Make a POST request to the server to reset the currency for all users
        fetch('/api/currency/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currencyId: currencyId,
            }),
        }).then((response) => {
            console.log(response);
        });
        // Close the confirmation dialog
        setShowConfirmation(false);
    };

    const handleCancelConfirmation = () => {
        // Close the confirmation dialog
        setShowDeleteConfirmation(false);
    };

    const handleReset = (e) => {
        console.log('Reset');
        // Open the confirmation dialog
        setShowConfirmation(true);
        // Show the confirmation dialog
    };

    const handleDelete = (e) => {
        console.log('Delete');
        setShowDeleteConfirmation(true);
    };

    const handleDeleteConfirmation = () => {
        // Make a POST request to the server to delete the currency
        fetch(`/api/currency/${currencyId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((response) => {
            console.log(response);
            if (response.status === 200) {
                // Remove the currency from the DOM
                const currencyContainer = document.querySelector(`[data-currencyId="${currencyId}"]`);
                currencyContainer.remove();
            }
        });
        // Close the confirmation dialog
        setShowDeleteConfirmation(false);
    };

    // Handle input change. Get the value of the input and set it as the new value of the input and get the id of the input and set it as the new id of the input
    const handleInputChange = (event) => {
        // Prevent the default action of the event
        event.preventDefault();
        
        const value = event.target.value;
        const id = event.target.id;
        const checked = event.target.checked;
        console.log(`Currency ID: ${currencyId} | Container ID: ${id} | Value: ${value}`)

        // Update the state variable based on the input field's ID
        switch (id) {
            case "payout-interval":
                setPayoutInterval(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-amount":
                setPayoutAmount(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-subs":
                setPayoutSubs(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-subs-min":
                setPayoutSubsMin(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-bits":
                setPayoutBits(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-bits-min":
                setPayoutBitsMin(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-donations":
                setPayoutDonations(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-donations-min":
                setPayoutDonationsMin(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-raids":
                setPayoutRaids(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-followers":
                setPayoutFollowers(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-arrival":
                setPayoutArrival(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-first":
                setPayoutFirst(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-second":
                setPayoutSecond(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-third":
                setPayoutThird(value);
                updateCurrency(currencyId, id, value);
                break;
            case "payout-hype-train":
                setPayoutHypeTrain(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-moderator":
                setBonusModerator(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-subscriber":
                setBonusSubscriber(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-vip":
                setBonusVip(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-active-chat-user":
                setBonusActiveChatUser(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-tier1":
                setBonusTier1(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-tier2":
                setBonusTier2(value);
                updateCurrency(currencyId, id, value);
                break;
            case "bonus-tier3":
                setBonusTier3(value);
                updateCurrency(currencyId, id, value);
                break;
            case "new-limit-value":
                setLimit(value);
                updateCurrency(currencyId, id, value);
                break;
            case "auto-reset":
                setAutoReset(value);
                updateCurrency(currencyId, id, value);
                break;
            case `toggle-currency-checkbox-${currencyId}`:
                console.log(`Currency ID: ${currencyId} | Container ID: ${id} | Value: ${checked}`)
                setCurrencyEnabled(checked);
                updateCurrency(currencyId, id, checked);
                break;
            default:
                break;
        }
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
        }).then((response) => {
            console.log(response);
        });
    };

    return (
        <div className="currency-container" data-currencyId={currencyId} >
            {showConfirmation && (
                <Confirmation
                    message="Are you sure you want to reset the currency for all users?"
                    onConfirm={handleResetConfirmation} // Handle the reset action
                    onCancel={handleCancelConfirmation} // Handle the cancellation
                />
            )}
            {showDeleteConfirmation && (
                <Confirmation
                    message={`Are you sure you want to delete the ${currencyName} currency?`}
                    onConfirm={handleDeleteConfirmation} // Handle the reset action
                    onCancel={handleCancelConfirmation} // Handle the cancellation
                />
            )}
            <div className="currency-first">
                <input id="currency-name" type="text" onChange={handleInputChange} value={currencyName} disabled/>
                <i className="fa-solid fa-chevron-down"></i>
                <div className="switch-container">
                    <input type="checkbox" className="checkbox" id={`toggle-currency-checkbox-${currencyId}`} onChange={handleInputChange} checked={currencyEnabled} />
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
                        <label htmlFor="raffle-payout-interval">Payout Interval (Minutes)</label>
                        <input id="payout-interval" name='payoutInterval' type="text" onChange={handleInputChange} value={payoutInterval} />
                    </div>
                    {/* Amount */}
                    <div>
                        <label htmlFor="raffle-payout-amount">Amount</label>
                        <input id="payout-amount" type="text" onChange={handleInputChange} value={payoutAmount} />
                    </div>
                    {/* Subs */}
                    <div>
                        <label htmlFor="raffle-payout-subs">Subs</label>
                        <input id="payout-subs" type="text" onChange={handleInputChange} value={payoutSubs} />
                        <label htmlFor="raffle-payout-subs-min">Minimum</label>
                        <input id="payout-subs-min" type="text" onChange={handleInputChange} value={payoutSubsMin} />
                    </div>
                    {/* Bits */}
                    <div>
                        <label htmlFor="raffle-payout-bits">Bits</label>
                        <input id="payout-bits" type="text" onChange={handleInputChange} value={payoutBits} />
                        <label htmlFor="raffle-payout-bits-min">Minimum</label>
                        <input id="payout-bits-min" type="text" onChange={handleInputChange} value={payoutBitsMin} />
                    </div>
                    {/* Donations */}
                    <div>
                        <label htmlFor="raffle-payout-donations">Donations</label>
                        <input id="payout-donations" type="text" onChange={handleInputChange} value={payoutDonations} />
                        <label htmlFor="raffle-payout-donations-min">Minimum</label>
                        <input id="payout-donations-min" type="text" onChange={handleInputChange} value={payoutDonationsMin} />
                    </div>
                    {/* Raids */}
                    <div>
                        <label htmlFor="raffle-payout-raids">Raids</label>
                        <input id="payout-raids" type="text" onChange={handleInputChange} value={payoutRaids} />
                    </div>
                    {/* Followers */}
                    <div>
                        <label htmlFor="raffle-payout-followers">Followers</label>
                        <input id="payout-followers" type="text" onChange={handleInputChange} value={payoutFollowers} />
                    </div>
                    {/* Arrival */}
                    <div>
                        <label htmlFor="raffle-payout-arrival">Arrival</label>
                        <input id="payout-arrival" type="text" onChange={handleInputChange} value={payoutArrival} />
                    </div>
                    <div>
                        <label htmlFor="raffle-payout-first">First</label>
                        <input id="payout-first" type="text" onChange={handleInputChange} value={payoutFirst} />
                    </div>
                    <div>
                        <label htmlFor="raffle-payout-second">Second</label>
                        <input id="payout-second" type="text" onChange={handleInputChange} value={payoutSecond} />
                    </div>
                    <div>
                        <label htmlFor="raffle-payout-third">Third</label>
                        <input id="payout-third" type="text" onChange={handleInputChange} value={payoutThird} />
                    </div>
                    <div>
                        <label htmlFor="raffle-payout-hype-train">Hype Train</label>
                        <input id="payout-hype-train" type="text" onChange={handleInputChange} value={payoutHypeTrain} />
                    </div>
                </div>
                <h3>Bonus Settings</h3>
                <span>Bonus rules for viewers who are in a specific role</span>
                <div className="currency-payout-settings">
                    {/* Moderator */}
                    <div>
                        <label htmlFor="raffle-bonus-moderator">Moderator</label>
                        <input id="bonus-moderator" type="text" onChange={handleInputChange} value={bonusModerator} />
                    </div>
                    {/* Subscriber */}
                    <div>
                        <label htmlFor="raffle-bonus-subscriber">Subscriber</label>
                        <input id="bonus-subscriber" type="text" onChange={handleInputChange} value={bonusSubscriber} />
                    </div>
                    {/* Vip */}
                    <div>
                        <label htmlFor="raffle-bonus-vip">Vip</label>
                        <input id="bonus-vip" type="text" onChange={handleInputChange} value={bonusVip} />
                    </div>
                    {/* Active Chat User */}
                    <div>
                        <label htmlFor="raffle-bonus-active-chat-user">Active Chat User</label>
                        <input id="bonus-active-chat-user" type="text" onChange={handleInputChange} value={bonusActiveChatUser} />
                    </div>
                    {/* Tier 1 Sub */}
                    <div>
                        <label htmlFor="raffle-bonus-tier1">Tier 1 Sub</label>
                        <input id="bonus-tier1" type="text" onChange={handleInputChange} value={bonusTier1} />
                    </div>
                    {/* Tier 2 Sub */}
                    <div>
                        <label htmlFor="raffle-bonus-tier2">Tier 2 Sub</label>
                        <input id="bonus-tier2" type="text" onChange={handleInputChange} value={bonusTier2} />
                    </div>
                    {/* Tier 3 Sub */}
                    <div>
                        <label htmlFor="raffle-bonus-tier3">Tier 3 Sub</label>
                        <input id="bonus-tier3" type="text" onChange={handleInputChange} value={bonusTier3} />
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
                            <input id="new-limit-value" type="text" value={limitValue} />
                        </div>
                    </div>
                    <div className="currency-option">
                        <h3>Auto Reset</h3>
                        <span>Automatically reset the currency</span>
                        <div>
                            <select id="auto-reset" value={autoResetValue} onChange={handleInputChange}>
                                <option value="False">Never</option>
                                <option value="Stream">Every Stream</option>
                                <option value="Monthly">Every Month</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="currency-buttons">
                    <button id="delete-button" onClick={handleDelete}>Delete</button>
                    <button id="reset-button" onClick={handleReset}>Reset</button>
                </div>
            </div>
        </div>
    );
}

export default CurrencySubComponent;
