import { usersDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Follow events handler
export async function onFollow(e) {
    try {
        const { userId, userDisplayName } = await e;
        const userData = await e.getUser();
        const { profilePictureUrl } = userData;
        usersDB.newUser(userId);
        addAlert(userId, userDisplayName, 'follow', `${userDisplayName} just followed!`, profilePictureUrl);
        logger.info(`${userDisplayName} followed!`);
    }
    catch (error) {
        logger.error(`Error in onFollow eventHandler: ${error}`);
    }
}