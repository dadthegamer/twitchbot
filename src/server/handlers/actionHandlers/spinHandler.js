import { gameService } from '../../config/initializers.js';
import { replyHandler } from './replyHandler.js';
import { cache } from '../../config/initializers.js';
import { numberWithCommas } from '../../utilities/utils.js';
import { usersDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';



const maxJackPot = 100;

// Function that returns a whole number between two numbers
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to increase the jackpot amount
export async function increaseJackpot(amount) {
    try {
        gameService.increaseJackpot(amount);
        cache.set('jackpot', cache.get('jackpot') + amount);
    }
    catch (err) {
        logger.error(`Error in increaseJackpot: ${err}`);
    }
}

// Function to get the jackpot amount
export async function getJackpot() {
    try {
        const jackpot = cache.get('jackpot');
        return jackpot;
    }
    catch (err) {
        logger.error(`Error in getJackpot: ${err}`);
    }
}

// Function to set the jackpot amount
export async function setJackpot(amount) {
    try {
        const jackpot = gameService.setJackpot(amount);
        return jackpot;
    }
    catch (err) {
        logger.error(`Error in setJackpot: ${err}`);
    }
}

// Function to handle the spin
export async function spinHandler(userDisplayName, userId, messageID = null) {
    try {
        const jackpotData = await getJackpot();
        const { currency, jackpotPCT } = jackpotData;
        const spin = getRandomInt(1, maxJackPot);
        if (spin <= jackpotPCT) {
            const amount = jackpotData.jackpot;
            await usersDB.increaseCurrency(userId, jackpotData.currency, amount);
            const formatJackpot = await numberWithCommas(amount);
            await gameService.resetJackpot();
            if (currency === 'raffle') {
                replyHandler(`@${userDisplayName} you won the jackpot of ${formatJackpot} raffle tickets!`, messageID);
            } else {
                replyHandler(`@${userDisplayName} won the jackpot and won ${formatJackpot} ${currency} points!`, messageID);
            }
        } else {
            let jackPotWin = jackpotData.jackpot;
            const increaseBy = getRandomInt(jackpotData.increaseBy.min, jackpotData.increaseBy.max);
            await gameService.increaseJackpot(increaseBy);
            jackPotWin += increaseBy;
            const formatJackpot = await numberWithCommas(jackPotWin);
            if (currency === 'raffle') {
                // If the jackpot is in raffle tickets, we need to convert it to points
                replyHandler(`@${userDisplayName} you did not win! The jackpot is now at ${formatJackpot} raffle tickets!`, messageID);
            } else {
                replyHandler(`@${userDisplayName} you did not win! The jackpot is now at ${formatJackpot} ${currency} points!`, messageID);
            }
        }
    }
    catch (err) {
        logger.error(`Error in spinHandler: ${err}`);
    }
}
