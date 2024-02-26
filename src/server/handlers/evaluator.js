import { chatMessageHandler } from "./actionHandlers/chatHandler.js";
import logger from "../utilities/logger.js";
import { replyHandler } from "./actionHandlers/replyHandler.js";
import { variableHandler } from "./variablesHandler.js";
import { displayHandler } from "./actionHandlers/displayHandler.js";
import { spinHandler } from "./actionHandlers/spinHandler.js";
import { addToQueue, removeFromQueue, getQueue, clearQueue } from "./actionHandlers/queue.js";
import { getQuoteById, getRandomQuote, createQuote } from "./actionHandlers/quote.js";
import { createClip } from "./actionHandlers/clips.js";
import { startRecording, stopRecording, startStreaming, toggleSource, stopStreaming, setCurrentScene, getCurrentScene, saveReplayBuffer } from "./actionHandlers/obsHandler.js";
import { ttsHandler } from "./actionHandlers/ttsHandler.js";
import { sendCommand } from "./actionHandlers/lumiaStream.js";
import { delay } from "./actionHandlers/delayHandler.js";
import { createCommand } from "./actionHandlers/createCommand.js";
import { sarcasticResponseHandler } from "./actionHandlers/sarcasticResponse.js";
import { createPredictionAI, rateForeheadJoke } from "../services/openAi.js";
import { startPrediction, endPrediction, cancelPrediction } from "./actionHandlers/predictionHandler.js";
import { disableGoXLRInput, enableGoXLRInput } from "./actionHandlers/goXLRHandler.js";
import { dropHandler } from "./actionHandlers/dropHandler.js";
import { startRaffle, joinRaffle } from "./actionHandlers/raffleHandler.js";
import { getRequest } from "./actionHandlers/requestsHandler.js";
import { playSoundFromCommand, playRandomSound } from "./actionHandlers/soundHandler.js";
import { joinMiniGameHandler } from "./actionHandlers/joinMiniGame.js";
import { handlBlackJackGame, handleBlackJackHit, handleBlackJackStay } from "./actionHandlers/blackJackHandler.js";
import { slapHandler, blockHandler } from "./actionHandlers/slapHandler.js";
import { startNumberGuessingGame, guessNumberHandler } from "./actionHandlers/guessNumberHandler.js";
import { rockPaperScissorsHandler } from "./actionHandlers/rockPaperScissorsHandler.js";
import { changeRewardCost, enableReward, disableReward } from "./actionHandlers/channelPointHandler.js";
import { rateForeheadJokeHandler } from "./actionHandlers/rateForeheadJoke.js";
import { addSongToQueue, getCurrentlyPlayingData } from "./actionHandlers/spotifyHandler.js";
import { startBitsWar } from "./actionHandlers/bitsWar.js";


