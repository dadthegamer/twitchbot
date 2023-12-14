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

// Function to set the alert color based on the alert type. Need to also set the font color
async function getAlertColorBasedOnAlertType(type) {
    let data = {};
    try {
        switch (type) {
            case 'sub':
                data.alertColor = 'blue';
                data.fontColor = 'white';
                data.displayAlertType = 'Subscriber';
                break;
            case 'resub':
                data.alertColor = 'blue';
                data.fontColor = 'white';
                data.displayAlertType = 're-Subscriber';
                break;
            case 'giftedSub':
                data.alertColor = '#44a6c6';
                data.fontColor = 'black';
                data.displayAlertType = 'Gifted Sub';
                break;
            case 'raid':
                data.alertColor = '#FFC000';
                data.fontColor = 'black';
                data.displayAlertType = 'Raid';
                break;
            case 'follow':
                data.alertColor = '#FFEA00';
                data.fontColor = 'black';
                data.displayAlertType = 'Follower';
                break;
            case 'cheer':
                data.alertColor = '#9146FF';
                data.fontColor = 'white';
                data.displayAlertType = 'Cheer';
                break;
            case 'donation':
                data.alertColor = '#118c4f';
                data.fontColor = 'white';
                data.displayAlertType = 'Donation';
                break;
            default:
                data.alertColor = '#9146FF';
                data.fontColor = 'white';
                data.displayAlertType = 'Alert';
                break;
        }
        return data;
    }
    catch (err) {
        logger.error(`Error in getAlertColorBasedOnAlertType for alerts: ${err}`);
    }
}

export async function addAlert(userId, displayName, alertType, alertMessage) {
    try {
        const sound = getSound(alertType);
        const { alertColor, fontColor, displayAlertType } = await getAlertColorBasedOnAlertType(alertType);
        alertQueue.push({
            displayName,
            alertType,
            alertMessage,
            alertTime,
            sound,
            alertColor,
            fontColor,
            displayAlertType,
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