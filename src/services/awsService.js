import AWS from 'aws-sdk';
import { amazonAccessKey, amazonSecretKey } from '../config/environmentVars.js';
import { writeToLogFile } from '../utilities/logging.js';

const polly = new AWS.Polly({
    region: 'us-east-1',
    accessKeyId: amazonAccessKey,
    secretAccessKey: amazonSecretKey
});

export async function textToSpeech(text) {
    const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Matthew'
    };

    try {
        const speech = await polly.synthesizeSpeech(params).promise();
        return speech;
    } catch (error) {
        writeToLogFile('error', `Error generating speech: ${error}`);
    }
}
