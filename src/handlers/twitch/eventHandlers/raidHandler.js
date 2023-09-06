import { writeToLogFile } from "../../../utilities/logging.js";
import { streamDB, usersDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";


// Raid events
export async function onRaid(e) {
    try {
        const user = e.raidingBroadcasterDisplayName;
        const viewers = e.viewers;
        const userData = await e.getRaidingBroadcaster();
        const profileImage = userData.profilePictureUrl;
        await addAlert('raid', `${user} raided with ${viewers} viewers!`, profileImage);
        streamDB.increaseStreamProperty('raids', 1);
        writeToLogFile('info', `User ${user} raided with ${viewers} viewers`);
    }
    catch (error) {
        writeToLogFile('error', `Error in onRaid: ${error}`);
    }
}