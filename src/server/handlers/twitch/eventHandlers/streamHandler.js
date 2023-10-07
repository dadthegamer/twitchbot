import { usersDB, cache, streamDB, goalDB } from "../../../config/initializers.js";
import logger from "../../../utilities/logger.js";


export async function onStreamOffline(e) {
    try {
        cache.set('live', false);
        cache.set('streamTitle', '');
        cache.set('streamGame', '');
        cache.set('streamStartedAt', null);
        await streamDB.endStream();
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
        const { title, gameName } = streamInfo;
        cache.set('live', true);
        cache.set('streamTitle', title);
        cache.set('streamGame', gameName);
        cache.set('streamStartedAt', new Date());
        cache.set('streamSubs', 0);
        cache.set('streamSubGoal', 0);
        cache.set('streamBits', 0);
        cache.set('streamDonations', 0);
        cache.set('streamFollowers', 0);
        goalDB.setGoalCurrent('dailySubGoal', 0);
        const existingStream = await streamDB.getStreamData();
        if (existingStream !== null) {
            cache.set('streamSubs', existingStream.total_subs);
            cache.set('viewers', existingStream.viewers);
            cache.set('streamDonations', existingStream.donations);
            cache.set('streamBits', existingStream.bits);
        } else {
            await streamDB.startStream(title, gameName);
            await usersDB.resetArrived();
            await usersDB.resetStreamProperties();
        }
        logger.info('Stream online');
    }
    catch (error) {
        logger.error(`Error in onStreamOnline: ${error}`);
    }
}