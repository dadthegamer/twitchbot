import { usersDB, cache, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js"
import { addAlert } from "../../../handlers/alertHandler.js";


export async function onBits(e) {
    try {
        const userDisplayName = e.userDisplayName;
        const userId = e.userId;
        const bits = e.bits;
        const userData = await e.getUser();
        const profileImage = userData.profilePictureUrl;
        const newCheerData = {
            id: userId,
            display_name: userDisplayName,
            profile_image_url: profileImage,
        };
        await streamDB.setLatestEvent('latest_cheer', newCheerData);
        await addAlert('cheer', `${userDisplayName} cheered ${bits} bits!`, profileImage);
        await usersDB.increaseBits(userId, bits);
        await streamDB.increaseStreamProperty('bits', bits);
    }
    catch (error) {
        writeToLogFile('error', `Error in onBits: ${error}`);
    }
}