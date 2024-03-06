import { usersDB, goalDB,webSocket, streamDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


//Subscription events
export async function onSubscription(e) {
    try {
        const { userName, userDisplayName, userId, cumulativeMonths, durationMonths, streakMonths, messageText } = await e;
        const tier = e.tier / 1000;
        const userData = e.getUser();
        const profileImage = userData.profilePictureUrl;
        usersDB.setUserValue(e.userId, 'cumulativeMonths', cumulativeMonths);
        usersDB.setUserValue(e.userId, 'durationMonths', durationMonths);
        usersDB.setUserValue(e.userId, 'streakMonths', streakMonths);
        addAlert(userId, userDisplayName, 'resub', `${userDisplayName} re-subscribed for ${cumulativeMonths} months!`, profileImage);
        if (cumulativeMonths === 1) {
            goalDB.increaseSubGoals(1);
            streamDB.updateLatestSub({ displayName: userDisplayName, userId, profilePic: profileImage})
        }
        if (messageText) {
            webSocket.TTS({ message: messageText, img: profileImage });
        }
        logger.info(`Subscription event: ${userDisplayName} re-subscribed at tier ${tier}!`);
    }
    catch (error) {
        logger.error(`Error in onSubscription: ${error}`);
    }
}