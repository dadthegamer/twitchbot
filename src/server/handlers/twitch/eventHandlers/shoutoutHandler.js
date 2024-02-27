import { cache, webSocket } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


export async function onShoutoutCreated(e) {
    try {
        const { shoutedOutBroadcasterDisplayName, shoutedOutBroadcasterId, shoutedOutBroadcasterName } = e;
        const shoutedOutUser = await e.getShoutedOutBroadcaster();
        const { profilePictureUrl, displayName } = shoutedOutUser;
        const streamInfo = await shoutedOutUser.getStream();
        const { gameName } = streamInfo;
        console.log(`Shoutout created for ${shoutedOutBroadcasterDisplayName}`);
        webSocket.shoutout(displayName, profilePictureUrl, gameName);
    }
    catch (err) {
        console.log('error', `Error in onShoutoutCreated: ${err}`);
        logger.error('error', `Error in onShoutoutCreated: ${err}`);
    }
}