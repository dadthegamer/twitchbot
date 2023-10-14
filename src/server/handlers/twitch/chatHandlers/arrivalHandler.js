import { webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";
import { usersDB } from "../../../config/initializers.js";

export let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


export async function arrivalHandler(context) {
    try {
        const { bot, msg, userDisplayName, userId, say, timeout, reply, messageID } = context;
        const userData = await usersDB.getUserByUserId(userId);
        const arrived = userData.arrived;
        if (arrived) {
            return;
        } else {
            await usersDB.updateUserByUserId(userId, { arrived: true });
            const points = await userData.currency.leaderboard;
            addWelcomeAlert(userId, userDisplayName, points);
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