import { webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";
import { usersDB, streamDB, currencyDB } from "../../../config/initializers.js";
import { firstMessageHandler } from "./firstMessageHandler.js";

export let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


export async function arrivalHandler(context, streamData) {
    try {
        // Check if the userId is in the streamData viewers array
        if (!streamData.viewers.includes(context.userId)) {
            return;
        } else {
            const { bot, msg, userDisplayName, userId, say, timeout, reply, messageID } = context;
            const userData = await usersDB.getUserByUserId(userId);
            const arrived = userData.arrived;
            if (arrived) {
                return;
            } else {
                await streamDB.addViewer(userId);
                await usersDB.updateUserByUserId(userId, { arrived: true });
                const points = await userData.currency.leaderboard;
                await currencyDB.addCurrencyForArriving(userId);
                addWelcomeAlert(userId, userDisplayName, points);
                // Check if viewers length is less than 3
                if (streamData.viewers.length < 3) {
                    firstMessageHandler(context);
                }
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