import { webSocket } from '../config/initializers.js';
import logger from '../utilities/logger.js';


let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


async function alertHandler() {
    try {
        if (alertQueue.length > 0 && !alertShowing) {
            let alert = alertQueue.shift();
            alertShowing = true;
            webSocket.alert(alert);
            setTimeout(() => {
                alertShowing = false;
            }, alertTime);
        }
    }
    catch (err) {
        logger.error(`Error in alertHandler: ${err}`);
    }
}

// Function to return the sound to play based on alert type
function getSound(type) {
    try {
        switch (type) {
            case 'sub':
                return `/audio/newSubscriber.mp3`;
            case 'resub':
                return `/audio/newSubscriber.mp3`;
            case 'giftedSub':
                return `/audio/giftedSubs.mp3`;
            case 'raid':
                return `/audio/raid.mp3`;
            case 'follow':
                return `/audio/newFollower.mp3`;
            case 'cheer':
                return `/audio/cheer.mp3`;
            case 'donation':
                return `/audio/donation.mp3`;
            default:
                return `/audio/newFollower.mp3`;
        }
    }
    catch (err) {
        logger.error(`Error in getSound for alerts: ${err}`);
    }
}

export async function addAlert(userId, displayName, alertType, alertMessage) {
    try {
        const sound = getSound(alertType);
        alertQueue.push({
            displayName,
            alertType,
            alertMessage,
            alertTime,
            sound
        });
    }
    catch (err) {
        logger.error(`Error in addAlert: ${err}`);
    }
}

export function clearAlerts() {
    alertQueue = [];
}

export function startAlertsHandler() {
    if (!alertShowing) {
        alertHandler();
    }
    setTimeout(startAlertsHandler, 500);
}