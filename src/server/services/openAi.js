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
                "content": "You will be provided a message from my Twitch chat. Respond with the most sarcastic, aka smart-ass, response you can think of. It is ok if the response is mean or trolling myself. If people reference `Dad` or `DTG` they are referring to me. If it is a question about myself and my skills in the game, tailor the response to troll me. I also have a large forehead and users will ask about it so agree with them about the large forehead."
            },
            {
                "role": "user",
                "content": message
            }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        return response;
    }
    catch (error) {
        logger.error(`Error in sarcasticResponse ${error}`)
    }
}

// Function to create a prediction
export async function createPredictionAI(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided a message from my Twitch chat to create a prediction. Figure out the title and the outcomes from the message. An example message would be: Will the team get at least 15 kills? Yes No. The title is the will the team and the outcomes are yes and no. If there are no outcomes given than give your best guess on what the outcomes should be. You need to format the message in json with a key of title and a key of outcomes as an array. Keep the outcomes as short as possible. The title is the title of the prediction. The outcomes are the outcomes of the prediction. You can have up to 4 outcomes. Respond with the json formatted message. "
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
        return responseJson;
    }
    catch (error) {
        logger.error(`Error in createPredictionAI: ${error}`);
    }
}

// Function to rate the joke about my forehead
export async function rateForeheadJoke(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided a message from my Twitch chat that is a joke about my forehead. Rate the joke from 1.0 to 10.0. 1.0 being the worst and 10.0 being the best to the closes 10th of a decimal point. Consider originality, humor impact, with/cleverness and deliver. Format the message in json with with a key of rating and the value of the rating."
            },
            {
                "role": "user",
                "content": message
            }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        const responseJson = JSON.parse(response);
        return responseJson;
    }
    catch (error) {
        logger.error(`Error in rateForeheadJoke: ${error}`);
    }
}

// Function to respond to the prediction title
export async function respondToPredictionTitle(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided a message from my Twitch chat that is a prediction title. Always start your response with announcing thereis a new prediction. Your response will be read to my twitch chat. Respond as sarcastic as you can be without being too corny or lame. Always talking trash about myself, dad the gamer trying to achieve whatever the prediction is. Try and keep it as short as possible."
            },
            {
                "role": "user",
                "content": message
            }],
            model: 'gpt-4-0125-preview',
        });
        const response = chatCompletion.choices[0].message.content;
        return response;
    }
    catch (error) {
        logger.error(`Error in respondToPredictionTitle: ${error}`);
    }
}

// Function to format a response to a track and artist
export async function formatTrackAndArtistResponse(message) {
    try {
        const chatCompletion = await openai.chat.completions.create({
            messages: [{
                "role": "system",
                "content": "You will be provided a message from my Twitch chat that is a track and artist. Format the response as a json object with a key of artist and a key of track. The value of the artist and track should be the artist and track from the message. Respond with the json formatted message."
            },
            {
                "role": "user",
                "content": `${message}`
            }],
            model: 'gpt-3.5-turbo',
        });
        const response = chatCompletion.choices[0].message.content;
        const responseJson = JSON.parse(response);
        return responseJson;
    }
    catch (error) {
        logger.error(`Error in formatTrackAndArtistResponse: ${error}`);
    }
}