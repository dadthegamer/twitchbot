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

// Event listener for Twitch events
export async function startEventListener(apiClient) {
    const userId = '64431397';
    try {
        const listener = new EventSubWsListener({ apiClient });
        listener.start();

        // Event listeners for predictions
        listener.onChannelPredictionBegin(userId, onPredictionStart);
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
    }
    catch (error) {
        logger.error(`Error starting event listener: ${error}`);
        throw new Error(`Error starting event listener: ${error}`);
    }
}