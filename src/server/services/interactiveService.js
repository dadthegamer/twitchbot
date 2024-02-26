import logger from "../utilities/logger.js";
import { webSocket, chatClient, usersDB } from "../config/initializers.js";
import { actionEvalulate } from '../handlers/evaluator.js';
import { sarcasticResponse } from '../services/openAi.js';
import NodeCache from 'node-cache';
import { numberWithCommas } from '../utilities/utils.js';
import fs from 'fs/promises';


// Class to to handle interactions with the database
class InteractionsDbService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.cooldownCache = new NodeCache({ stdTTL: 0, checkperiod: 300 });
        this.getRoasts();
        this.getAllQuotes();
        this.getTvMessage();
        this.getQueue();
        this.getAllSounds();
        this.getDropSettings();
        this.getBitsBoard();
        this.getAllGames();
        this.getSoundsFromFolder();
        this.getAllSounds();
    }

    // Method to get all the roasts from the database
    async getRoasts() {
        try {
            const roasts = await this.dbConnection.collection('roasts').find({}).toArray();
            this.cache.set('roasts', roasts);
            return roasts;
        }
        catch (err) {
            logger.error(`Error in getRoasts: ${err}`);
        }
    }

    // Method to get a random roast from the database
    async getRandomRoast() {
        try {
            const roasts = await this.cache.get('roasts');
            const randomRoast = roasts[Math.floor(Math.random() * roasts.length)];
            return randomRoast.roast;
        }
        catch (err) {
            logger.error(`Error in getRandomRoast: ${err}`);
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

    // Method to insert a roast into the database if it doesn't already exist
    async insertRoast(roast) {
        try {
            const roastExists = await this.dbConnection.collection('roasts').findOne({ roast });
            if (roastExists) {
                return 'Roast already exists';
            }
            else {
                await this.dbConnection.collection('roasts').insertOne({ roast });
                await this.getRoasts();
                return 'Roast added';
            }
        }
        catch (err) {
            logger.error(`Error in insertRoast: ${err}`);
        }
    }

    // Method to get all the quotes from the database
    async getAllQuotes() {
        try {
            const quotes = await this.dbConnection.collection('quotes').find({}).toArray();
            this.cache.set('quotes', quotes);
            return quotes;
        }
        catch (err) {
            logger.error(`Error in getAllQuotes: ${err}`);
        }
    }

    // Method to get a random quote from the database
    async getRandomQuote() {
        try {
            const quotes = await this.cache.get('quotes');
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            return randomQuote;
        }
        catch (err) {
            logger.error(`Error in getRandomQuote: ${err}`);
        }
    }

    // Method to get a quote by id from the cache
    async getQuoteById(id) {
        if (typeof id !== 'number') {
            id = parseInt(id);
        }
        try {
            const quotes = await this.cache.get('quotes');
            const quote = quotes.find(quote => quote.id === id);
            if (!quote) {
                return null;
            } else {
                return quote;
            }
        }
        catch (err) {
            logger.error(`Error in getQuoteById: ${err}`);
        }
    }

    // Method to store a new quote into the database with the id being one number higher than the id of the last quote
    async createQuote(quote, creator) {
        try {
            const quotes = await this.cache.get('quotes');
            // Starting at 1 see if there is a quote with that id. If there is not then assign that id to the new quote
            for (let i = 1; i < quotes.length + 5; i++) {
                const quoteExists = await this.getQuoteById(i);
                if (quoteExists === null || quoteExists === undefined) {
                    console.log(`Quote with id ${i} does not exist`);
                    const newQuote = {
                        id: i,
                        text: quote,
                        originator: 'dadthegam3r',
                        creator: creator,
                        createdAt: new Date(),
                    }
                    await this.dbConnection.collection('quotes').insertOne(newQuote);
                    await this.getAllQuotes();
                    return newQuote;
                }
            }
        }
        catch (err) {
            console.log(err);
            logger.error(`Error in createQuote method: ${err}`);
        }
    }

    // Method to store a new quote into the database with the id being an argument passed in
    async createQuoteWithId(id, quote, creator) {
        try {
            const newQuote = {
                id: id,
                text: quote,
                originator: 'dadthegam3r',
                creator: creator,
                createdAt: new Date(),
            }
            await this.dbConnection.collection('quotes').insertOne(newQuote);
            await this.getAllQuotes();
            return newQuote;
        }
        catch (err) {
            logger.error(`Error in createQuoteWithId: ${err}`);
        }
    }

    // Method to update a quote in the database
    async updateQuote(id, quote, creator) {
        if (typeof id !== 'number') {
            id = parseInt(id);
        }
        try {
            const res = await this.dbConnection.collection('quotes').updateOne({ id: id },
                {
                    $set:
                    {
                        text: quote,
                        creator: creator
                    }
                }
            );
            await this.getAllQuotes();
            return res;
        }
        catch (err) {
            logger.error(`Error in updateQuote: ${err}`);
        }
    }

    // Method to delete a quote from the database
    async deleteQuote(id) {
        if (typeof id !== 'number') {
            id = parseInt(id);
        }
        try {
            const res = await this.dbConnection.collection('quotes').deleteOne({ id: id });
            await this.getAllQuotes();
            return res;
        }
        catch (err) {
            logger.error(`Error in deleteQuote: ${err}`);
        }
    }

    // Method to set the message that is displayed on the tv
    async setTvMessage(message) {
        try {
            await this.dbConnection.collection('gameSettings').updateOne({ id: 'display' },
            {
                $set:
                {
                    message: message
                }
            }
        );
        this.cache.set('displayMessage', message);
        webSocket.displayMessage(message);
        }
        catch (err) {
            logger.error(`Error in setTvMessage: ${err}`);
        }
    }

    // Method to get the message that is displayed on the tv and store it in the cache
    async getTvMessage() {
        try {
            const tvMessage = await this.dbConnection.collection('gameSettings').findOne({ id: 'display' });
            this.cache.set('displayMessage', tvMessage.message);
            return tvMessage.message;
        }
        catch (err) {
            logger.error(`Error in getTvMessage: ${err}`);
        }
    }

    // Method to get the queue from the database and store it in the cache
    async getQueue() {
        try {
            const queue = await this.dbConnection.collection('gameSettings').findOne({ id: 'queue' });
            this.cache.set('queue', queue.queue);
            return queue.queue;
        }
        catch (err) {
            logger.error(`Error in getQueue: ${err}`);
        }
    }

    // Method to add a user to the queue
    async addToQueue(displayName) {
        try {
            const queue = await this.cache.get('queue');
            if (!queue) {
                await this.dbConnection.collection('gameSettings').insertOne({ id: 'queue', queue: [] });
                this.cache.set('queue', []);
            };
            if (!queue.includes(displayName)) {
                queue.push(displayName);
                await this.dbConnection.collection('gameSettings').updateOne({ id: 'queue' },
                    {
                        $set:
                        {
                            queue: queue
                        }
                    }
                );
                this.cache.set('queue', queue);
                const position = queue.indexOf(displayName) + 1;
                return position;
            } else {
                return false;
            }
        }
        catch (err) {
            logger.error(`Error in addToQueue: ${err}`);
        }
    }

    // Method to remove a user from the queue
    async removeFromQueue(displayName) {
        try {
            const queue = await this.cache.get('queue');
            if (queue.includes(displayName)) {
                queue.splice(queue.indexOf(displayName), 1);
                await this.dbConnection.collection('gameSettings').updateOne({ id: 'queue' },
                    {
                        $set:
                        {
                            queue: queue
                        }
                    }
                );
                this.cache.set('queue', queue);
                return true;
            } else {
                return false;
            }
        }
        catch (err) {
            logger.error(`Error in removeFromQueue: ${err}`);
        }
    }

    // Method to clear the queue
    async clearQueue() {
        try {
            await this.dbConnection.collection('gameSettings').updateOne({ id: 'queue' },
                {
                    $set:
                    {
                        queue: []
                    }
                }
            );
            this.cache.set('queue', []);
            return true;
        }
        catch (err) {
            logger.error(`Error in clearQueue: ${err}`);
        }
    }

    // Method to store a new sound into the database
    async createSound(soundName, file) {
        try {
            const newSound = {
                soundName: soundName,
                location: `/audio/${file}`,
                createdAt: new Date(),
            }
            await this.dbConnection.collection('sounds').insertOne(newSound);
            await this.getAllSounds();
            return newSound;
        }
        catch (err) {
            logger.error(`Error in createSound: ${err}`);
        }
    }

    // Method to get all sounds from the public/audio folder and store them in the database if they don't already exist. Each sound is an mp3 file
    async getSoundsFromFolder() {
        try {
            console.log('Getting sounds from folder');
            const sounds = await this.dbConnection.collection('sounds').find({}).toArray();
            const soundNames = sounds.map(sound => sound.soundName);
            const files = await fs.readdir('./public/audio');
            for (const file of files) {
                // Check if the file is an mp3 file. If it is not then skip it.
                if (!file.endsWith('.mp3')) {
                    continue;
                } else {
                    console.log(`File: ${file}`)
                    const soundName = file.split('.')[0];
                    if (!soundNames.includes(soundName)) {
                        const newSound = {
                            soundName: soundName,
                            location: `/audio/${file}`,
                            createdAt: new Date(),
                        }
                        await this.dbConnection.collection('sounds').insertOne(newSound);
                    }
                }
            }
            await this.getAllSounds();
        }
        catch (err) {
            console.log(`Error in getSoundsFromFolder: ${err}`);
            logger.error(`Error in getSoundsFromFolder: ${err}`);
        }
    }

    // Method to get all the sounds from the database and store them in the cache
    async getAllSounds() {
        try {
            const sounds = await this.dbConnection.collection('sounds').find({}).toArray();
            this.cache.set('sounds', sounds);
            return sounds;
        }
        catch (err) {
            logger.error(`Error in getAllSounds: ${err}`);
        }
    }

    // Method to delete a sound from the database and the cache
    async deleteSound(soundName) {
        try {
            const res = await this.dbConnection.collection('sounds').deleteOne({ soundName: soundName });
            await this.getAllSounds();
            return res;
        }
        catch (err) {
            logger.error(`Error in deleteSound: ${err}`);
        }
    }

    // Method to get a sound from the cache
    async getSound(soundName) {
        try {
            const sounds = await this.cache.get('sounds');
            const sound = sounds.find(sound => sound.soundName === soundName);
            if (!sound) {
                return null;
            } else {
                return sound;
            }
        }
        catch (err) {
            logger.error(`Error in getSound: ${err}`);
        }
    }

    // Method to get the drop settings from the cache. If they don't exist in the cache then get them from the database and store them in the cache
    async getDropSettings() {
        try {
            let dropSettings = await this.cache.get('dropSettings');
            if (!dropSettings) {
                dropSettings = await this.dbConnection.collection('gameSettings').findOne({ id: 'drop' });
                this.cache.set('dropSettings', dropSettings);
            }
            return dropSettings;
        }
        catch (err) {
            logger.error(`Error in getDropSettings: ${err}`);
        }
    }

    // Method to get the raffle settings from the cache. If they don't exist in the cache then get them from the database and store them in the cache
    async getRaffleSettings() {
        try {
            let raffleSettings = await this.cache.get('raffleSettings');
            if (!raffleSettings) {
                raffleSettings = await this.dbConnection.collection('gameSettings').findOne({ id: 'raffle' });
                this.cache.set('raffleSettings', raffleSettings);
            }
            return raffleSettings;
        }
        catch (err) {
            logger.error(`Error in getRaffleSettings: ${err}`);
        }
    }

    // Method to create a bits board item
    async createBitsBoardItem(itemName, cost, description, handlers, image = null) {
        try {
            if (typeof cost !== 'number') {
                cost = parseInt(cost);
            }
            const newBitsBoardItem = {
                itemName: itemName,
                cost: cost,
                description: description,
                handlers: handlers,
                image: image,
                createdAt: new Date(),
            }
            await this.dbConnection.collection('bitsBoard').insertOne(newBitsBoardItem);
            await this.getBitsBoard();
            return newBitsBoardItem;
        }
        catch (err) {
            logger.error(`Error in createBitsBoardItem: ${err}`);
        }
    }

    // Method to get all the bits board items from the database and store them in the cache
    async getBitsBoard() {
        try {
            const bitsBoard = await this.dbConnection.collection('bitsBoard').find({}).toArray();
            this.cache.set('bitsBoard', bitsBoard);
            return bitsBoard;
        }
        catch (err) {
            logger.error(`Error in getBitsBoard: ${err}`);
        }
    }

    // Method to delete a bits board item from the database and the cache
    async deleteBitsBoardItem(itemName) {
        try {
            const res = await this.dbConnection.collection('bitsBoard').deleteOne({ itemName: itemName });
            await this.getBitsBoard();
            return res;
        }
        catch (err) {
            logger.error(`Error in deleteBitsBoardItem: ${err}`);
        }
    }

    // Method to handle bits redemptions
    async handleBits(amount) {
        try {
            const bitsBoard = await this.cache.get('bitsBoard');
            if (!bitsBoard) {
                await this.getBitsBoard();
            }
            // Find the item that matches the amount of bits redeemed
            const item = bitsBoard.find(item => item.cost === amount);
            if (item) {
                // If there are handlers for the item then execute them
                if (item.handlers.length > 0) {
                    for (const handler of item.handlers) {
                        await actionEvalulate(handler);
                    }
                }
                return item;
            } else {
                return null;
            }
        }
        catch (err) {
            logger.error(`Error in handleBits: ${err}`);
        }
    }

    // Method to handle cooldown for users
    async cooldownHandler(userId, displayName) {
        try {
            const key = `${userId}-${displayName}`;
            const isOnCooldown = this.cooldownCache.has(key);
            if (!isOnCooldown) {
                this.cooldownCache.set(key, true, 300);
                return true;
            } else {
                return this.cooldownCache.getTtl(key);
            }
        }
        catch (err) {
            logger.error(`Error in cooldownHandler: ${err}`);
        }
    }

    // Method to handle sarcastic response
    async sarcasticResponseHandler(messageFromChat, userId, displayName) {
        try {
            const isOnCooldown = await this.cooldownHandler(userId, displayName);
            if (isOnCooldown !== true) {
                chatClient.say(`@${displayName}, you are on cooldown for ${isOnCooldown} seconds.`);
            } else {
                const response = await sarcasticResponse(messageFromChat);
                chatClient.say(response);
                webSocket.TTS({ message: response, img: null });
            }
        }
        catch (err) {
            logger.error(`Error in sarcasticResponseHandler: ${err}`);
        }
    }
}

export default InteractionsDbService;