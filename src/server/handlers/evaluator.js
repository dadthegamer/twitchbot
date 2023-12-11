import { chatMessageHandler } from "./actionHandlers/chatHandler.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers/replyHandler.js";
import { variableHandler } from "./variablesHandler.js";
import { displayHandler } from "./actionHandlers/displayHandler.js";
import { spinHandler } from "./actionHandlers/spinHandler.js";
import { addToQueue, removeFromQueue, getQueue, clearQueue } from "./actionHandlers/queue.js";
import { getQuoteById, getRandomQuote, createQuote } from "./actionHandlers/quote.js";
import { createClip } from "./actionHandlers/clips.js";
import { startRecording, stopRecording, startStreaming, stopStreaming, setCurrentScene, getCurrentScene, saveReplayBuffer } from "./actionHandlers/obsHandler.js";


// Method to evaluate the handler
export async function actionEvalulate(handler, context = null) {
    try {
        const { displayName, userId, messageID, input } = context || {};
        const { type, response, action } = handler;

        // Check if the response contains a variable
        if (response) {
            if (response.includes('$')) {
                const newResponse = await variableHandler(response, input, userId);
                handler.response = newResponse;
            };
        };
        switch (type) {
            case 'chat':
                chatMessageHandler(handler.response);
                break;
            case 'reply':
                replyHandler(handler.response, messageID);
                break;
            case 'display':
                displayHandler(handler.response);
                break;
            case 'spin':
                spinHandler(displayName, userId, messageID);
                break;
            case 'queue':
                switch (action) {
                    case 'add':
                        addToQueue(displayName);
                        break;
                    case 'remove':
                        // Get the user to remove by finding the username. It will be the the word after the @ symbol after the command. Example: !remove @username
                        const userToRemove = input.split('!remove')[1].trim();
                        // remove the @ symbol from the username
                        const user = userToRemove.replace('@', '');
                        removeFromQueue(user);
                        break;
                    case 'get':
                        getQueue();
                        break;
                    case 'clear':
                        clearQueue();
                        break;
                    default:
                        logger.error(`Queue action not found: ${action}`);
                }
                break;
            case 'quote':
                switch (action) {
                    case 'get':
                        const quoteId = input.split('!quote')[1].trim();
                        if (quoteId) {
                            getQuoteById(quoteId);
                            break;
                        } else {
                            getRandomQuote();
                            break;
                        }
                    case 'create':
                        createQuote(input, displayName);
                        break;
                    default:
                        logger.error(`Quote action not found: ${action}`);
                }
                break;
            case 'clip':
                createClip();
                break;
            case 'obs':
                switch (action) {
                    case 'startRecording':
                        startRecording();
                        break;
                    case 'stopRecording':
                        stopRecording();
                        break;
                    case 'startStreaming':
                        startStreaming();
                        break;
                    case 'stopStreaming':
                        stopStreaming();
                        break;
                    case 'setCurrentScene':
                        setCurrentScene(handler.response);
                        break;
                    case 'getCurrentScene':
                        getCurrentScene();
                        break;
                    case 'saveReplayBuffer':
                        saveReplayBuffer();
                        break;
                    default:
                        logger.error(`OBS action not found: ${action}`);
                }
                break;
            case 'consoleLog':
                console.log(handler.response);
                break;
            default:
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in evaluate: ${err}`);
    }
}