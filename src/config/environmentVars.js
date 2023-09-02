import { config } from 'dotenv';

config();

const uri = `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}`;
const dbName = 'website';
const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const environment = process.env.NODE_ENV;

export {
    uri,
    dbName,
    twitchClientId,
    twitchClientSecret,
    environment,
}