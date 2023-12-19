import logger from '../utilities/logger.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function openAiRequest(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: message }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        return response;
    }
    catch (error) {
        logger.error(error);
    }
}

// Function to make sure the content is appropriate for my twitch chat
export async function openAiRequestIsAppropriate(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided with a message to analyze to determine rather it is appropriate for my twitch chat. Respond in json with a key of response with either true or false. If true, then the text is appropriate for my twitch chat. If false, then the text is not. Curse words are allowed, however no bigotry, racism, or hate speech is allowed."
            },
            {
                "role": "user",
                "content": message
            }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        // Parse the response into a json object
        const responseJson = JSON.parse(response);
        return responseJson.response;
    }
    catch (error) {
        logger.error(error);
    }
}

// Function to roast the user
export async function roastUser() {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{ role: 'user', content: 'Roast the u' }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        return response;
    }
    catch (error) {
        logger.error(error);
    }
}

// Function to respond with a sarcastic response
export async function sarcasticResponse(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided a message from my Twitch chat. Respond with the most sarcastic, aka smart-ass, response you can think of. If people reference `Dad` or `DTG` they are referring to me. If it is a question about myself and my skills in the game, tailor the response to a no but make it funny."
            },
            {
                "role": "user",
                "content": message
            }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        console.log(response);
    }
    catch (error) {
        logger.error(error);
    }
}