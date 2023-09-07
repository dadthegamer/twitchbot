import { streamDB } from '../../config/initializers.js';
import { replyHandler } from './replyHandler.js';
import { cache } from '../../config/initializers.js';
import { numberWithCommas } from '../../utilities/utils.js';
import { usersDB } from '../../config/initializers.js';


let pct = 750;
const maxJackPot = 10000;

// Function that returns a whole number between two numbers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to increase the jackpot amount
export async function increaseJackpot(amount) {
    try {
        streamDB.increaseJackpot(amount);
        cache.set('jackpot', cache.get('jackpot') + amount);
    }
    catch (err) {
        console.log(err);
    }
}

// Function to get the jackpot amount
export async function getJackpot() {
    try {
        const jackpot = cache.get('jackpot');
        return jackpot;
    }
    catch (err) {
        console.log(err);
    }
}

// Function to set the jackpot amount
export async function setJackpot(amount) {
    try {
        const jackpot = streamDB.setJackpot(amount);
        return jackpot;
    }
    catch (err) {
        console.log(err);
    }
}

// Spinning Function
export async function spin() {
    const spin = getRandomInt(1, maxJackPot);
    if (spin <= pct) {
        return true;
    } else {
        return false;
    }
}


// Function to handle the spin
export async function spinHandler(userDisplayName, userId, messageID) {
    const spinResult = await spin();
    if (spinResult === true) {
        const amount = await getJackpot();
        await usersDB.increaseUserValue(userId, 'leaderboard_points', amount);
        const formatJackpot = numberWithCommas(amount);
        await setJackpot(25000);
        replyHandler(`@${userDisplayName} won the jackpot and won ${formatJackpot} points!`, messageID);
    } else {
        let jackPotWin = await getJackpot();
        jackPotWin = jackPotWin + getRandomInt(1000, 2000);
        await setJackpot(jackPotWin);
        const formatJackpot = numberWithCommas(jackPotWin);
        replyHandler(`did not win. The jackpot is now ${formatJackpot} points!`, messageID);
    }
}
