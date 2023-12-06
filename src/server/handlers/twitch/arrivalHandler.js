import logger from "../../utilities/logger.js";
import { usersDB, streamDB, currencyDB, webSocket, cache } from "../../config/initializers.js";


export let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


export async function arrivalHandler(context) {
    try {
        const streamData = cache.get('stream');
        // Check if the userId is in the streamData viewers array
        if (!streamData.viewers.includes(context.userId)) {
            return;
        } else {
            const { displayName, userId } = context;
            logger.info(`Arrival Handler: ${displayName} has arrived!`);
            const userData = await usersDB.getUserByUserId(userId);
            const arrived = userData.arrived;
            if (arrived) {
                return;
            } else {
                streamDB.addViewer(userId);
                usersDB.setUserValue(userId, 'arrived', true);
                // const points = await userData.currency.leaderboard;
                // await currencyDB.addCurrencyForArriving(userId);
                // addWelcomeAlert(userId, displayName, points);
                // Check if viewers length is less than 3
                // if (streamData.viewers.length < 3) {
                //     firstMessageHandler(context);
                // }
            }
        }
    }
    catch (err) {
        logger.error(`Error in arrivalHandler: ${err}`);
    }
}

function welcomeAlertHandler() {
    try {
        if (alertQueue.length > 0 && !alertShowing) {
            let alert = alertQueue.shift();
            alertShowing = true;
            webSocket.welcomeMessage(alert);
            setTimeout(() => {
                alertShowing = false;
            }, alertTime);
        }
    }
    catch (err) {
        logger.error(`Error in welcomeAlertHandler: ${err}`);
    }
}

export async function addWelcomeAlert(userId, userName, currency) {
    try {
        const profilePic = await usersDB.getUserProfileImageUrl(userId);
        alertQueue.push({
            img: profilePic,
            points: currency,
            displayName: userName,
        });
    }
    catch (err) {
        logger.error(`Error in addWelcomeAlert: ${err}`);
    }
}

export async function startWelcomeAlerts() {
    welcomeAlertHandler();
    setTimeout(() => {
        startWelcomeAlerts();
    }, 500);
}