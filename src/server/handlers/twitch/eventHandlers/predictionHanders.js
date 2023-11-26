import { cache } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


// Prediction events
export async function onPredictionStart(e) {
    try {
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
        const startDate = e.startDate;
        const lockDate = e.lockDate;
        const predictionTitle = e.title;
        cache.set('prediction', {
            title: predictionTitle,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
        });
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionProgress(e) {
    try {
        for (const outcome of e.outcomes) {
            updatePrediction(outcome.id, outcome.channelPoints, outcome.users);
        }
    }
    catch (error) {
        logger('error', `Error in onPredictionProgress: ${error}`);
    }
}

export async function onPredictionLock(e) {
    try {
        cache.set('prediction', { ...cache.get('prediction'), locked: true });
        // for (const outcome of e.outcomes) {
        //     console.log(`Outcome ${outcome.title} has ${outcome.channelPoints} points`);
        // }
    }
    catch (error) {
        logger('error', `Error in onPredictionLock: ${error}`);
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