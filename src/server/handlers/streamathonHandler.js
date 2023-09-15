import { webSocket } from '../config/initializers.js';
import { writeToLogFile } from '../utilities/logging.js';


let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


function streamathonAlertHandler() {
    try {
        if (alertQueue.length > 0  && !alertShowing) {
            let alert = alertQueue.shift();
            alertShowing = true;
            webSocket.streamathonUpdate(alert);
            setTimeout(() => {
                alertShowing = false;
            }, alertTime);
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in alertHandler for alerts: ${err}`);
    }
}

export async function addAlert(userName, time) {
    try {
        let alert = {
            userName,
            time,
        }
        alertQueue.push(alert);
    }
    catch (err) {
        writeToLogFile('error', `Error in addAlert: ${err}`);
    }
}

export function clearStreamathonAlerts() {
    alertQueue = [];
}

export async function startStreamathonAlertsHandler() {
    streamathonAlertHandler();
    setTimeout(() => {
        startStreamathonAlertsHandler();
    }, 500);
}