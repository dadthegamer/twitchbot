import { CacheService } from '../services/cacheServices.js';
import { MongoDBConnection } from './mongodb.js';
import { UsersDB } from '../services/userServices.js';
import { TokenDB } from '../services/tokenServices.js';
import { AuthProviderManager  } from '../services/twitchAuthProviderServices.js';
import { TwitchApiClient } from '../services/twitchApiServices.js';
import { twitchClientId, twitchClientSecret } from './environmentVars.js';
import { TwitchEventListenersServices } from '../services/twitchEventListenerServices.js';
import { TwitchChatClient } from '../services/twitchChatClientServices.js';
import { TwitchBotClient } from '../services/twitchBotServices.js';

const db = new MongoDBConnection();
await db.connect();
const cache = new CacheService();

const usersDB = new UsersDB(db.dbConnection, cache);
const tokenDB = new TokenDB(db.dbConnection);

const twitchApiClient = new AuthProviderManager(tokenDB, twitchClientId, twitchClientSecret, '64431397', '671284746');
await twitchApiClient.initializeAuthProvider();
await twitchApiClient.addUserToAuthProvider('64431397');
await twitchApiClient.addUserToAuthProvider('671284746');
const authProvider = twitchApiClient.getAuthProvider();
const twitchApi = new TwitchApiClient(authProvider, '64431397');
const twitchEventListeners = new TwitchEventListenersServices(twitchApi.getApiClient(), '64431397', '671284746');
await twitchEventListeners.startEventListener();
const chatClient = new TwitchChatClient(authProvider)
await chatClient.connectToBotChat();
const twitchBotClient = new TwitchBotClient(authProvider);
await twitchBotClient.connectToBotChat();

export {
    db,
    cache,
    usersDB,
    tokenDB,
    twitchApiClient,
    twitchApi,
    twitchEventListeners,
    chatClient,
    twitchBotClient
};
