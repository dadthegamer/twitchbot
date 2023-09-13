import { serverip, serverWSport, serverPort } from '../config.js';

// Function to get all the currencies from the server
async function getAllCurrencies() {
    try {
        const data = await fetch(`http://${serverip}:${serverPort}/api/currency`);
        const currencies = await data.json();
        for (const currency of currencies) {
            console.log(currency);
            if (currency.name === 'Raffle') {
                updateRaffleCurrency(currency);
            }
        }
    } catch (error) {
        console.log(error);
    }
}

// Function to update the raffle currency on the page
async function updateRaffleCurrency(data) {
    const raffleContainer = document.getElementById('raffle-container');
    const raffleSwitch = raffleContainer.querySelector('.switch-container input');
    raffleSwitch.checked = data.enabled;

    const raffleIntervale = document.getElementById('raffle-payout-interval');
    raffleIntervale.value = data.payoutSettings.interval;

    const amount = document.getElementById('raffle-payout-amount');
    amount.value = data.payoutSettings.amount;

    const subsAmount = document.getElementById('raffle-payout-subs');
    subsAmount.value = data.payoutSettings.subs.amount;

    const subsMin = document.getElementById('raffle-payout-subs-min');
    subsMin.value = data.payoutSettings.subs.minimum;

    const bitsAmount = document.getElementById('raffle-payout-bits');
    bitsAmount.value = data.payoutSettings.bits.amount;

    const bitsMin = document.getElementById('raffle-payout-bits-min');
    bitsMin.value = data.payoutSettings.bits.minimum;

    const donationAmount = document.getElementById('raffle-payout-donations');
    donationAmount.value = data.payoutSettings.donations.amount;

    const donationMin = document.getElementById('raffle-payout-donations-min');
    donationMin.value = data.payoutSettings.donations.minimum;

    const raidsAmount = document.getElementById('raffle-payout-raids');
    raidsAmount.value = data.payoutSettings.raids;

    const arrivalAmount = document.getElementById('raffle-payout-arrival');
    arrivalAmount.value = data.payoutSettings.arrived;


    // Role Bonuses
    const moderatorBonus = document.getElementById('raffle-bonus-moderator');
    moderatorBonus.value = data.roleBonuses.moderator;

    const subscriberBonus = document.getElementById('raffle-bonus-subscriber');
    subscriberBonus.value = data.roleBonuses.subscriber;

    const vipBonus = document.getElementById('raffle-bonus-vip');
    vipBonus.value = data.roleBonuses.vip;

    const activeChatUser = document.getElementById('raffle-bonus-active-chat-user');
    activeChatUser.value = data.roleBonuses.activeChatUser;

    const tier1Sub = document.getElementById('raffle-bonus-tier1');
    tier1Sub.value = data.roleBonuses.tier1;

    const tier2Sub = document.getElementById('raffle-bonus-tier2');
    tier2Sub.value = data.roleBonuses.tier2;

    const tier3Sub = document.getElementById('raffle-bonus-tier3');
    tier3Sub.value = data.roleBonuses.tier3;

    // Followers only 
    const followersOnly = raffleContainer.querySelector('.restrcitions-main-container .restrictions-container:nth-child(1) input');
    followersOnly.checked = data.restrictions.follower;

    // Subscribers only
    const subsOnly = raffleContainer.querySelector('.restrcitions-main-container .restrictions-container:nth-child(2) input');
    subsOnly.checked = data.restrictions.subscriber;

    // VIPs only
    const vipsOnly = raffleContainer.querySelector('.restrcitions-main-container .restrictions-container:nth-child(3) input');
    vipsOnly.checked = data.restrictions.vip;

    // Active users only  
    const activeUsersOnly = raffleContainer.querySelector('.restrcitions-main-container .restrictions-container:nth-child(4) input');
    activeUsersOnly.checked = data.restrictions.activeChatUser;

    const raffleLimit = document.getElementById('raffle-limit-value');
    if (data.limit === false) {
        raffleLimit.value = 0;
    } else {
        raffleLimit.value = data.limit;
    }

}


// Listen for when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
    getAllCurrencies();
});