import { config } from 'dotenv';

config();

const uri = `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}`;
const eventListenerPort = process.env.EVENTLISTENERPORT;
const hostName = process.env.HOSTNAME;
const dbName = 'website';
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const environment = process.env.NODE_ENV;
const twitchRedirectUri = encodeURIComponent(process.env.TWITCH_REDIRECT_URI);
const mongodbHost = process.env.MONGO_INITDB_DATABASE_HOST;
const mongodbPort = process.env.MONGO_INITDB_DATABASE_PORT;
const openAIKey = process.env.OPENAI_KEY;
const streamingPCIP = process.env.STREAMING_PC_IP;
const rapidAPIKey = process.env.RAPID_API_KEY;
const apiNinjaKey = process.env.API_NINJA_KEY;
const amazonAccessKey = process.env.AMAZON_ACCESS_KEY_ID;
const amazonSecretKey = process.env.AMAZON_SECRET_KEY;
const appSecret = process.env.APP_SECRET;


export {
    uri,
    dbName,
    twitchClientId,
    twitchClientSecret,
    environment,
    twitchRedirectUri,
    mongodbHost,
    mongodbPort,
    openAIKey,
    streamingPCIP,
    rapidAPIKey,
    apiNinjaKey,
    amazonAccessKey,
    amazonSecretKey,
    eventListenerPort,
    hostName,
    appSecret,
}