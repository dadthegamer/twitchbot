import { webSocket, twitchApi } from '../config/initializers.js';
import logger from '../utilities/logger.js';


let alertQueue = [];
let alertShowing = false;
let alertTime = 15000;


async function alertHandler() {
    try {
        if (alertQueue.length > 0 && !alertShowing) {
            let alert = alertQueue.shift();
            alertShowing = true;
            webSocket.highlightedMessage(alert);
            setTimeout(() => {
                alertShowing = false;
            }, alertTime);
        }
    }
    catch (err) {
        logger.error(`Error in alertHandler for highlighted message: ${err}`);
    }
}

export async function addHighlightedAlert(userId, displayName, message) {
    try {
        const userData = await twitchApi.getUserDataById(userId);
        if (userData) {
            const { profilePictureUrl } = userData;
            const profilePic = profilePictureUrl;
            alertQueue.push({
                displayName,
                message,
                profilePic,
                alertTime,
            });
        }
    }
    catch (err) {
        logger.error(`Error in adding alert for highlighted message: ${err}`);
    }
}

export function clearAlerts() {
    alertQueue = [];
}

export function startHighlightedMessageAlertsHandler() {
    if (!alertShowing) {
        alertHandler();
    }
    setTimeout(startHighlightedMessageAlertsHandler, 500);
}