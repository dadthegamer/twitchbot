import logger from "../../utilities/logger.js";
import { usersDB, webSocket, cache, currencyDB, schedulerService } from "../../config/initializers.js";
import { sendColorCommand } from "../actionHandlers/lumiaStream.js";
import { firstMessageHandler } from "./firstMessageHandler.js";


export let alertQueue = [];
let alertShowing = false;
let alertTime = 8000;
const botId = process.env.BOTID;


export async function arrivalHandler(context) {
    try {
        const { userId, displayName, color, isVip, isSubscriber, isMod, isBroadcaster, id } = context;
        if (isBroadcaster || userId === botId) {
            return;
        }
        let viewers = cache.get('viewers');
        if (!viewers || viewers === undefined) {
            viewers = [];
            cache.set('viewers', []);
        };
        // Check if the user is already in the viewers list
        const user = viewers.find((viewer) => viewer.userId === userId);
        // If the user is not in the viewers list, add them
        if (!user) {
            viewers.push({
                userId,
                displayName,
                color,
                isVip,
                isSubscriber,
                isMod,
                isBroadcaster,
            });
            cache.set('viewers', viewers);
            const userData = await usersDB.getUserByUserId(userId);
            // Check if the user has already arrived in the database
            if (!userData.arrived) {
                sendColorCommand(color);
                firstMessageHandler(context);
                usersDB.setArrived(userId, true);
                webSocket.userArrived(userId, displayName);
                currencyDB.addCurrencyForArriving(userId);
            }
        } else {
            return;
        }
    }
    catch (err) {
        console.log(err);
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