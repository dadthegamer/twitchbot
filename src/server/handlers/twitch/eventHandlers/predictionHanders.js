import { cache, webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";
import { respondToPredictionTitle } from "../../../services/openAi.js";


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
                topPredictors: [],
            });
        });
        // Calculate the total number of users and channel points used in the prediction
        let totalUsers = 0;
        let totalChannelPoints = 0;
        outcomeArray.forEach((outcome) => {
            // If the channel points or users is NaN, set it to 0
            if (isNaN(outcome.channelPoints)) outcome.channelPoints = 0;
            if (isNaN(outcome.users)) outcome.users = 0;
            totalUsers += outcome.users;
            totalChannelPoints += outcome.channelPoints;
        });
        // Calculate the percentage of users that voted for each outcome
        outcomeArray.forEach((outcome) => {
            outcome.percentage = Math.round((outcome.channelPoints / totalChannelPoints) * 100);
            // If the percentage is NaN, set it to 0
            if (isNaN(outcome.percentage)) outcome.percentage = 0;
        });
        cache.set('prediction', {
            active: true,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
            totalUsers: totalUsers,
            totalChannelPoints: totalChannelPoints,
        });
        const response = await respondToPredictionTitle(title);
        webSocket.prediction(cache.get('prediction'));
        webSocket.TTS(response);
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionProgress(e) {
    try {
        const { title, lockDate, startDate} = await e
        const outcomeArray = [];
        e.outcomes.forEach((outcome) => {
            // For each top predictor, add the percentage of users that voted for that outcome
            let topPredictors = [];
            outcome.topPredictors.forEach((predictor) => {
                topPredictors.push({
                    userId: predictor.userId,
                    userDisplayName: predictor.userDisplayName,
                    channelPointsUsed: predictor.channelPointsUsed,
                });
            });
            outcomeArray.push({
                id: outcome.id,
                title: outcome.title,
                color: outcome.color,
                channelPoints: outcome.channelPoints,
                users: outcome.users,
                topPredictors: topPredictors,
            });
        });
        // Calculate the total number of users and channel points used in the prediction
        let totalUsers = 0;
        let totalChannelPoints = 0;
        outcomeArray.forEach((outcome) => {
            // If the channel points or users is NaN, set it to 0
            if (isNaN(outcome.channelPoints)) outcome.channelPoints = 0;
            if (isNaN(outcome.users)) outcome.users = 0;
            totalUsers += outcome.users;
            totalChannelPoints += outcome.channelPoints;
        });
        // Calculate the percentage of users that voted for each outcome
        outcomeArray.forEach((outcome) => {
            outcome.percentage = Math.round((outcome.channelPoints / totalChannelPoints) * 100);
        });
        cache.set('prediction', {
            active: true,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
            totalUsers: totalUsers,
            totalChannelPoints: totalChannelPoints,
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
                channelPoints: outcome.channelPoints,
                users: outcome.users,
            });
        });
        // Calculate the total number of users and channel points used in the prediction
        let totalUsers = 0;
        let totalChannelPoints = 0;
        outcomeArray.forEach((outcome) => {
            // If the channel points or users is NaN, set it to 0
            if (isNaN(outcome.channelPoints)) outcome.channelPoints = 0;
            if (isNaN(outcome.users)) outcome.users = 0;
            totalUsers += outcome.users;
            totalChannelPoints += outcome.channelPoints;
        });
        // Calculate the percentage of users that voted for each outcome
        outcomeArray.forEach((outcome) => {
            outcome.percentage = Math.round((outcome.channelPoints / totalChannelPoints) * 100);
        });
        cache.set('prediction', {
            active: false,
            title: title,
            outcomes: outcomeArray,
            startDate: startDate,
            lockDate: lockDate,
            locked: false,
            predictionWindow: lockDate - startDate,
            totalUsers: totalUsers,
            totalChannelPoints: totalChannelPoints,
        });
        webSocket.prediction(cache.get('prediction'));
        return;
    }
    catch (error) {
        logger('error', `Error in onPredictionStart: ${error}`);
    }
}

export async function onPredictionEnd(e) {
    try {
        cache.set('prediction', null);
    }
    catch (error) {
        logger('error', `Error in onPredictionEnd: ${error}`);
    }
}