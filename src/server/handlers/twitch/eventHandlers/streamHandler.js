import { usersDB, cache, goalDB, webSocket, twitchApi } from "../../../config/initializers.js";
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
        cache.set('viewers', [])
        cache.set('first', []);
        const { title, gameName, startedAt, isMature, tags, gameId } = streamInfo;
        const thumbnailUrl = await twitchApi.getGameById(gameId);
        const streamInfoData = {
            title,
            gameName,
            startedAt,
            isMature,
            tags,
            gameId,
            thumbnailUrl,
        };
        cache.set('streamInfo', streamInfoData);
        await goalDB.setGoalCurrent('dailySubGoal', 0);
        await usersDB.resetStreamProperties();
        webSocket.streamLive(streamInfoData);
        logger.info('Stream online');
    }
    catch (error) {
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}