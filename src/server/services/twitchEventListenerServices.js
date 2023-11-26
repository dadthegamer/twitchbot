import { EventSubWsListener } from '@twurple/eventsub-ws';
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

let listener;
// Event listener for Twitch events
export async function initializerEventListener(apiClient) {
    const userId = '64431397';
    try {
        cache.set('twitchConnected', false);
        listener = new EventSubWsListener({ apiClient, logger: { minLevel: 'debug' } });

        listener.onUserSocketDisconnect(() => {
            cache.set('twitchConnected', false);
            console.log('Event listener disconnected');
            startEventListener();
        });

        listener.onSubscriptionCreateSuccess(() => async (event) =>{
            console.log(event);
        });

        listener.onSubscriptionCreateFailure(() => async (event) =>{
            console.log(event);
        });

        // Event listeners for predictions
        listener.onChannelPredictionBegin(userId, async (event) => {
            await onPredictionStart(event);
        });
        listener.onChannelPredictionProgress(userId, onPredictionProgress);
        listener.onChannelPredictionLock(userId, onPredictionLock);
        listener.onChannelPredictionEnd(userId, onPredictionEnd);

        // Event listeners for channel points
        listener.onChannelRedemptionAdd(userId, onRedemptionAdd);

        // Event listeners for raids
        listener.onChannelRaidTo(userId, onRaid);

        // Event listener for stream events
        listener.onStreamOnline(userId, onStreamOnline);
        listener.onStreamOffline(userId, onStreamOffline);
        listener.onChannelUpdate(userId, onStreamUpdate);

        // Event listener for subscriptions
        listener.onChannelSubscriptionGift(userId, onGiftSubscription);
        listener.onChannelSubscriptionMessage(userId, onSubscription);


        // Event listerner for bits
        listener.onChannelCheer(userId, onBits);

        // Event listener for follows
        listener.onChannelFollow(userId, userId, onFollow);
        console.log('Event listener initialized');
    }
    catch (error) {
        console.log(`Error starting event listener: ${error}`);
        logger.error(`Error starting event listener: ${error}`);
    }
}

export async function startEventListener() {
    try {
        await listener.start();
        logger.info('Event listener started');
        cache.set('twitchConnected', true);
        console.log('Event listener started');
        return;
    }
    catch (error) {
        logger.error(`Error starting event listener: ${error}`);
    }
};

export async function stopEventListener() {
    try {
        await listener.stop();
        logger.info('Event listener stopped');
        cache.set('twitchConnected', false);
        return;
    }
    catch (error) {
        logger.error(`Error stopping event listener: ${error}`);
    }
};

// Function to toggle the event listener on and off based on the current status
export async function toggleEventListener() {
    try {
        const status = cache.get('twitchConnected');
        if (status) {
            await stopEventListener();
            return;
        }
        else {
            await startEventListener();
            return;
        }
    }
    catch (error) {
        logger.error(`Error toggling event listener: ${error}`);
    }
};