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
    try {
        const { streamTitle, categoryName, categoryId } = e;
        const { boxArtUrl, name } = await e.getGame();
        const modifiedThumbnailUrl = boxArtUrl.replace('{width}', '1440').replace('{height}', '1920');
        const streamInfoData = {
            title: streamTitle,
            gameName: name,
            thumbnailUrl: modifiedThumbnailUrl
        };
        // Update title, game name, and thumbnail url in cache
        const streamInfo = cache.get('streamInfo');
        if (streamInfo) {
            streamInfo.title = streamTitle;
            streamInfo.gameName = name;
            streamInfo.thumbnailUrl = thumbnailUrl;
            cache.set('streamInfo', streamInfo);
        } else {
            cache.set('streamInfo', streamInfoData);
        }
        webSocket.streamUpdate(streamInfoData);
    }
    catch (error) {
        logger.error(`Error in onStreamUpdate: ${error}`);
    }
}

export async function onStreamOnline(e) {
    try {
        const streamInfo = await e.getStream();
        cache.set('live', true);
        cache.set('viewers', [])
        cache.set('first', []);
        await goalDB.setGoalCurrent('dailySubGoal', 0);
        await usersDB.resetStreamProperties();
        await usersDB.resetArrived();
        const { title, gameName, startDate, isMature, tags, gameId, thumbnailUrl } = streamInfo;
        const modifiedThumbnailUrl = thumbnailUrl.replace('{width}', '1440').replace('{height}', '1920');
        const streamInfoData = {
            title,
            gameName,
            startDate,
            isMature,
            tags,
            gameId,
            thumbnailUrl: modifiedThumbnailUrl
        };
        cache.set('streamInfo', streamInfoData);
        webSocket.streamLive(streamInfoData);
        logger.info('Stream online');
    }
    catch (error) {
        console.log(error);
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}