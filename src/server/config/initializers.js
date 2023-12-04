import CacheService from '../services/cacheServices.js';
import MongoDBConnection from './mongodb.js';
import UsersDB from '../services/userServices.js';
import TokenDB from '../services/tokenServices.js';
import { WebSocket } from '../services/webSocket.js';
import { startAlertsHandler } from '../handlers/alertHandler.js';
import AuthProviderManager from '../services/twitchAuthProviderServices.js';
import TwitchChatClient from '../services/twitchChatClientServices.js';
import GoalService from '../services/goalService.js';
import ViewTimeService from '../services/viewTimeService.js';
import TwitchApiClient from '../services/twitchApiService.js';
import { SchedulerService } from '../services/schedulerService.js';
import { initializerEventListener } from '../services/twitchEventListenerServices.js';
import CommandService from '../services/commandService.js';
import InteractionsDbService from '../services/interactiveService.js';
import GameService from '../services/gameService.js';
import TwitchChannelPointService from '../services/channelPointService.js';

// Cache initialization
const cache = new CacheService('mainCache');

// MongoDB initialization
const db = new MongoDBConnection();
await db.connect();

// User Database initialization
const usersDB = new UsersDB(db.dbConnection, cache);

// Token Database initialization
const tokenDB = new TokenDB(db.dbConnection);

// Twurple Auth initialization
const authProvider = new AuthProviderManager(tokenDB);
await authProvider.addAllUsersToAuthProvider();

// Twitch API client initialization
const twitchApi = new TwitchApiClient(authProvider.getAuthProvider(), cache);

// Chat client initialization
const chatClient = new TwitchChatClient(authProvider.getAuthProvider());

// Websocket initialization
const webSocket = new WebSocket();

// GoalDB initialization
const goalDB = new GoalService(db.dbConnection, cache);

// ViewTimeDB initialization
const viewTimeDB = new ViewTimeService(db.dbConnection);

// SchedulerService initialization
const schedulerService = new SchedulerService(db.dbConnection);

// CommandService initialization
const commandHandler = new CommandService(db.dbConnection);

// GameService initialization
const interactionsDB = new InteractionsDbService(db.dbConnection, cache);

// GameService initialization
const gameService = new GameService(db.dbConnection, cache);

// Channel Points Service initialization
const channelPointService = new TwitchChannelPointService(cache, db.dbConnection);

initializerEventListener(twitchApi. getApiClient());
startAlertsHandler();

export {
    db,
    cache,
    usersDB,
    tokenDB,
    twitchApi,
    chatClient,
    webSocket,
    goalDB,
    viewTimeDB,
    schedulerService,
    authProvider,
    commandHandler,
    interactionsDB,
    gameService,
    channelPointService
};
