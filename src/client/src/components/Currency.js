import React, { useState, useEffect } from 'react';
import '../styles/GUI/currency.css';
import Confirmation from './SubComponents/confirm';
import CurrencySubComponent from './SubComponents/CurrencySubComponent';
import NewCurrency from './SubComponents/NewCurrency';

function Currency() {
    const [isLoading, setIsLoading] = useState(true);
    const [currencies, setCurrencies] = useState([]);
    const [raffleId, setRaffleId] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showNewCurrency, setShowNewCurrency] = useState(false);

    // Set the states for each input field
    const [raffleEnabled, setRaffleEnabled] = useState(false);
    const [payoutInterval, setPayoutInterval] = useState('');
    const [payoutAmount, setPayoutAmount] = useState('');
    const [payoutSubs, setPayoutSubs] = useState('');
    const [payoutSubsMin, setPayoutSubsMin] = useState('');
    const [payoutBits, setPayoutBits] = useState('');
    const [payoutBitsMin, setPayoutBitsMin] = useState('');
    const [payoutDonations, setPayoutDonations] = useState('');
    const [payoutDonationsMin, setPayoutDonationsMin] = useState('');
    const [payoutRaids, setPayoutRaids] = useState('');
    const [payoutFollowers, setPayoutFollowers] = useState('');
    const [payoutArrival, setPayoutArrival] = useState('');
    const [payoutFirst, setPayoutFirst] = useState('');
    const [payoutSecond, setPayoutSecond] = useState('');
    const [payoutThird, setPayoutThird] = useState('');
    const [payoutHypeTrain, setPayoutHypeTrain] = useState('');
    const [bonusModerator, setBonusModerator] = useState('');
    const [bonusSubscriber, setBonusSubscriber] = useState('');
    const [bonusVip, setBonusVip] = useState('');
    const [bonusActiveChatUser, setBonusActiveChatUser] = useState('');
    const [bonusTier1, setBonusTier1] = useState('');
    const [bonusTier2, setBonusTier2] = useState('');
    const [bonusTier3, setBonusTier3] = useState('');
    const [limit, setLimit] = useState('');
    const [autoReset, setAutoReset] = useState('');

    document.title = 'Currencies';

    // Function to handle cancellation
    const handleResetConfirmation = () => {
        // Make a POST request to the server to reset the currency for all users
        fetch('/api/currency/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                currencyId: raffleId,
            }),
        }).then((response) => {
            console.log(response);
        });
        // Close the confirmation dialog
        setShowConfirmation(false);
    };

    const handleCancelConfirmation = () => {
        // Close the confirmation dialog
        setShowConfirmation(false);
    };

    const handleReset = (e) => {
        console.log('Reset');
        // Open the confirmation dialog
        setShowConfirmation(true);
        // Show the confirmation dialog
    };


    // Get all currencies from the server
    const getCurrencies = async () => {
        const response = await fetch('/api/currency');
        const data = await response.json();
        setCurrencies(data);
        // Map through the currencies array, find the currency named raffle, get its Id and set it as the raffleId
        data.map((currency) => {
            if (currency.name === 'raffle') {
                // Set the state variables for each input field
                setRaffleEnabled(currency.enabled);
                setPayoutInterval(currency.payoutSettings.interval);
                setPayoutAmount(currency.payoutSettings.amount);
                setPayoutSubs(currency.payoutSettings.subs.amount);
                setPayoutSubsMin(currency.payoutSettings.subs.minimum);
                setPayoutBits(currency.payoutSettings.bits.amount);
                setPayoutBitsMin(currency.payoutSettings.bits.minimum);
                setPayoutDonations(currency.payoutSettings.donations.amount);
                setPayoutDonationsMin(currency.payoutSettings.donations.minimum);
                setPayoutRaids(currency.payoutSettings.raids);
                setPayoutFollowers(currency.payoutSettings.follower);
                setPayoutArrival(currency.payoutSettings.arrived);
                setPayoutFirst(currency.payoutSettings.first.first);
                setPayoutSecond(currency.payoutSettings.first.second);
                setPayoutThird(currency.payoutSettings.first.third);
                setPayoutHypeTrain(currency.payoutSettings.hypeTrain);
                setBonusModerator(currency.roleBonuses.moderator);
                setBonusSubscriber(currency.roleBonuses.subscriber);
                setBonusVip(currency.roleBonuses.vip);
                setBonusActiveChatUser(currency.roleBonuses.activeChatUser);
                setBonusTier1(currency.roleBonuses.tier1);
                setBonusTier2(currency.roleBonuses.tier2);
                setBonusTier3(currency.roleBonuses.tier3);
                setLimit(currency.limit);
                setAutoReset(currency.autoReset);
                setRaffleId(currency._id);
                setIsLoading(false);
            } else {
                return;
            }
        });
    };

    const toggleCheckbox = (event) => {
        const id = event.target.id;
        const value = event.target.checked;
    };


    // Get all currencies from the server on component mount
    useEffect(() => {
        getCurrencies();
    }, []);


    const handleOptionChange = (event) => {
        console.log(event.target.value);
    };

    // Handle input change. Get the value of the input and set it as the new value of the input and get the id of the input and set it as the new id of the input
    const handleInputChange = (event) => {
        event.preventDefault();
        const value = event.target.value;
        const id = event.target.id;
        const checked = event.target.checked;

        // Get the currency ID from the data-currencyId attribute of the parent element
        const currencyId = document.getElementById('raffle-container').getAttribute('data-currencyId');
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
            case `toggle-currency-checkbox-${raffleId}`:
                setRaffleEnabled(checked);
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

    // Function to handle the add currency button
    const handleAddCurrency = () => {
        setShowNewCurrency(true);
    };

    const handleCancel = (event) => {
        // event.preventDefault();
        setShowNewCurrency(false);
    };


    return (
        <div className="content">
            {showConfirmation && (
                <Confirmation
                    message="Are you sure you want to reset the currency for all users?"
                    onConfirm={handleResetConfirmation} // Handle the reset action
                    onCancel={handleCancelConfirmation} // Handle the cancellation
                />
            )}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="currency-main-container">
                    <button type="button" id="add-currency" onClick={handleAddCurrency}>Add A Currency</button>
                    {showNewCurrency && (
                        <NewCurrency onCancel={handleCancel}/>
                    )}
                    <div className="currency-container" id="raffle-container" data-currencyId={raffleId} >
                        <div className="currency-first">
                            <h2>Raffle Tickets</h2>
                            <i className="fa-solid fa-chevron-down"></i>
                            <div className="switch-container">
                                <input type="checkbox" className="checkbox" id={`toggle-currency-checkbox-${raffleId}`} onChange={handleInputChange} checked={raffleEnabled} />
                                <label className="switch" htmlFor={`toggle-currency-checkbox-${raffleId}`}>
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
                                        <input id="new-limit-value" type="text" value={limit} />
                                    </div>
                                </div>
                                <div className="currency-option">
                                    <h3>Auto Reset</h3>
                                    <span>Automatically reset the currency</span>
                                    <div>
                                        <select id="auto-reset" value={autoReset} onChange={handleInputChange}>
                                            <option value="False">Never</option>
                                            <option value="Stream">Every Stream</option>
                                            <option value="Monthly">Every Month</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="currency-buttons">
                                <button id="reset-button" onClick={handleReset}>Reset</button>
                            </div>
                        </div>
                    </div>
                    {currencies.map((currency) => {
                        if (currency.name !== 'raffle') {
                            return <CurrencySubComponent 
                            currencyId={currency._id} 
                            props={currency} />
                    }})}
                </div>
            )}
        </div>
    );
}

export default Currency;
