import logger from "../utilities/logger.js";
import { webSocket, chatClient, usersDB, cache, activeUsersCache, currencyDB } from "../config/initializers.js";


// Class to handle all stream related services
class GameService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'gameSettings';
        this.setInitialJackpot();
        this.getJackpot();
    }

    // Method to set the initial jackpot amount in the database and cache if it doesn't exist
    async setInitialJackpot() {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (!data) {
                const data = {
                    id: 'jackpot',
                    jackpot: 25000,
                    currency: 'points',
                    jackpotPCT: 10,
                    jackpotStart: 25000,
                    increaseBy: {
                        min: 100,
                        max: 500
                    }
                }
                await this.dbConnection.collection(this.collectionName).insertOne(data);
                this.cache.set('jackpot', data);
            }
        }
        catch (error) {
            logger.error(`Error in setInitialJackpot: ${error}`);
        }
    }

    // Method to set the jackpot amount in the database and cache
    async setJackpot(jackpot) {
        try {
            // Make sure the jackpot is a number
            jackpot = Number(jackpot);
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
            // Update the cache with the new jackpot amount
            this.cache.set('jackpot', { jackpot: jackpot });
            return res;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error in setJackpot: ${error}`);
        }
    }

    // Method to get the jackpot amount from the cache. If it doesn't exist in the cache get it from the database and set it in the cache
    async getJackpot() {
        try {
            let jackpot = this.cache.get('jackpot');
            if (!jackpot) {
                const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
                if (data) {
                    this.cache.set('jackpot', data);
                    jackpot = data;
                }
            }
            return jackpot;
        }
        catch (error) {
            logger.error(`Error in getJackpot: ${error}`);
        }
    }

    // Method to get the jackpot from the database and set it in the cache
    async getJackpotFromDB() {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                this.cache.set('jackpot', data);
            }
        }
        catch (error) {
            logger.error(`Error in getJackpotFromDB: ${error}`);
        }
    }

    // Method to increase the jackpot amount in the database and cache
    async increaseJackpot(amount) {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                const jackpot = data.jackpot + amount;
                await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
                // Update the cache with the new jackpot amount
                this.getJackpotFromDB();
            }
        }
        catch (error) {
            logger.error(`Error in increaseJackpot: ${error}`);
        }
    }

    // Method to set the jackpot percentage in the database and cache
    async updateJackpotPCT(jackpotPCT) {
        try {
            // Make sure the jackpot percentage is a number
            jackpotPCT = Number(jackpotPCT);
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpotPCT: jackpotPCT } });
            // Update the cache with the new jackpot percentage
            this.cache.set('jackpot', { jackpotPCT: jackpotPCT });
            return res;
        }
        catch (error) {
            logger.error(`Error in setJackpotPCT: ${error}`);
        }
    }

    // Method to set the jackpot increase by amount in the database and cache
    async updateIncreaseBy(min, max) {
        try {
            // Make sure the jackpot percentage is a number
            min = Number(min);
            max = Number(max);
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { increaseBy: { min: min, max: max } } });
            // Update the cache with the new jackpot percentage
            this.cache.set('jackpot', { increaseBy: { min: min, max: max } });
            return res;
        }
        catch (error) {
            logger.error(`Error in setJackpotPCT: ${error}`);
        }
    }

    // Method to set which currency the jackpot is in
    async setCurrency(currency) {
        try {
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { currency: currency } });
            // Update the cache with the new jackpot percentage
            this.cache.set('jackpot', { currency: currency });
            return res;
        }
        catch (error) {
            logger.error(`Error in setCurrency: ${error}`);
        }
    }

    // Method to reset the jackpot amount in the database and cache based on the jackpot start amount
    async resetJackpot() {
        try {
            const data = await this.dbConnection.collection(this.collectionName).findOne({ id: 'jackpot' });
            if (data) {
                const jackpot = data.jackpotStart;
                await this.dbConnection.collection(this.collectionName).updateOne({ id: 'jackpot' }, { $set: { jackpot: jackpot } });
                // Update the cache with the new jackpot amount
                this.cache.set('jackpot', { jackpot: jackpot });
            }
        }
        catch (error) {
            logger.error(`Error in resetJackpot: ${error}`);
        }
    }

    // Method to handle a community game win with a payout
    async handleCommunityGameWinWithPayout(gameName, userIds, payout) {
        try {
            const gameSettings = await this.getAllGames();
            const game = gameSettings.find(game => game.game === gameName);
            if (game) {
                const currency = game.currency;
                for (const userId of userIds) {
                    usersDB.increaseCurrencyForUsers(userId, currency, payout);
                }
                // Format the payout with commas
                const formattedPayout = numberWithCommas(payout);
                if (currency === 'raffle') {
                    chatClient.say(`Everyone has won ${formattedPayout} ${currency} raffle tickets!`);
                } else {
                    chatClient.say(`Everyone has won ${formattedPayout} ${currency} points!`);
                }
                return game;
            } else {
                return null;
            }
        }
        catch (err) {
            logger.error(`Error in handleCommunityGameWinWithPayout: ${err}`);
        }
    }

    // Method to handle a community game win
    async handleCommunityGameWin(gameName, userId, displayName) {
        try {
            const gameSettings = await this.getAllGames();
            const game = gameSettings.find(game => game.game === gameName);
            if (game) {
                const payout = game.payout;
                const currency = game.currency;
                usersDB.increaseCurrencyForUsers(userId, currency, payout);
                // Format the payout with commas
                const formattedPayout = numberWithCommas(payout);
                if (currency === 'raffle') {
                    chatClient.say(`@${displayName}, the community has won ${formattedPayout} ${currency} raffle tickets!`);
                } else {
                    chatClient.say(`@${displayName}, the community has won ${formattedPayout} ${currency} points!`);
                }
                return game;
            } else {
                return null;
            }
        }
        catch (err) {
            logger.error(`Error in handleCommunityGameWin: ${err}`);
        }
    }

    // Method to get all the games settings from the database and store them in the cache. They are in the gameSettings collection with a type of game
    async getAllGames() {
        try {
            let games = await this.cache.get('gameSettings');
            if (!games) {
                games = await this.dbConnection.collection('gameSettings').find({ type: 'game' }).toArray();
                this.cache.set('gameSettings', games);
                return games;
            } else {
                return games;
            }
        }
        catch (err) {
            logger.error(`Error in getGameSettings: ${err}`);
        }
    }

    // Method to get a game setting from the cache
    async getGameSetting(gameName) {
        try {
            const games = await this.getAllGames();
            const game = games.find(game => game.game === gameName);
            return game;
        }
        catch (err) {
            logger.error(`Error in getGameSetting: ${err}`);
        }
    }

    // Method to handle when a user wins a game
    async handleGameWin(gameName, userId, displayName) {
        try {
            const gameSettings = await this.getAllGames();
            const game = gameSettings.find(game => game.game === gameName);
            if (game) {
                if (game) {
                    const payout = game.payout;
                    const currency = game.currency;
                    usersDB.increaseCurrency(userId, currency, payout);
                    usersDB.increaseMiniGamesWon(userId);
                    // Format the payout with commas
                    const formattedPayout = numberWithCommas(payout);
                    if (currency === 'raffle') {
                        chatClient.say(`@${displayName}, you have won ${formattedPayout} ${currency} raffle tickets!`);
                    } else {
                        chatClient.say(`@${displayName}, you have won ${formattedPayout} ${currency} points!`);
                    }
                }
                return game;
            } else {
                return null;
            }
        }
        catch (err) {
            logger.error(`Error in handleGameWin: ${err}`);
        }
    }

    // Method to handle a game win with no message
    async handleGameWinNoMessage(gameName, userId, payout) {
        try {
            const gameSettings = await this.getAllGames();
            const game = gameSettings.find(game => game.game === gameName);
            if (game) {
                const currency = game.currency;
                usersDB.increaseCurrency(userId, currency, payout);
                return game;
            } else {
                return null;
            }
        }
        catch (err) {
            logger.error(`Error in handleGameWin: ${err}`);
        }
    }

    // Method to generate a deck of cards
    async generateDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];
        for (let suit in suits) {
            for (let value in values) {
                deck.push({ value: values[value], suit: suits[suit] });
            }
        }
        return deck;
    }

    // Method to deal a hand of blackjack.
    async dealHand(deck) {
        const hand = [];
        for (let i = 0; i < 2; i++) {
            const card = deck[Math.floor(Math.random() * deck.length)];
            hand.push(card);
            deck.splice(deck.indexOf(card), 1);
        }
        return hand;
    }

    // Method to deal a card from the deck
    async dealCard(deck) {
        const card = deck[Math.floor(Math.random() * deck.length)];
        deck.splice(deck.indexOf(card), 1);
        return card;
    }

    // Method to calculate the value of a hand of blackjack
    async calculateHandValue(hand) {
        let value = 0;
        let aces = 0;
        for (let card in hand) {
            if (hand[card].value === 'A') {
                if (value + 11 > 21) {
                    value += 1;
                } else {
                    value += 11;
                    aces++;
                }
            }
            else if (hand[card].value === 'K' || hand[card].value === 'Q' || hand[card].value === 'J') {
                value += 10;
            }
            else {
                value += Number(hand[card].value);
            }
        }
        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }
        return value;
    }

    // Method to deal a card from the deck
    async dealCard(deck) {
        const card = deck[Math.floor(Math.random() * deck.length)];
        deck.splice(deck.indexOf(card), 1);
        return card;
    }

    // Method to calculate the winner of a game of blackjack
    async calculateWinner(playerValue, dealerValue) {
        if (playerValue > 21) {
            return 'dealer';
        } else if (dealerValue > 21) {
            return 'player';
        } else if (playerValue === dealerValue) {
            return 'push';
        } else if (playerValue > dealerValue) {
            return 'player';
        } else {
            return 'dealer';
        }
    }

    // Method to check if a hand is a blackjack
    async isBlackjack(hand) {
        if (hand.length === 2) {
            if (hand[0].value === 'A' && (hand[1].value === 'K' || hand[1].value === 'Q' || hand[1].value === 'J' || hand[1].value === '10')) {
                return true;
            } else if (hand[1].value === 'A' && (hand[0].value === 'K' || hand[0].value === 'Q' || hand[0].value === 'J' || hand[0].value === '10')) {
                return true;
            }
        }
        return false;
    }

    // Method to calculate the payout for a game of blackjack
    async calculatePayout(bet, blackjack) {
        if (blackjack) {
            return bet * 2.5;
        } else {
            return bet * 2;
        }
    }

    // Method to start a game of blackjack. Store the game data for each user in the cache. Once the game is over, remove the game data from the cache.
    async startBlackjackGame(userId, bet) {
        try {
            const deck = await this.generateDeck();
            const gameData = {
                userId: userId,
                bet: bet,
                deck: deck,
                playerHand: await this.dealHand(deck),
                dealerHand: await this.dealHand(deck),
                playerValue: 0,
                dealerValue: 0,
                winner: '',
                playerBlackjack: false,
                dealerBlackjack: false
            }
            gameData.playerValue = await this.calculateHandValue(gameData.playerHand);
            gameData.dealerValue = await this.calculateHandValue(gameData.dealerHand);
            gameData.playerBlackjack = await this.isBlackjack(gameData.playerHand);
            gameData.dealerBlackjack = await this.isBlackjack(gameData.dealerHand);
            return gameData;
        }
        catch (error) {
            logger.error(`Error in startBlackjackGame: ${error}`);
        }
    }

    // Reward the winner of a slap game. 
    async rewardSlapWinner(winnerUserId) {
        try {
            // Get the game settings
            const gameSettings = await this.getGameSetting('Slap');
            const currency = gameSettings.currency;
            const payout = gameSettings.payout;
            // Increase the currency for the winner
            usersDB.increaseCurrency(winnerUserId, currency, payout);
            return gameSettings;
        }
        catch (error) {
            logger.error(`Error in rewardSlapWinner: ${error}`);
        }
    }

    // Reward the winner of the number guessing game.
    async rewardNumberGuessingGameWinner(winnerUserId) {
        try {
            const gameSettings = await this.getGameSetting('Number Guessing Game');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const payout = gameSettings.payout;
                // Increase the currency for the winner
                usersDB.increaseCurrency(winnerUserId, currency, payout);
                return gameSettings;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardNumberGuessingGameWinner: ${error}`);
        }
    }

    // Reward the winner of the movie quote game
    async rewardMovieQuoteGameWinner(winnerUserId) {
        try {
            const gameSettings = await this.getGameSetting('Movie Quote Game');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const payout = gameSettings.payout;
                // Increase the currency for the winner
                usersDB.increaseCurrency(winnerUserId, currency, payout);
                return gameSettings;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardMovieQuoteGameWinner: ${error}`);
        }
    }

    // Reward a user for answering a movie quote correctly
    async rewardMovieQuoteAnswerer(winnerUserId) {
        try {
            const gameSettings = await this.getGameSetting('Movie Quote Game');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const payout = gameSettings.perQuestion;
                // Increase the currency for the winner
                usersDB.increaseCurrency(winnerUserId, currency, payout);
                return gameSettings;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardMovieQuoteAnswerer: ${error}`);
        }
    }

    // Method to get a movie quote from the database as well as 3 other random movies. It is in the movieQuotes collection. Each quote has a movie and a quote. 
    async getMovieQuote() {
        try {
            let movieQuotes = await this.cache.get('movieQuotes');
            if (!movieQuotes) {
                const quotes = await this.dbConnection.collection('movieQuotes').find({}).toArray();
                this.cache.set('movieQuotes', quotes);
                movieQuotes = quotes;
            }
            const data = {
                quote: undefined,
                answer: undefined,
                answerLetter: undefined,
                options: []
            };
            const options = [];
            // Get a random movie quote
            const quote = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
            // Set the quote and answer
            data.quote = quote.quote;
            data.answer = quote.movie;
            // Get 3 other random movies
            for (let i = 0; i < 3; i++) {
                let option = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
                // Make sure the option is not the same as the answer or any of the other options
                while (option.movie === quote.movie || options.includes(option.movie)) {
                    option = movieQuotes[Math.floor(Math.random() * movieQuotes.length)];
                }
                options.push(option.movie);
            }
            // Add the answer to the options
            options.push(quote.movie);
            // Shuffle the options
            options.sort(() => Math.random() - 0.5);
            const letters = ['A', 'B', 'C', 'D'];
            // Iterate through each option and make it an object with a letter and the option
            options.forEach((option, index) => {
                data.options.push({ letter: letters[index], option: option });
            });
            // Identify the answer letter
            data.answerLetter = data.options.find(option => option.option === quote.movie).letter;
            return data;
        }
        catch (error) {
            logger.error(`Error in getMovieQuote: ${error}`);
        }
    }

    // Reward the winner of the rock paper scissors game
    async rewardRockPaperScissorsWinner(winnerUserId) {
        try {
            const gameSettings = await this.getGameSetting('Rock Paper Scissors');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const payout = gameSettings.payout;
                // Increase the currency for the winner
                usersDB.increaseCurrency(winnerUserId, currency, payout);
                return gameSettings;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardRockPaperScissorsWinner: ${error}`);
        }
    }

    // Reward the winner of the bits war
    async rewardBitsWarWinner(winnerUserId) {
        try {
            const gameSettings = await this.getGameSetting('Bits War');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const payout = gameSettings.payout;
                // Increase the currency for the winner
                usersDB.increaseCurrency(winnerUserId, currency, payout);
                return gameSettings;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardBitsWarWinner: ${error}`);
        }
    }

    // Reward currency for each time a user cheers bits
    async rewardBitsCheer(userId, bits) {
        try {
            const gameSettings = await this.getGameSetting('Bits Cheer');
            if (gameSettings) {
                const currency = gameSettings.currency;
                const multiplier = gameSettings.bitsMultiplier;
                // Get the current payout settings for the currency
                const currencySettings = await currencyDB.getCurrencyByName(currency);
                if (currencySettings) {
                    const currentPayout = currencySettings.payoutSettings.bits.amount;
                    const payout = (bits * currentPayout) * multiplier;
                    // Increase the currency for the user
                    usersDB.increaseCurrency(userId, currency, payout);
                }
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in rewardBitsCheer: ${error}`);
        }
    }
}

export default GameService;