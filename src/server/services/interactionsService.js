import logger from "../utilities/logger.js";

// Class to to handle interactions with the database
class InteractionsDbService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.getRoasts();
        this.getAllQuotes();
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
        try {
            const quotes = await this.cache.get('quotes');
            const quote = quotes.find(quote => quote.id === id);
            return quote;
        }
        catch (err) {
            writeToLogFile('error', `Error in getQuoteById: ${err}`);
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
}

export default InteractionsDbService;