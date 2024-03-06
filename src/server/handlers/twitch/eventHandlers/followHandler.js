import { usersDB, eventServices, streamDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Follow events handler
export async function onFollow(e) {
    try {
        const { userId, userDisplayName } = await e;
        const userData = e.getUser();
        const profileImage = userData.profilePictureUrl;
        usersDB.newUser(userId);
        addAlert(userId, userDisplayName, 'follow', `${userDisplayName} just followed!`);
        eventServices.handleEvent('onFollow', { userId, displayName: userDisplayName });
        streamDB.addFollower(userDisplayName);
        streamDB.updateLatestFollower({ displayName: userDisplayName, userId, profilePic: profileImage });
        logger.info(`${userDisplayName} followed!`);
    }
    catch (error) {
        logger.error(`error in onFollow eventHandler: ${error}`);
    }
}