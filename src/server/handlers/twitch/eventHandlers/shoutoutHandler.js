import { cache, currencyDB, usersDB } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


export async function onShoutoutCreated(e) {
    try {
        const { shoutedOutBroadcasterDisplayName, shoutedOutBroadcasterId, shoutedOutBroadcasterName } = e;
        const shoutedOutUser = await e.getShoutedOutBroadcaster();
        const { profilePictureUrl } = shoutedOutUser;
        cache.set('shoutout', e);
    }
    catch (err) {
        logger.error('error', `Error in onShoutoutCreated: ${err}`);
    }
}