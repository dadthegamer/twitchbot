import { cache, currencyDB, usersDB, webSocket,twitchApi } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


let currentLevel = 1;
let currentProgress = 0;
let partipatedUsers = [];
let topContributor = null;

// Hype Train events
export async function onHypeTrainBegin(e) {
    try {
        const { id, goal, topContributions, level, progress, lastContribution } = e;
        cache.set('hypeTrain', e);
        currentProgress = progress;
        if (level > currentLevel) {
            currentLevel = level;
            currencyDB.rewardAllViewersWithCurrencyForHypeTrainProgress();
        }
        // Check if the last contribution is in the partipated users list. If not, add it.
        if (!partipatedUsers.includes(lastContribution.userId)) {
            partipatedUsers.push(lastContribution.userId);
        }
        // For each top contribution, check if the user is in the partipated users list. If not, add it.
        topContributions.forEach(async (contribution) => {
            if (!partipatedUsers.includes(contribution.userId)) {
                partipatedUsers.push(contribution.userId);
            }
        });
        // Set the top contributor
        topContributor = topContributions[0];
        // Get the top contributor from the Twitch API
        const userData = await twitchApi.getUserById(topContributor.userId);
        const { profilePictureUrl } = userData
        // Set the top contributor
        topContributor = { ...topContributor, profilePictureUrl };
        // Add the top contributor to the event object
        e.topContributor = topContributor;
        webSocket.hypeTrainUpdate(e);
    }
    catch (err) {
        logger.error('error', `Error in onHypeTrainBegin: ${err}`);
    }
}

export async function onHypeTrainProgress(e) {
    try {
        const { id, goal, topContributions, level, progress, lastContribution } = e;
        cache.set('hypeTrain', e);
        currentProgress = progress;
        if (level > currentLevel) {
            currentLevel = level;
            await currencyDB.rewardAllViewersWithCurrencyForHypeTrainProgress();
        }
        // Check if the last contribution is in the partipated users list. If not, add it.
        if (!partipatedUsers.includes(lastContribution.userId)) {
            partipatedUsers.push(lastContribution.userId);
        }
        // Set the top contributor
        topContributor = topContributions[0];
        usersDB.increaseHypeTrainContributions(lastContribution.userId, lastContribution.total);
        const userData = await twitchApi.getUserById(topContributor.userId);
        const { profilePictureUrl } = userData
        // Set the top contributor
        topContributor = { ...topContributor, profilePictureUrl };
        // Add the top contributor to the event object
        e.topContributor = topContributor;
        webSocket.hypeTrainUpdate(e);
    }
    catch (err) {
        logger.error('error', `Error in onHypeTrainProgress: ${err}`);
    }
}

export async function onHypeTrainEnd(e) {
    try {
        const { topContributions } = e;
        cache.set('hypeTrain', e);
        partipatedUsers.forEach(async (userId) => {
            await usersDB.increaseHypeTrainParticipation(userId);
        });
        topContributor = topContributions[0];
        await usersDB.increaseTopHypeTrainContributor(topContributor.userId);
        // Set the top contributor
        topContributor = null;
        currentLevel = 0;
        currentProgress = 0;
        partipatedUsers = [];
        webSocket.hypeTrainUpdate(e);
    }
    catch (err) {
        logger.error('error', `Error in onHypeTrainEnd: ${err}`);
    }
}