// Method to evaluate the handler
export async function actionEvalulate(handler, context = null) {
    try {
        const { displayName, userId, messageID, input, isMod, isVip, color, isSubscriber, isBroadcaster } = context || {};
        const { type, response, action } = handler;

        // Check if the response contains a variable
        if (response) {
            if (response.includes('$')) {
                const newResponse = await variableHandler(response, { input, userId, displayName });
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
                console.log('Display Handler');
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
                    case 'toggleSource':
                        const sceneName = handler.response.split(',')[0];
                        const sourceName = handler.response.split(',')[1];
                        toggleSource(sceneName, sourceName);
                        break;
                    default:
                        logger.error(`OBS action not found: ${action}`);
                }
                break;
            case 'tts':
                ttsHandler(handler.response, userId);
                break;
            case 'lumiaStream':
                console.log('Lumia Stream Handler');
                sendCommand(handler.response);
                break;
            case 'consoleLog':
                console.log(handler.response);
                break;
            case 'delay':
                const delayTime = parseInt(handler.time);
                await delay(delayTime);
                break;
            case 'createCommand':
                // Split the input to get the command to create. It will be the text after the command. Example: !create !testCommand This is a test command. Only get the !testCommand
                const createdCommand = input.split('!create')[1].split(' ')[1];
                console.log(`Command to create: ${createdCommand}`);

                // Split the input to get the command response. It will be the text after the command. Example: !create !testCommand This is a test command. Only get the This is a test command
                const commandResponse = input.split('!create')[1].split(' ').slice(2).join(' ');
                console.log(`Command response: ${commandResponse}`);
                createCommand(createdCommand, commandResponse);
                break;
            case 'sarcasticResponse':
                // Get the message from the chat after the !q command
                const messageFromChat = input.split('!q')[1].trim();
                if (!messageFromChat || messageFromChat === '') {
                    console.log('No message to respond to');
                    break;
                }
                sarcasticResponseHandler(messageFromChat);
                break;
            case 'rateForeheadJoke':
                const ratingData = await rateForeheadJoke(input);
                if (!ratingData || !ratingData.rating) {
                    logger.error('No rating data found for the forehead joke.');
                    break;
                } else {
                    const rating = ratingData.rating;
                    ttsHandler(`I rate that joke a ${rating} out of 10.`, userId);
                    chatMessageHandler(`I rate that joke a ${rating} out of 10.`);
                    break;
                }
            case 'prediction':
                switch (action) {
                    case 'start':
                        console.log('Start prediction');
                        const predictionInput = input.split('!prediction')[1].trim();
                        if (!predictionInput || predictionInput === '') {
                            break;
                        } else {
                            const response = await createPredictionAI(predictionInput);
                            startPrediction(response.title, response.outcomes);
                            break;
                        };
                    case 'end':
                        const outcome = input.split('!end')[1].trim();
                        endPrediction(outcome);
                        break;
                    case 'cancel':
                        console.log('Cancel prediction');
                        cancelPrediction();
                        break;
                    default:
                        logger.error(`Prediction action not found: ${action}`);
                }
                break;
            case 'goXLR':
                switch (action) {
                    case 'disableInput':
                        disableGoXLRInput(handler.input);
                        break;
                    case 'enableInput':
                        enableGoXLRInput(handler.input);
                        break;
                    default:
                        logger.error(`GoXLR action not found: ${action}`);
                }
                break;
            case 'drop':
                dropHandler(userId, displayName, isMod, isBroadcaster, messageID);
                break;
            case 'request':
                switch (action) {
                    case 'get':
                        getRequest(handler.response);
                        break;
                    default:
                        logger.error(`Request action not found: ${action}`);
                }
            case 'raffle':
                switch (action) {
                    case 'start':
                        // Get the amount to raffle. It will be the text after the command. Example: !raffle 1000. Only get the 1000
                        const amount = parseInt(input.split('!raffle')[1].trim());
                        startRaffle(amount);
                        break;
                    case 'join':
                        joinRaffle(userId, displayName, messageID);
                        break;
                    default:
                        logger.error(`Raffle action not found: ${action}`);
                }
                break;
            case 'sound':
                // Get the sound to play. It will be the text after the command. Example: !sound testsound. Only get the testsound
                const sound = input.split('!sound')[1].trim();
                // If there is no sound, play a random sound
                if (!sound || sound === '') {
                    playRandomSound();
                    break;
                } else {
                    playSoundFromCommand(sound);
                    break;
                }
            case 'blackjack':
                switch (action) {
                    case 'start':
                        // Get the bet amount. It will be the text after the command. Example: !blackjack 100. Only get the 100
                        const bet = parseInt(input.split('!blackjack')[1].trim());
                        if (!bet || bet === '') {
                            chatMessageHandler(`@${displayName} please enter a valid bet amount. Example !blackjack 100`);
                            break;
                        }
                        handlBlackJackGame(userId, displayName, bet);
                        break;
                    case 'hit':
                        handleBlackJackHit(userId, displayName);
                        break;
                    case 'stay':
                        handleBlackJackStay(userId, displayName);
                        break;
                    default:
                        logger.error(`Blackjack action not found: ${action}`);
                }
                break;
            case 'slap':
                switch (action) {
                    case 'slap':
                        let slappedDisplayName = input.split('!slap')[1].trim();
                        // If the slapped display name starts with an @ symbol, remove it
                        if (slappedDisplayName.startsWith('@')) {
                            slappedDisplayName = slappedDisplayName.replace('@', '');
                        }
                        slapHandler(userId, displayName, slappedDisplayName);
                        break;
                    case 'block':
                        blockHandler(userId, displayName);
                        break;
                    default:
                        logger.error(`Slap action not found: ${action}`);
                }
                break;
            case 'guessNumber':
                switch (action) {
                    case 'start':
                        startNumberGuessingGame();
                        break;
                    case 'guess':
                        const guess = parseInt(input.split('!guess')[1].trim());
                        if (!guess || guess === '') {
                            chatMessageHandler(`@${displayName} please enter a valid guess. Example !guess 100`);
                            break;
                        } else {
                            if (guess < 1 || guess > 1000) {
                                chatMessageHandler(`@${displayName} please enter a valid guess between 1 and 1000.`);
                                break;
                            } else {
                                guessNumberHandler(userId, displayName, guess, messageID);
                                break;
                            }
                        }
                    default:
                        logger.error(`Guess number action not found: ${action}`);
                }
                break;
            case 'rockPaperScissors':
                // Get the command that was used. it will be the text after the !. Remove the ! and anything after the command
                const command = input.split('!')[1].split(' ')[0];
                // Get the amount to bet. It will be the text after the command.
                if (command === 'rock') {
                    const amount = parseInt(input.split('!rock')[1].trim());
                    // Check if the amount is a valid number
                    if (!amount || amount === '' || isNaN(amount)) {
                        chatMessageHandler(`@${displayName} please enter a valid bet amount. Example !rock 100`);
                        break;
                    } else {
                        rockPaperScissorsHandler(userId, amount, displayName, command, messageID);
                    }
                } else if (command === 'paper') {
                    const amount = parseInt(input.split('!paper')[1].trim());
                    if (!amount || amount === '' || isNaN(amount)) {
                        chatMessageHandler(`@${displayName} please enter a valid bet amount. Example !paper 100`);
                        break;
                    } else {
                        rockPaperScissorsHandler(userId, amount, displayName, command, messageID);
                    }
                } else if (command === 'scissors') {
                    const amount = parseInt(input.split('!scissors')[1].trim());
                    if (!amount || amount === '' || isNaN(amount)) {
                        chatMessageHandler(`@${displayName} please enter a valid bet amount. Example !scissors 100`);
                        break;
                    } else {
                        rockPaperScissorsHandler(userId, amount, displayName, command, messageID);
                    }
                }
                break;
            case 'rateForeheadJoke':
                rateForeheadJokeHandler(displayName, input);
                break;
            case 'channelRewards':
                switch (action) {
                    case 'changeCost':
                        const rewardId = input.split('!changeCost')[1].split(' ')[1];
                        const cost = parseInt(input.split('!changeCost')[1].split(' ')[2]);
                        changeRewardCost(rewardId, cost);
                        break;
                    case 'enable':
                        const enableRewardId = input.split('!enable')[1].split(' ')[1];
                        enableReward(enableRewardId);
                        break;
                    case 'disable':
                        const disableRewardId = input.split('!disable')[1].split(' ')[1];
                        disableReward(disableRewardId);
                        break;
                    default:
                        logger.error(`Channel Point action not found: ${action}`);
                }
                break;
            case 'joinMiniGame':
                joinMiniGameHandler(userId, displayName, color);
                break;
            case 'spotify':
                switch (action) {
                    case 'add':
                        // Get the song and artist to add. It will be all the text after the command. Example: !addsong song artist. Get all the text after the !addsong command
                        const songAndArtist = input.split('!addsong')[1].trim();
                        addSongToQueue(userId, songAndArtist, messageID);
                        break;
                    case 'get':
                        getCurrentlyPlayingData(messageID);
                        break;
                    default:
                        logger.error(`Spotify action not found: ${action}`);
                }
                break;
            case 'bitsWar':
                startBitsWar(displayName);
                break;
            default:
                logger.error(`Handler not found: ${handler}`);
        }
    }
    catch (err) {
        logger.error(`Error in evaluate: ${err}`);
    }
}