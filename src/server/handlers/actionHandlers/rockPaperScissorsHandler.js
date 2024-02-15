import { gameService, commandHandler, usersDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { replyHandler } from './replyHandler.js';
import { numberWithCommas } from '../../utilities/utils.js';


const choices = [
    'rock',
    'paper',
    'scissors'
];
const players = [];


export async function rockPaperScissorsHandler(userId, amount, displayName, selection, messageId) {
    try {
        if (!amount) {
            replyHandler(`@${displayName} Please enter an amount to play. Example !rock 100`, messageId);
            return;
        }
        selection = selection.replace('!', '');
        const gameData = await gameService.getGameSetting('Rock Paper Scissors');
        const winMultiplier = parseInt(gameData.winMultiplier);
        const currencyName = gameData.currency;
        const userData = await usersDB.getUserByUserId(userId);
        // Check if the user has enough currency to play
        if (userData.currency[currencyName] < amount) {
            // Format the currency with commas
            const formattedAmount = await numberWithCommas(userData.currency[currencyName]);
            replyHandler(`@${displayName} You don't have enough ${currencyName} points to play. You currently have ${formattedAmount} ${currencyName} points.`, messageId);
            return;
        } else {
            // Check if the user is started a game in the last 5 minutes
            const player = players.find(player => player.userId === userId);
            if (player && new Date().getTime() - player.timeStarted < 300000) {
                // Calculate the time left in seconds
                const timeLeft = Math.floor((300000 - (new Date().getTime() - player.timeStarted)) / 1000);
                replyHandler(`@${displayName} this command is on cooldown for another ${timeLeft} seconds`, messageId);
                return;
            } else {
                // Deduct the currency from the user
                usersDB.decreaseCurrency(userId, currencyName, amount);
                // Update the player's time started
                const playerIndex = players.findIndex(player => player.userId === userId);
                if (playerIndex !== -1) {
                    players[playerIndex].timeStarted = new Date().getTime();
                } else {
                    players.push({
                        userId,
                        timeStarted: new Date().getTime()
                    });
                }
                const botChoice = choices[Math.floor(Math.random() * choices.length)];
                if (selection === botChoice) {
                    replyHandler(`@${displayName} It's a tie!`, messageId);
                    usersDB.increaseCurrency(userId, currencyName, amount * winMultiplier);
                }
                else if (selection.toLowerCase() === 'rock' && botChoice === 'scissors' || selection.toLowerCase() === 'paper' && botChoice === 'rock' || selection.toLowerCase() === 'scissors' && botChoice === 'paper') {
                    replyHandler(`@${displayName} You win!`, messageId);
                    usersDB.increaseCurrency(userId, currencyName, amount * winMultiplier);
                }
                else {
                    replyHandler(`@${displayName} I chose ${botChoice}. I win!`, messageId);
                }
            }
        }
    }
    catch (error) {
        logger.error(`Error starting rock paper scissors game: ${error}`);
    }
}