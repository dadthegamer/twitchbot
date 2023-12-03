import logger from "../utilities/logger.js";

// Class to to handle interactions with the database
class InteractionsDbService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.getRoasts();
        this.getAllQuotes();
        this.getTvMessage();
        this.getQueue();
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
            return quote;
        }
        catch (err) {
            logger.error(`Error in getQuoteById: ${err}`);
        }
    }

    // Method to store a new quote into the database with the id being one number higher than the id of the last quote
    async createQuote(quote, creator) {
        try {
            const quotes = await this.cache.get('quotes');
            const lastQuote = quotes[quotes.length - 1];
            const newQuote = {
                id: lastQuote.id + 1,
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
            logger.error(`Error in createQuote: ${err}`);
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
                { $set: 
                    { 
                    text: quote,
                    creator: creator 
                    } 
                }
            );
            console.log(res)
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
                { $set: 
                    { 
                    message: message
                    } 
                }
            );
            this.cache.set('tvMessage', message);
        }
        catch (err) {
            logger.error(`Error in setTvMessage: ${err}`);
        }
    }

    // Method to get the message that is displayed on the tv and store it in the cache
    async getTvMessage() {
        try {
            const tvMessage = await this.dbConnection.collection('gameSettings').findOne({ id: 'display' });
            this.cache.set('tvMessage', tvMessage.message);
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
                    { $set: 
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
                    { $set: 
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
                { $set: 
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
}

export default InteractionsDbService;