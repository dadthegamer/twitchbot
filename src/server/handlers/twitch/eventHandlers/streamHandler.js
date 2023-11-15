import { usersDB, cache, streamDB, goalDB, streamathonService } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";
import { startEventListener } from "../../services/twitchEventListenerServices.js";

export async function onStreamOffline(e) {
    try {
        cache.set('live', false);
        cache.set('streamInfo', null);
        await streamDB.endStream();
        await streamathonService.stopStreamathonTimer();
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
            boxArtURL
        };
        cache.set('streamInfo', streamInfoData);
        goalDB.setGoalCurrent('dailySubGoal', 0);
        const existingStream = await streamDB.getStreamData();
        if (existingStream !== null) {
            return;
        } else {
            await streamDB.startStream(title, gameName);
            await usersDB.resetArrived();
            await usersDB.resetStreamProperties();
        }
        const twitchConnected = cache.get('twitchConnected');
        if (!twitchConnected) {
            startEventListener();
            return;
        }
        streamathonService.startStreamathon();
        logger.info('Stream online');
    }
    catch (error) {
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}