import logger from '../../utilities/logger.js';
import { chatClient, interactionsDB, usersDB } from '../../config/initializers.js';
import { getRandomInt } from '../../utilities/utils.js';
import { replyHandler } from './replyHandler.js';
import { numberWithCommas } from '../../utilities/utils.js';


let dropStarted = false;
let minDrop = 1;
let maxDrop = 100;
let currency = 'points';
let dropUsers = [];

export async function dropHandler(userId, displayName, isMod, isBroadcaster, messageID = null) {
    try {
        if (isMod  && !dropStarted || isBroadcaster && !dropStarted) {
            startDrop();
        } else {
            userDropHandler(displayName, userId, messageID);
        }
    }
    catch (err) {
        logger.error(`Error in dropHandler: ${err}`);
    }
}

export async function startDrop() {
    try {
        if (dropStarted) {
            return;
        } else {
            const dropSettings = await interactionsDB.getDropSettings();
            minDrop = dropSettings.min;
            maxDrop = dropSettings.max;
            currency = dropSettings.currency;
            dropUsers = [];
            dropStarted = true;
            chatClient.say('Drop started! Type !drop to enter the drop.');
            setTimeout(async () => {
                dropStarted = false;
                chatClient.say('Drop has ended. Stick around for the next one!');
            }, 30000);
        }
    }
    catch (err) {
        logger.error(`Error in startDropHandler: ${err}`);
    }
}

// Function to caclulate the drop amount
export async function calculateDrop() {
    try {
        const drop = getRandomInt(minDrop, maxDrop);
        return drop;
    }
    catch (err) {
        logger.error(`Error in dropHandler: ${err}`);
    }
}

// Function to handle when a user enters the drop
export async function userDropHandler(userDisplayName, userId, messageID = null) {
    try {
        if (!dropStarted) {
            return;
        } else if (dropUsers.includes(userId)) {
            return;
        } else {
            console.log('User entered drop');
            const dropAmount = await calculateDrop();
            const formatDrop = await numberWithCommas(dropAmount);
            await usersDB.increaseCurrency(userId, currency, dropAmount);
            dropUsers.push(userId);
            if (messageID !== null) {
                if (currency === 'raffle') {
                    const dropMessage = `${userDisplayName} has entered the drop and won ${formatDrop} ${currency} raffle tickets!`;
                    replyHandler(dropMessage, messageID);
                } else {
                    const dropMessage = `${userDisplayName} has entered the drop and won ${formatDrop} ${currency} points!`;
                    replyHandler(dropMessage, messageID);
                }
            } else {
                if (currency === 'raffle') {
                    const dropMessage = `${userDisplayName} has entered the drop and won ${formatDrop} ${currency} raffle tickets!`;
                    chatClient.say(dropMessage);
                } else {
                    const dropMessage = `${userDisplayName} has entered the drop and won ${formatDrop} ${currency} points!`;
                    chatClient.say(dropMessage);
                }
            }
        }
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in dropHandler: ${err}`);
    }
}