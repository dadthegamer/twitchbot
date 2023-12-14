import logger from '../utilities/logger.js';
import OpenAI from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function openAiRequest(message) {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: message }],
        model: 'gpt-3.5-turbo',
    });
    const response = chatCompletion.choices[0].message.content;
    return response;
}

// Function to make sure the content is appropriate for my twitch chat
export async function openAiRequestIsAppropriate(message) {
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

// Function to roast the user
export async function roastUser() {
    const chatCompletion = await openai.chat.completions.create({
        messages: [{ role: 'user', content: 'Roast the u' }],
        model: 'gpt-3.5-turbo',
    });
    const response = chatCompletion.choices[0].message.content;
    return response;
}