import { EventSubWsListener } from '@twurple/eventsub-ws';
import { onPredictionStart, onPredictionEnd, onPredictionLock, onPredictionProgress } from '../handlers/twitch/eventHandlers/predictionHanders.js';
import { onRedemptionAdd } from '../handlers/twitch/eventHandlers/redemptionHandler.js';
import { onRaid } from '../handlers/twitch/eventHandlers/raidHandler.js';
import { writeToLogFile } from '../utilities/logging.js';
import { onStreamOnline, onStreamOffline, onStreamUpdate } from '../handlers/twitch/eventHandlers/streamHandler.js';
import { onBits } from '../handlers/twitch/eventHandlers/cheerHandler.js';
import { onFollow } from '../handlers/twitch/eventHandlers/followHandler.js';

// Event listener for Twitch events
export class TwitchEventListenersServices {
    constructor(APIClient, userId, botUserId) {
        this.apiClient = APIClient;
        this.userId = userId;
        this.botUserId = botUserId;
    }

    async startEventListener() {
        try {
            const listener = new EventSubWsListener({ apiClient: this.apiClient });
            listener.start();

            // Event listeners for predictions
            listener.onChannelPredictionBegin(this.userId, onPredictionStart);
            listener.onChannelPredictionProgress(this.userId, onPredictionProgress);
            listener.onChannelPredictionLock(this.userId, onPredictionLock);
            listener.onChannelPredictionEnd(this.userId, onPredictionEnd);

            // Event listeners for channel points
            listener.onChannelRedemptionAdd(this.userId, onRedemptionAdd);

            // Event listeners for raids
            listener.onChannelRaidTo(this.userId, onRaid);

            // Event listener for stream events
            listener.onStreamOnline(this.userId, onStreamOnline);
            listener.onStreamOffline(this.userId, onStreamOffline);
            listener.onChannelUpdate(this.userId, onStreamUpdate);


            // Event listerner for bits
            listener.onChannelCheer(this.userId, onBits);

            // Event listener for follows
            listener.onChannelFollow(this.userId, this.botUserId, onFollow);
        }
        catch (error) {
            writeToLogFile('error', `Error starting event listener: ${error}`);
            throw new Error(`Error starting event listener: ${error}`);
        }
    }
}