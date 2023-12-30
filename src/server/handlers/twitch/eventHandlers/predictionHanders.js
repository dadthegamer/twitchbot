import { cache, webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


// Prediction events
export async function onPredictionStart(e) {
    try {
        const { title, lockDate, startDate} = await e
        const outcomeArray = [];
        e.outcomes.forEach((outcome) => {
            outcomeArray.push({
                id: outcome.id,
                title: outcome.title,
                color: outcome.color,
                channelPoints: outcome.channelPoints,
                users: outcome.users,
            });
        });
        cache.set('prediction', {
            active: true,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
        });
        webSocket.prediction(cache.get('prediction'));
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionProgress(e) {
    try {
        const { title, lockDate, startDate } = await e
        const outcomeArray = [];
        e.outcomes.forEach((outcome) => {
            outcomeArray.push({
                id: outcome.id,
                title: outcome.title,
                color: outcome.color,
                channelPoints: outcome.channelPoints,
                users: outcome.users,
            });
        });
        cache.set('prediction', {
            active: true,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
        });
        webSocket.prediction(cache.get('prediction'));
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionProgress: ${error}`);
    }
}

export async function onPredictionLock(e) {
    try {
        const { title, lockDate, startDate} = await e
        const outcomeArray = [];
        e.outcomes.forEach((outcome) => {
            outcomeArray.push({
                id: outcome.id,
                title: outcome.title,
                color: outcome.color,
                channelPoints: 0,
                users: 0,
            });
        });
        cache.set('prediction', {
            active: false,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
        });
        webSocket.prediction('start', cache.get('prediction'));
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionEnd(e) {
    try {
        cache.set('prediction', null);
        // for (const outcome of e.outcomes) {
        //     console.log(`Outcome ${outcome.title} has ${outcome.channelPoints} points`);
        // }
    }
    catch (error) {
        logger('error', `Error in onPredictionEnd: ${error}`);
    }
}


// Helper functions
// Function to update the prediction
async function updatePrediction(outcomeId, channelPoints, users) {
    try {
        const prediction = cache.get('prediction');
        const outcomeIndex = prediction.outcomes.findIndex((outcome) => outcome.id === outcomeId);
        prediction.outcomes[outcomeIndex].channelPoints = channelPoints;
        prediction.outcomes[outcomeIndex].users = users;
        cache.set('prediction', prediction);
    }
    catch (error) {
        logger('error', `Error in updatePrediction: ${error}`);
    }
}