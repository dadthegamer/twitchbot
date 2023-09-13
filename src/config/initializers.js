import { CacheService } from '../services/cacheServices.js';
import { MongoDBConnection } from './mongodb.js';
import { UsersDB } from '../services/userServices.js';
import { TokenDB } from '../services/tokenServices.js';
import { WebSocket } from '../services/webSocket.js';
import { startWelcomeAlerts } from '../handlers/welcomeHandler.js';
import { startAlertsHandler } from '../handlers/alertHandler.js';
import { setInitialCacheValues } from './varInitializers.js';
import { ActiveUsersHandler } from '../handlers/twitch/chatHandlers/activeUsersHandler.js';
import { Commands } from '../services/commandServices.js';
import { CommandHandler } from '../handlers/twitch/chatHandlers/commandHandlers/commandHandler.js';
import { StreamDB } from '../services/streamServices.js';
import { subscribeToDonationEvents } from '../services/streamElementsService.js';
import { AuthProviderManager } from '../services/twitchAuthProviderServices.js';
import { TwitchApiClient } from '../services/twitchApiServices.js';
import { TwitchChatClient } from '../services/twitchChatClientServices.js';
import { viewTimeHandler } from '../handlers/twitch/viewTimeHandler.js';
import { addBotsToKnownBots } from '../handlers/twitch/viewTimeHandler.js';
import { InteractionsDbService } from '../services/interactionsService.js';
import { NotificationService } from '../services/notificationService.js';
import { ChatLogService } from '../services/chatLogService.js';
import { SettingsService } from '../services/settingsService.js';
import { CurrencyService } from '../services/currencyService.js';
import { RaffleService } from '../services/raffleService.js';


// Cache initialization
const cache = new CacheService('mainCache');
setInitialCacheValues();
// MongoDB initialization
const db = new MongoDBConnection();
await db.connect();

// Database initialization
const usersDB = new UsersDB(db.dbConnection, cache);
const tokenDB = new TokenDB(db.dbConnection);

// NotificationDB initialization
const notificationDB = new NotificationService(db.dbConnection, cache);

// Twitch API initialization
const authProvider = new AuthProviderManager(tokenDB);
await authProvider.addAllUsersToAuthProvider();
const twitchApi = new TwitchApiClient(authProvider.authProvider, cache);

// Chat client initialization
const chatClient = new TwitchChatClient(authProvider.authProvider);
await chatClient.connectToBotChat();

// Chat log service initialization
const chatLogService = new ChatLogService(db.dbConnection);

// SettingsDB initialization
const settingsDB = new SettingsService(db.dbConnection, cache);

// InteractionsDB initialization
const interactionsDB = new InteractionsDbService(db.dbConnection, cache);

// StreamDB initialization
const streamDB = new StreamDB(db.dbConnection, cache);

// CurrencyDB initialization
const currencyDB = new CurrencyService(db.dbConnection, cache);

// Websocket initialization
const webSocket = new WebSocket();
webSocket.startWebSocketServer();

// Active users cache initialization
const activeUsersCache = new ActiveUsersHandler();

// CommandDB initialization
const commands = new Commands(db.dbConnection);

// Command cache initialization
const commandHandler = new CommandHandler(commands.cache);

// RaffleDB initialization
const raffleDB = new RaffleService(db.dbConnection, cache);

// Subscribe to donation events
subscribeToDonationEvents();

addBotsToKnownBots();
startAlertsHandler();
startWelcomeAlerts();
setInterval(viewTimeHandler, 1000);


export {
    db,
    cache,
    usersDB,
    tokenDB,
    twitchApi,
    chatClient,
    webSocket,
    activeUsersCache,
    commands,
    commandHandler,
    streamDB,
    interactionsDB,
    notificationDB,
    chatLogService,
    settingsDB,
    currencyDB,
    raffleDB,
};
