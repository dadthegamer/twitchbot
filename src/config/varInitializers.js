import { cache } from "./initializers.js";
import { writeToLogFile } from "../utilities/logging.js";

// Function to set initial values for the cache
export async function setInitialCacheValues() {
    try {
        // Set the initial values for the cache
        cache.set('viewers', []);
        cache.set('activeUsers', []);
        cache.set('firstArrived', false);
        cache.set('first', []);
        cache.set('knownBots', []);
        cache.set('commands', []);
        cache.set('live', false);

        // TikTok values
        cache.set('tikTokLive', false);
        cache.set('tikTokLiveId', null);
        cache.set('tiktokLikes', 0);
        cache.set('tikTokFollowers', 0);

        // Stream Info values
        cache.set('streamTitle', '');
        cache.set('streamGame', '');

        // Stream values
        cache.set('streamStartedAt', null);
        cache.set('streaSubs', 0);
        cache.set('streamSubGoal', 0);
        cache.set('streamBits', 0);
        cache.set('streamDonations', 0);
        cache.set('streamFollowers', 0);
        cache.set('streamViewers', 0);

        //OBS values
        cache.set('currentScene', null);
        cache.set('currentSceneSources', []);
        cache.set('currentSceneItems', []);
        cache.set('currentSceneItemProperties', []);
        console.log('Cache values set successfully')
    }
    catch (err) {
        writeToLogFile('error', `Error in setInitialCacheValues: ${err}`)
    }
}