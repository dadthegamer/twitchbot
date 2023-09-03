import { webSocket } from '../../config/initializers.js';
import { writeToLogFile } from '../../utilities/logging.js';
import { environment } from '../../config/environmentVars.js';

let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;
let baseURL;

if (environment === 'production') {
    baseURL = 'http://192.168.1.31:3500';
} else {
    baseURL = 'http://localhost:3001';
}

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
        writeToLogFile('error', `Error in alertHandler for alerts: ${err}`);
    }
}

// Function to return the sound to play based on alert type
async function getSound(type) {
    try {
        switch (type) {
            case 'sub':
                return `${baseURL}/audio/sub.mp3`;
            case 'resub':
                return `${baseURL}/audio/sub.mp3`;
            case 'giftedsub':
                return `${baseURL}/audio/giftedSubs.mp3`;
            case 'raid':
                return `${baseURL}/audio/raid.mp3`;
            case 'follow':
                return `${baseURL}/audio/newFollower.mp3`;
            case 'cheer':
                return `${baseURL}/audio/cheer.mp3`;
            case 'donation':
                return `${baseURL}/audio/donation.mp3`;
            default:
                return null;
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in getSound for alert: ${err}`);
    }
}

export async function addAlert(alertType, alertMessage, userImg) {
    try {
        const sound = await getSound(alertType);
        alertQueue.push({ 
                        alertType,
                        alertMessage,
                        userImg,
                        alertTime,
                        sound
                    });
    }
    catch (err) {
        writeToLogFile('error', `Error in addAlert: ${err}`);
    }
}

export function clearAlerts() {
    alertQueue = [];
}

export async function startAlertsHandler() {
    alertHandler();
    setTimeout(() => {
        startAlerts();
    }, 500);
}