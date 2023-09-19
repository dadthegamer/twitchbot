import { streamDB, currencyDB, usersDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";



export async function onDonation(data) {
    try {
        const { username, amount } = data.data;
        const userData = await usersDB.get;
        const { id, displayName, profilePictureUrl } = userData;
        const newCheerData = {
            id: userId,
            display_name: userDisplayName,
            profile_image_url: profileImage,
        };
        await setLatestEvent('latest_donation', userData);
        await streamDB.setLatestEvent('latestDonation', newCheerData);
        await addDonation(id, amount);
    }
    catch (error) {
        writeToLogFile('error', `Error in onDonation: ${error}`);
    }
}