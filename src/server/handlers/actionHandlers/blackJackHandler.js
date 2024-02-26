import logger from '../../utilities/logger.js';
import { chatClient, gameService, usersDB, commandHandler } from '../../config/initializers.js';
import { numberWithCommas } from '../../utilities/utils.js';


let players = [];

export async function handlBlackJackGame(userId, displayName, bet) {
    // Check if the user is already in a game. Each user that is added is an object with the user's id, displayName and bet
    if (players.find(player => player.userId === userId)) {
        return;
    } else {
        const gameSettings = await gameService.getGameSetting('Blackjack');
        if (!gameSettings.enabled) {
            chatClient.say(`@${displayName}, the game is currently disabled.`);
            commandHandler.removeUserFromCooldownCache('blackjack', userId);
            return;
        } else if (!gameSettings) {
            return;
        }
        // Conver the bet to a number
        bet = parseInt(bet);
        // Check if the bet is a number
        if (isNaN(bet)) {
            return;
        }
        const currency = gameSettings.currency;
        // Check if the user has enough points to play the game
        const userData = await usersDB.getUserByUserId(userId);
        if (userData.currency[currency] < bet) {
            // Format the users points with commas
            const formattedPoints = numberWithCommas(userData.currency[currency]);
            chatClient.say(`@${displayName}, you do not have enough points to place that bet. You currently have ${formattedPoints} ${currency} points.`);
            commandHandler.removeUserFromCooldownCache('blackjack', userId);
            return;
        } else {
            usersDB.decreaseCurrency(userId, currency, bet);
            const gameData = await gameService.startBlackjackGame(userId, bet);
            players.push({ userId: userId, gameData, currency, timeStarted: Date.now() });
            if (gameData.playerBlackjack) {
                const payout = await gameService.calculatePayout(bet, true);
                gameService.handleGameWinNoMessage('Blackjack', userId, payout);
                // Format the payout with commas
                const formattedPayout = numberWithCommas(payout);
                chatClient.say(`@${displayName} hit blackjack and won ${formattedPayout} ${currency} points.`);
                players = players.filter(player => player.userId !== userId);
            } else if (gameData.dealerBlackjack) {
                chatClient.say(`@${displayName} the dealer has blackjack. You lost.`);
                // Remove the player from the game
                players = players.filter(player => player.userId !== userId);
            } else{
                chatClient.say(`@${displayName} your hand is ${gameData.playerHand[0].value} ${gameData.playerHand[0].suit} ${gameData.playerHand[1].value} ${gameData.playerHand[1].suit}. The dealer's hand is ${gameData.dealerHand[0].value} ${gameData.dealerHand[0].suit} and a hidden card. Use !hit to hit or !stay to stay?`);
            }
        }
    }
}

export async function handleBlackJackHit(userId, displayName) {
    try {
        const player = players.find(player => player.userId === userId);
        if (!player) {
            return;
        } else {
            const cardDealt = await gameService.dealCard(player.gameData.deck);
            player.gameData.playerHand.push(cardDealt);
            // Calculate the value of the player's hand
            const playerHandValue = await gameService.calculateHandValue(player.gameData.playerHand);
            let playerHandString = '';
            player.gameData.playerHand.forEach(card => {
                playerHandString += `${card.value} ${card.suit}, `;
            });
            if (playerHandValue > 21) {
                chatClient.say(`@${displayName} your hand is ${playerHandString}. You busted.`);
                players = players.filter(player => player.userId !== userId);
            } else {
                if (playerHandValue === 21) {
                    chatClient.say(`@${displayName} your hand is ${playerHandString}. You have 21!`);
                    const payout = await gameService.calculatePayout(player.gameData.bet, false);
                    gameService.handleGameWinNoMessage('Blackjack', userId, payout);
                    // Format the payout with commas
                    const formattedPayout = numberWithCommas(payout);
                    chatClient.say(`@${displayName} has won ${formattedPayout} ${player.currency} points.`);
                    players = players.filter(player => player.userId !== userId);
                } else {
                    chatClient.say(`@${displayName} your hand is ${playerHandString}. The dealer's is showing ${player.gameData.dealerHand[0].value} ${player.gameData.dealerHand[0].suit} and a hidden card. Use !hit to hit or !stay to stay?`);
                }
            }
        }
    }
    catch (err) {
        logger.error(`Error in handleBlackJackHit: ${err}`);
    }
}

export async function handleBlackJackStay(userId, displayName) {
    try {
        const player = players.find(player => player.userId === userId);
        if (!player) {
            return;
        } else {
            while (player.gameData.dealerValue < 17) {
                const card = await gameService.dealCard(player.gameData.deck);
                player.gameData.dealerHand.push(card);
                player.gameData.dealerValue = await gameService.calculateHandValue(player.gameData.dealerHand);
            }
            if (player.gameData.dealerValue > 21) {
                const payout = await gameService.calculatePayout(player.gameData.bet, true);
                gameService.handleGameWinNoMessage('Blackjack', userId, payout);
                // Format the payout with commas
                const formattedPayout = numberWithCommas(payout);
                chatClient.say(`@${displayName} the dealer busted. You have won ${formattedPayout} ${player.currency} points.`);
                players = players.filter(player => player.userId !== userId);
            } else {
                let playerHandString = '';
                player.gameData.playerHand.forEach(card => {
                    playerHandString += `${card.value} ${card.suit}, `;
                });
                let dealerHandString = '';
                player.gameData.dealerHand.forEach(card => {
                    dealerHandString += `${card.value} ${card.suit}, `;
                });
                const playerHandValue = await gameService.calculateHandValue(player.gameData.playerHand);
                const dealerHandValue = await gameService.calculateHandValue(player.gameData.dealerHand);
                if (playerHandValue > dealerHandValue) {
                    const payout = await gameService.calculatePayout(player.gameData.bet, false);
                    gameService.handleGameWinNoMessage('Blackjack', userId, payout);
                    // Format the payout with commas
                    const formattedPayout = numberWithCommas(payout);
                    chatClient.say(`@${displayName} your hand is ${playerHandString}. The dealer's hand is ${dealerHandString}. You have won ${formattedPayout} ${player.currency} points.`);
                    players = players.filter(player => player.userId !== userId);
                } else if (playerHandValue < dealerHandValue) {
                    chatClient.say(`@${displayName} your hand is ${playerHandString}. The dealer's hand is ${dealerHandString}. You lost.`);
                    players = players.filter(player => player.userId !== userId);
                } else {
                    chatClient.say(`@${displayName} your hand is ${playerHandString}. The dealer's hand is ${dealerHandString}. It's a push.`);
                    players = players.filter(player => player.userId !== userId);
                }
            }
        }
    }
    catch (err) {
        logger.error(`Error in handleBlackJackStay: ${err}`);
    }
}