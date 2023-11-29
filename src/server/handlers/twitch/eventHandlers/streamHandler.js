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
        const streamInfo = await e.getStream();
        const { title, gameName, startedAt, isMature, tags, gameId } = streamInfo;
        const boxArtURL = await streamInfo.getThumbnailUrl(520, 720);
        cache.set('live', true);
        const streamInfoData = {
            title,
            gameName,
            startedAt,
            isMature,
            tags,
            gameId,
            boxArtURL,
        };
        cache.set('streamInfo', streamInfoData);
        goalDB.setGoalCurrent('dailySubGoal', 0);
        await usersDB.resetStreamProperties();
        logger.info('Stream online');
    }
    catch (error) {
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}