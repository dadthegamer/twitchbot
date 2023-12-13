import logger from '../../utilities/logger.js';
import { twitchApi, chatClient, cache } from '../../config/initializers.js';


// Function to create a clip
export async function createClip() {
    try {
        const live = await cache.get('live');
        if (!live) {
            chatClient.say('Stream is not live, cannot create clip.');
        } else {
            const clip = await twitchApi.createTwitchClip();
            const clipData = await twitchApi.getTwitchClipById(clip);
            let tries = 0;
            let maxTries = 15;
            // Do a while loop to check if the clip data is not null
            while (!clipData && tries < maxTries) {
                tries++;
                await new Promise(resolve => setTimeout(resolve, 1000));
                // Refresh clipData on each iteration
                clipData = await twitchApi.getTwitchClipById(clip);
            }

            if (clipData && clipData.url) {
                chatClient.say(`Clip created: ${clipData.url}`);
            } else {
                logger.error(`Error in createClip handler: Clip data is null`);
            }
            // setTimeout(async () => {
            //     const clipData = await twitchApi.getTwitchClipById(clip);
            //     const clipUrl = clipData.url;
            //     if (clipUrl) {
            //         chatClient.say(`Clip created: ${clipUrl}`);
            //     }
            // }, 5000);
        }
    }
    catch (err) {
        console.log(`Error in createClip handler: ${err}`);
        logger.error(`Error in createClip handler: ${err}`);
    }
}