import { ReverseProxyAdapter, EventSubHttpListener } from '@twurple/eventsub-http'
import { onPredictionStart, onPredictionEnd, onPredictionLock, onPredictionProgress } from '../handlers/twitch/eventHandlers/predictionHanders.js';
import { onRedemptionAdd } from '../handlers/twitch/eventHandlers/redemptionHandler.js';
import { onRaid } from '../handlers/twitch/eventHandlers/raidHandler.js';
import logger from "../utilities/logger.js";
import { onStreamOnline, onStreamOffline, onStreamUpdate } from '../handlers/twitch/eventHandlers/streamHandler.js';
import { onBits } from '../handlers/twitch/eventHandlers/cheerHandler.js';
import { onFollow } from '../handlers/twitch/eventHandlers/followHandler.js';
import { onGiftSubscription } from '../handlers/twitch/eventHandlers/giftSubscription.js';
import { onSubscription } from '../handlers/twitch/eventHandlers/subHandler.js';
import { cache } from '../config/initializers.js';
import { eventListenerPort, hostName, environment, appSecret, streamerUserId, botId } from '../config/environmentVars.js';
import { twitchApi } from '../config/initializers.js';
import { onHypeTrainBegin, onHypeTrainEnd, onHypeTrainProgress } from '../handlers/twitch/eventHandlers/hypeTrainHandler.js';
import { onShoutoutCreated } from '../handlers/twitch/eventHandlers/shoutoutHandler.js';


