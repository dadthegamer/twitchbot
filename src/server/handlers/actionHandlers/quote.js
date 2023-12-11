import logger from "../../utilities/logger.js";
import { chatClient } from '../../config/initializers.js';
import { interactionsDB } from '../../config/initializers.js';


// Function to get a quote by id from the database
export async function getQuoteById(id) {
    try {
        const quote = await interactionsDB.getQuoteById(id);
        if (!quote) {
            chatClient.say(`Quote with id ${id} not found`);
        } else {
            const creator = quote.creator;
            chatClient.say(`@${creator} quoted DTG: "${quote.text}"`);
        }
    }
    catch (err) {
        logger.error(`Error in getQuoteById: ${err}`);
    }
}

// Function to get a random quote from the database
export async function getRandomQuote() {
    try {
        const quote = await interactionsDB.getRandomQuote();
        const creator = quote.creator;
        chatClient.say(`@${creator} quoted DTG: "${quote.text}"`);
    }
    catch (err) {
        logger.error(`Error in getRandomQuote: ${err}`);
    }
}

// Function to store a new quote into the database
export async function createQuote(quote, creator) {
    try {
        const newQuote = await interactionsDB.createQuote(quote, creator);
        chatClient.say(`@${creator} created a quote with an id of ${newQuote.id}`);
    }
    catch (err) {
        console.log(err);
        logger.error(`Error in createQuote: ${err}`);
    }
}