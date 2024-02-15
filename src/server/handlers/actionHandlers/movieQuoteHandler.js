import logger from '../../utilities/logger.js';
import { gameService, chatClient, webSocket } from "../../config/initializers.js";


let gameStarted = false;


export async function startGame() {
    try {
        gameStarted = true;
        chatClient.say(`The game has started!`);
    }
    catch (err) {
        logger.error(`Error starting game movie quote trivia: ${err}`);
    }
}


export async function randomMovieQuote() {
    try {
        const movieQuote = await gameService.getMovieQuote();
        webSocket.movieQuote(movieQuote);
    } catch (err) {
        logger.error(`Error getting movie quote in movieQuoteHandler: ${err}`);
    }
}