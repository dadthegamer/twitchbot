import { streamDB, currencyDB, usersDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Follow events handler
export async function onFollow(e) {
    try {
        const { userId } = e;
        const userData = await usersDB.newUser(userId);
        const profileImage = userData.profilePictureUrl;
        const newFollowerData = {
            id: userId,
            displayName: user,
            profilePictureUrl: profileImage,
        };
        await streamDB.setLatestEvent('latestFollower', newFollowerData);
        await currencyDB.addCurrencyForNewFollower(userId);
        addAlert('follow', `${user} followed!`, profileImage);
        await streamDB.addFollower(user);
    }
    catch (error) {
        logger.error(`Error in onFollow eventHandler: ${error}`);
    }
}