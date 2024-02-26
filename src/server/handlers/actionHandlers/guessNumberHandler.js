import logger from '../../utilities/logger.js';
import { gameService, chatClient } from "../../config/initializers.js";
import { numberWithCommas } from '../../utilities/utils.js';


let botguess = 0;
let gameStarted = false;
let maxNumber = 1000;


export async function startNumberGuessingGame() {
    try {
        const res = await gameService.getGameSetting('Number Guessing Game');
        const { max, currency, payout } = res || 1000;
        maxNumber = parseInt(max);
        // Format the max number with commas
        const formatMax = numberWithCommas(max);
        const formatPayout = numberWithCommas(payout);
        if (currency === 'raffle') {
            chatClient.say(`I'm thinking of a number between 1 and ${formatMax}. The first person to guess it will win ${formatPayout} ${currency} raffle tickets! Type !guess followed by your guess to play!`);
        } else {
            chatClient.say(`I am thinking of a number between 1 and 1000. Guess the number between 1 and ${formatMax} by typing !guess followed by your guess. Example !guess 500. The person who guesses the number first wins ${formatPayout} ${currency}!`);
        }
        botguess = Math.floor(Math.random() * maxNumber) + 1;
        gameStarted = true;
    }
    catch (err) {
        logger.error(`Error in startNumberGuessingGame: ${err}`);
    }
}


export async function guessNumberHandler(userId, displayName, guess, messageId) {
    try {
        if (!gameStarted) {
            return;
        } else {
            if (guess === botguess) {
                const res = await gameService.rewardNumberGuessingGameWinner(userId);
                const { currency, payout } = res;
                const formatPayout = numberWithCommas(payout);
                if (currency === 'raffle') {
                    chatClient.replyToMessage(`Congratulations @${displayName}! You guessed the number correctly! You earned ${formatPayout} ${currency} raffle tickets`, messageId);
                } else {
                    chatClient.replyToMessage(`Congratulations @${displayName}! You guessed the number correctly! You earned ${formatPayout} ${currency} points`, messageId);
                }
                gameStarted = false;
            }
            else {
                if (guess < botguess) {
                    chatClient.replyToMessage(`@${displayName}, the number I am thinking of is higher than ${guess}.`, messageId);
                }
                else {
                    chatClient.replyToMessage(`@${displayName}, the number I am thinking of is lower than ${guess}.`, messageId);
                }
            }
        }
    }
    catch (err) {
        logger.error(`Error in guessNumberHandler: ${err}`);
    }
}