// Event listener for Twitch events
export async function initializerEventListener(apiClient) {
    const userId = streamerUserId;
    try {
        if (!hostName || hostName === '') {
            throw new Error('Hostname is undefined');
        };
        if (environment === 'development') {
            await twitchApi.deleteAllSubscriptions();
        };
        let listener;
        cache.set('twitchConnected', false);
        const secret = appSecret || 'testsecret1234321';
        const adapter = new ReverseProxyAdapter({
            hostName: hostName,
            port: eventListenerPort || 8081,
            pathPrefix: '/twitch/eventsub',
            usePathPrefixInHandlers: true
        });
        listener = new EventSubHttpListener({ adapter: adapter, apiClient, secret, logger: { minLevel: 'debug' } });
        listener.start();

        listener.onSubscriptionCreateSuccess(() => async (event) => {
            console.log(event);
            logger.info(`Subscription created: ${event}`);
        });

        listener.onSubscriptionCreateFailure(() => async (event) => {
            console.log(event);
            logger.error(`Error creating subscription: ${event}`);
        });

        listener.onVerify((success, subscription) => async (event) => {
            if (!success) {
                console.log(`Failed to verify subscription: ${event}`);
                logger.error(`Failed to verify subscription: ${event}`);
                return;
            }
        });

        // Event listeners for predictions
        listener.onChannelPredictionBegin(userId, async (event) => {
            try {
                console.log(event);
                await onPredictionStart(event);
            }
            catch (error) {
                logger.error(`Error in onChannelPredictionBegin: ${error}`);
            }
        });

        listener.onChannelPredictionProgress(userId, async (event) => {
            try {
                await onPredictionProgress(event);
            }
            catch (error) {
                logger.error(`Error in onChannelPredictionProgress: ${error}`);
            }
        });

        listener.onChannelPredictionLock(userId, async (event) => {
            try {
                await onPredictionLock(event);
            }
            catch (error) {
                logger.error(`Error in onChannelPredictionLock: ${error}`);
            }
        });

        listener.onChannelPredictionEnd(userId, async (event) => {
            try {
                await onPredictionEnd(event);
            }
            catch (error) {
                logger.error(`Error in onChannelPredictionEnd: ${error}`);
            }
        });

        // Event listeners for channel points
        listener.onChannelRedemptionAdd(userId, async (event) => {
            try {
                await onRedemptionAdd(event);
            }
            catch (error) {
                logger.error(`Error in onChannelRedemptionAdd: ${error}`);
            }
        });

        // Event listeners for raids
        listener.onChannelRaidTo(userId, async (event) => {
            try {
                await onRaid(event);
            }
            catch (error) {
                logger.error(`Error in onChannelRaidTo: ${error}`);
            }
        });

        // Event listener for stream events
        listener.onStreamOnline(userId, async (event) => {
            try {
                await onStreamOnline(event);
            }
            catch (error) {
                logger.error(`Error in onStreamOnline: ${error}`);
            }
        });

        listener.onStreamOffline(userId, async (event) => {
            try {
                await onStreamOffline(event);
            }
            catch (error) {
                logger.error(`Error in onStreamOffline: ${error}`);
            }
        });

        listener.onChannelUpdate(userId, async (event) => {
            try {
                await onStreamUpdate(event);
            }
            catch (error) {
                logger.error(`Error in onStreamUpdate: ${error}`);
            }
        });

        // Event listener for subscriptions
        listener.onChannelSubscriptionGift(userId, async (event) => {
            try {
                await onGiftSubscription(event);
            }
            catch (error) {
                logger.error(`Error in onChannelSubscriptionGift: ${error}`);
            }
        });

        listener.onChannelSubscriptionMessage(userId, async (event) => {
            try {
                await onSubscription(event);
            }
            catch (error) {
                logger.error(`Error in onChannelSubscriptionMessage: ${error}`);
            }
        });

        // Event listerner for bits
        listener.onChannelCheer(userId, async (event) => {
            try {
                await onBits(event);
            }
            catch (error) {
                logger.error(`Error in onChannelCheer: ${error}`);
            }
        });

        // Event listener for follows
        listener.onChannelFollow(userId, userId, async (event) => {
            try {
                await onFollow(event);
            }
            catch (error) {
                logger.error(`Error in onChannelFollow: ${error}`);
            }
        });

        listener.onChannelRewardUpdate(userId, async (event) => {
            try {
                console.log(event);
            }
            catch (error) {
                logger.error(`Error in onChannelRewardUpdate: ${error}`);
            }
        });

        listener.onChannelHypeTrainBegin(userId, async (event) => {
            try {
                await onHypeTrainBegin(event);
            }
            catch (error) {
                logger.error(`Error in onChannelHypeTrainBegin: ${error}`);
            }
        });

        listener.onChannelHypeTrainEnd(userId, async (event) => {
            try {
                await onHypeTrainEnd(event);
            }
            catch (error) {
                logger.error(`Error in onChannelHypeTrainEnd: ${error}`);
            }
        });

        listener.onChannelHypeTrainProgress(userId, async (event) => {
            try {
                await onHypeTrainProgress(event);
            }
            catch (error) {
                logger.error(`Error in onChannelHypeTrainProgress: ${error}`);
            }
        });

        listener.onChannelShoutoutCreate(userId, botId, async (event) => {
            try {
                await onShoutoutCreated(event);
            }
            catch (error) {
                logger.error(`Error in onChannelShoutoutCreated: ${error}`);
            }
        });

        console.log('Event listener initialized');
    }
    catch (error) {
        console.log(`Error starting event listener: ${error}`);
        logger.error(`Error starting event listener: ${error}`);
        throw new Error(`Error starting event listener: ${error}`);
    }
}

// export async function startEventListener() {
//     try {
//         await listener.start();
//         logger.info('Event listener started');
//         cache.set('twitchConnected', true);
//         console.log('Event listener started');
//         return;
//     }
//     catch (error) {
//         logger.error(`Error starting event listener: ${error}`);
//     }
// };

// export async function stopEventListener() {
//     try {
//         await listener.stop();
//         logger.info('Event listener stopped');
//         cache.set('twitchConnected', false);
//         return;
//     }
//     catch (error) {
//         logger.error(`Error stopping event listener: ${error}`);
//     }
// };

// // Function to toggle the event listener on and off based on the current status
// export async function toggleEventListener() {
//     try {
//         const status = cache.get('twitchConnected');
//         if (status) {
//             await stopEventListener();
//             return;
//         }
//         else {
//             await startEventListener();
//             return;
//         }
//     }
//     catch (error) {
//         logger.error(`Error toggling event listener: ${error}`);
//     }
// };