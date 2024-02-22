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
import StreamDB from '../services/streamService.js';
import CurrencyService from '../services/currencyService.js';
import ChatLogService from '../services/chatLogService.js';
import ActiveUsersCache from '../services/activeUsersService.js';
import SettingsService from '../services/settingService.js';
import OBSService from '../services/obsService.js';
import { startHighlightedMessageAlertsHandler } from '../handlers/highlightedMessageHandler.js';
import TimerManager from '../services/timerService.js';
import EventServices from '../services/eventServices.js';
import { getChatCommands, sendCommand } from '../handlers/actionHandlers/lumiaStream.js';
import GoXLRClient from '../services/goXLRService.js';
import { subscribeToDonationEvents } from '../services/streamElementsService.js';
import TikTokService from '../services/tikTokService.js';
import ActionListService from '../services/actionListService.js';
import SpotifyService from '../services/spotifyService.js';


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

// StreamDB initialization
const streamDB = new StreamDB(db.dbConnection, cache);

// CurrencyService initialization
const currencyDB = new CurrencyService(db.dbConnection, cache);

// ChatLogService initialization
const chatLogService = new ChatLogService(db.dbConnection);

// ActiveUsersCache initialization
const activeUsersCache = new ActiveUsersCache();

// Event Listener initialization
initializerEventListener(twitchApi. getApiClient());

// SettingsService initialization
const settingsDB = new SettingsService(db.dbConnection, cache);

// OBS Service initialization
const obsService = new OBSService(db.dbConnection, cache);

// Timer Manager initialization
const timerManager = new TimerManager(db.dbConnection, cache);

// Event Services initialization
const eventServices = new EventServices(db.dbConnection);

// GoXLR Client initialization
const goXLRClient = new GoXLRClient();

// TikTok Service initialization
const tikTokService = new TikTokService(db.dbConnection);

// Action List Service initialization
const actionListService = new ActionListService(db.dbConnection, cache);

// Spotify Service initialization
const spotifyService = new SpotifyService(db.dbConnection);

// Start the alerts handler
startAlertsHandler();

// Start the highlighted message alerts handler
startHighlightedMessageAlertsHandler();

// Get the chat commands from the lumia stream
getChatCommands();

// Subscribe to donation events
subscribeToDonationEvents();

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
    channelPointService,
    streamDB,
    currencyDB,
    chatLogService,
    activeUsersCache,
    settingsDB,
    obsService,
    timerManager,
    eventServices,
    goXLRClient,
    tikTokService,
    actionListService,
    spotifyService
};
