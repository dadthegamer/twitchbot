import logger from '../../utilities/logger.js';
import { chatClient, webSocket, twitchApi, cache, gameService } from '../../config/initializers.js';
import { numberWithCommas } from '../../utilities/utils.js';


let users = [];
let bitsWar = false;
let firstPlace = null;


export async function addBitsToUser(userId, displayName, profileImage, bitsAmount) {
    try {
        // Check if user is already in the list
        let user = users.find(user => user.userId === userId);
        if (user) {
            user.bits += bitsAmount;
        } else {
            users.push({ userId, displayName, profileImage, bits: bitsAmount });
        }
        // Sort the list from highest to lowest
        users.sort((a, b) => b.bits - a.bits);
        // Send the updated list to the display
        webSocket.sendBitsWar(users);
        // Check if the user is now in first place
        if (users[0].userId === userId && firstPlace?.userId !== userId) {
            firstPlace = users[0];
            chatClient.say(`@${displayName} is now in first place with ${numberWithCommas(firstPlace.bits)} total bits!`);
        }
        gameService.rewardBitsCheer(userId, bitsAmount);
    }
    catch (err) {
        logger.error(`Error adding bits to user: ${err}`);
    }
}

export async function startBitsWar(userDisplayName) {
    try {
        bitsWar = true;
        cache.set('bitsWar', true);
        users = [];
        webSocket.sendBitsWar(users);
        twitchApi.sendChannelAnnouncement(`${userDisplayName} has started a bits war! You have 60 seconds to try and become the top cheerer for bonus leaderboard points!`);
        setTimeout(() => {
            endBitsWar();
        }, 60000);
    }
    catch (err) {
        logger.error(`Error starting bits war: ${err}`);
    }
}

export async function endBitsWar() {
    try {
        bitsWar = false;
        cache.set('bitsWar', false);
        if (users.length > 0) {
            firstPlace = users[0];
            chatClient.say(`The bits war has ended! ${firstPlace.displayName} is the top cheerer with ${numberWithCommas(firstPlace.bits)} bits!`);
        }
        users = [];
        webSocket.sendBitsWar(users);
        firstPlace = null;
    }
    catch (err) {
        logger.error(`Error ending bits war: ${err}`);
    }
}