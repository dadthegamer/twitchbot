import { streamDB, currencyDB, usersDB, streamathonService } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Follow events handler
export async function onFollow(e) {
    try {
        const { userId, userDisplayName } = await e;
        const userData = await e.getUser();
        const { profilePictureUrl } = userData;
        await usersDB.newUser(userId);
        // const newFollowerData = {
        //     id: userId,
        //     displayName: userDisplayName,
        //     profilePictureUrl: profilePictureUrl,
        // };
        // await streamDB.setLatestEvent('latestFollower', newFollowerData);
        await currencyDB.addCurrencyForNewFollower(userId);
        addAlert(userId, userDisplayName, 'follow', 'followed!');
        logger.info(`${userDisplayName} followed!`);
    }
    catch (error) {
        logger.error(`Error in onFollow eventHandler: ${error}`);
    }
}