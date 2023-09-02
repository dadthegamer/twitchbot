import { EventSubWsListener } from '@twurple/eventsub-ws';
import { onPredictionStart, onPredictionEnd, onPredictionLock, onPredictionProgress } from '../handlers/twitch/eventHandlers/predictionHanders.js';
import { writeToLogFile } from '../utils/logging.js';

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
        }
        catch (error) {
            writeToLogFile('error', `Error starting event listener: ${error}`);
            throw new Error(`Error starting event listener: ${error}`);
        }
    }
}