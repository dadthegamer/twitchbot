import { webSocket } from '../config/initializers.js';
import logger from '../utilities/logger.js';
import { usersDB } from '../config/initializers.js';

let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


function alertHandler() {
    try {
        if (alertQueue.length > 0  && !alertShowing) {
            let alert = alertQueue.shift();
            alertShowing = true;
            webSocket.alert(alert);
            setTimeout(() => {
                alertShowing = false;
            }, alertTime);
        }
    }
    catch (err) {
        logger.error('error', `Error in alertHandler: ${err}`);
    }
}

// Function to return the sound to play based on alert type
async function getSound(type) {
    try {
        switch (type) {
            case 'sub':
                return `/audio/sub.mp3`;
            case 'resub':
                return `/audio/sub.mp3`;
            case 'giftedsub':
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
        logger.error('error', `Error in getSound for alerts: ${err}`);
    }
}

export async function addAlert(userId, displayName, alertType, alertMessage) {
    try {
        const profileImg = await usersDB.getUserProfileImageUrl(userId);
        const sound = await getSound(alertType);
        alertQueue.push({ 
                        displayName,
                        alertType,
                        alertMessage,
                        profileImg,
                        alertTime,
                        sound
                    });
    }
    catch (err) {
        logger.error('error', `Error in addAlert: ${err}`);
    }
}

export function clearAlerts() {
    alertQueue = [];
}

export async function startAlertsHandler() {
    alertHandler();
    setTimeout(() => {
        startAlertsHandler();
    }, 500);
}