import { writeToLogFile } from "../../../utilities/logging.js";
import { chatClient } from "../../../config/initializers.js";
import { usersDB } from "../../../config/initializers.js";
import { webSocket } from "../../../config/initializers.js";

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
        writeToLogFile('info', `Welcome message sent for ${displayName}`);
    }
    catch (err) {
        writeToLogFile('error', `Error in setWelcomeMessage: ${err}`)
    }
}