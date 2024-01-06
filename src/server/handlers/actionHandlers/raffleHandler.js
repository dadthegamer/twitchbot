import logger from '../../utilities/logger.js';
import { chatClient, interactionsDB, usersDB } from '../../config/initializers.js';
import { replyHandler } from './replyHandler.js';
import { numberWithCommas } from '../../utilities/utils.js';


let raffleStarted = false;
let raffleUsers = [];
let currency = 'points';


export async function startRaffle(amount) {
    try {
        if (raffleStarted) {
            return;
        } else {
            const raffleSettings = await interactionsDB.getRaffleSettings();
            currency = raffleSettings.currency;
            raffleUsers = [];
            raffleStarted = true;
            chatClient.say(`Raffle started! Type !join to enter the raffle. The winner will receive ${await numberWithCommas(amount)} ${currency} points.`);
            // Set 2 timeouts. 1 for 30 seconds and 1 for 60 seconds. After 30 seconds put in the chat that the raffle is ending in 30 seconds. After 60 seconds end the raffle.
            setTimeout(async () => {
                chatClient.say('Raffle ending in 30 seconds. Type !join to enter the raffle.');
            }, 30000);
            setTimeout(async () => {
                raffleStarted = false;
                chatClient.say('Raffle has ended. Stick around for the next one!');
                if (raffleUsers.length === 0) {
                    return;
                } else {
                    // Get the winner of the raffle by getting a random user from the raffleUsers array
                    const winner = raffleUsers[Math.floor(Math.random() * raffleUsers.length)];
                    // Add the points to the winner
                    await usersDB.increaseCurrency(winner.userId, currency, amount);
                    // Put in chat who won
                    chatClient.say(`${winner.displayName} has won the raffle and received ${await numberWithCommas(amount)} ${currency} points!`);
                }
            }, 30000);
        }
    }
    catch (err) {
        logger.error(`Error in startRaffleHandler: ${err}`);
    }
}

export async function joinRaffle(userId, displayName, messageID = null) {
    try {
        if (!raffleStarted) {
            return;
        } else if (raffleUsers.includes({ userId, displayName })) {
            replyHandler('You have already entered the raffle.', displayName, messageID);
            return;
        } else {
            raffleUsers.push({ userId, displayName });
            replyHandler(`${displayName} has joined the raffle!`, messageID);
        }
    }
    catch (err) {
        logger.error(`Error in joinRaffleHandler: ${err}`);
    }
}