import { writeToLogFile } from "../utilities/logging.js";
import { webSocket } from "../config/initializers.js";

export let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;


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
        writeToLogFile('error', `Error in alertHandler for alerts: ${err}`);
    }
}


export async function addWelcomeAlert(userId, userName) {
    try {
        const points = await getUserProperty(userId, 'leaderboard_points')
        alertQueue.push({
                    img: await getProfilePic(userId),
                    points: points,
                    displayName: userName,
        });
    }
    catch (err) {
        writeToLogFile('error', `Error in addAlert for welcome message: ${err}`);
    }
}

export async function startWelcomeAlerts() {
    welcomeAlertHandler();
    setTimeout(() => {
        startWelcomeAlerts();
    }, 500);
}