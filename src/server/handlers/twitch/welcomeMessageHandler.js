import { chatClient } from "../../../config/initializers.js";
import { usersDB } from "../../../config/initializers.js";
import { webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";

export async function setWelcomeMessage(userId, displayName) {
    const userData = await getUserData(userId);
    if (await userData.arrived === true) {
        return;
    }
    try {
        await usersDB.setUserValue(userId, 'arrived', true);
        const userData = await usersDB.getUserByUserId(userId);
        if (userData !== null) {
            const shoutout = userData.shoutout;
            if (shoutout !== undefined || shoutout !== null) {
                const userimg = userData.profile_image_url;
                chatClient.say(`@${displayName} has arrived! ${shoutout}`);
                webSocket.TTS({
                    img: userimg,
                    message: shoutout,
                })
            }
        }
        await addWelcomeAlert(userId, displayName);
        logger.info(`Welcome message set for ${displayName}`);
    }
    catch (err) {
        logger.error(`Error in setWelcomeMessage: ${err}`);
    }
}