import { streamDB } from "../../../config/initializers.js";
import { addAlert } from "../../../handlers/alertHandler.js";
import logger from "../../../utilities/logger.js";


// Raid events
export async function onRaid(e) {
    try {
        const { raidingBroadcasterDisplayName, raidingBroadcasterId, viewers } = await e;
        await addAlert(raidingBroadcasterId, raidingBroadcasterDisplayName, 'raid', `raided with ${viewers} viewers!`);
        streamDB.increaseStreamProperty('raids', 1);
        logger.info(`${raidingBroadcasterDisplayName} Raided with ${viewers} viewers!`);
    }
    catch (error) {
        logger.error(`Error in onRaid: ${error}`);
    }
}