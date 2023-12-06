import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Raid events
export async function onRaid(e) {
    try {
        const { raidingBroadcasterDisplayName, raidingBroadcasterId, viewers } = await e;
        const userData = e.getRaidedBroadcaster();
        const { profilePictureUrl } = await userData;
        addAlert(raidingBroadcasterId, raidingBroadcasterDisplayName, 'raid', `${raidingBroadcasterDisplayName} raided with ${viewers} viewers!`, profilePictureUrl);
        logger.info(`${raidingBroadcasterDisplayName} Raided with ${viewers} viewers!`);
    }
    catch (error) {
        logger.error(`Error in onRaid: ${error}`);
    }
}