import { usersDB, cache, goalDB } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";

export async function onStreamOffline(e) {
    try {
        cache.set('live', false);
        cache.set('streamInfo', null);
        logger.info('Stream offline');
    }
    catch (error) {
        logger.error(`Error in onStreamOffline: ${error}`);
    }
}

export async function onStreamUpdate(e) {
    console.log('Stream updated');
}

export async function onStreamOnline(e) {
    try {
        const streamInfo = e.getStream();
        cache.set('live', true);
        const { title, gameName, startedAt, isMature, tags, gameId, thumbnailUrl } = streamInfo;
        // const boxArtURL = thumbnailUrl.replace('{width}', '1920').replace('{height}', '1080');
        const streamInfoData = {
            title,
            gameName,
            startedAt,
            isMature,
            tags,
            gameId,
            boxArtURL,
        };
        cache.set('viewers', [])
        cache.set('streamInfo', streamInfoData);
        await goalDB.setGoalCurrent('dailySubGoal', 0);
        await usersDB.resetStreamProperties();
        logger.info('Stream online');
    }
    catch (error) {
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}