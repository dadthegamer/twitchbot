import { usersDB, cache, streamDB } from "../../../config/initializers.js";
import { writeToLogFile } from "../../../utilities/logging.js";


export async function onStreamOffline(e) {
    try {
        cache.set('live', false);
        cache.set('streamTitle', '');
        cache.set('streamGame', '');
        cache.set('streamStartedAt', null);
        await streamDB.endStream();
        writeToLogFile('info', 'Stream offline');
    }
    catch (error) {
        writeToLogFile('error', `Error in onStreamOffline: ${error}`);
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
        writeToLogFile('info', 'Stream online');
    }
    catch (error) {
        writeToLogFile('error', `Error in onStreamOnline: ${error}`);
    }
}