
import express from 'express';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import MongoDBStore from 'connect-mongodb-session';
import { config } from 'dotenv';
import { tokenDB, cache } from './config/initializers.js';
import logger from './utilities/logger.js';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname };

const app = express();
const port = 3001;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}/website`,
    collection: 'sessions',
    ttl: 365 * 24 * 60 * 60,
});

store.on('error', (error) => {
    console.error('Session store error:', error);
});


app.use(
    session({
        secret: 'XRxs!4ins3E!8NK6jM@LehijGsHmSQ',
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
        },
    })
);

// Twitch authentication
import twitchAuthRouter from './routes/authRoutes/twitchAuth.js';
import twitchCallbackRouter from './routes/authRoutes/twitchCallback.js';
import twitchAdminAuthRouter from './routes/authRoutes/twitchAdminAuth.js';

// Import overlay routes
import overlayRouter from './routes/overlayRoute.js';


// Import API routes
import commandsRouter from './routes/apiRoutes/commands.js';
import currencyRouter from './routes/apiRoutes/currency.js';
import leaderboardRouter from './routes/apiRoutes/leaderboard.js';
import ttsRouter from './routes/apiRoutes/tts.js';
import predictionRouter from './routes/apiRoutes/prediction.js';
import statusRoute from './routes/apiRoutes/status.js';
import streamStatsRoute from './routes/apiRoutes/streamStats.js';
import usersRouter from './routes/apiRoutes/users.js';
import quoteRouter from './routes/apiRoutes/quotes.js';
import updateRouter from './routes/apiRoutes/update.js';
import goalsRouter from './routes/apiRoutes/goals.js';

// Import GUI routes
import guiRouter from './routes/gui.js';

// Api routes
app.use('/api/commands', commandsRouter);
app.use('/api/currency', currencyRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/prediction', predictionRouter);
app.use('/api/status', statusRoute);
app.use('/api/streamdata', streamStatsRoute);
app.use('/api/users', usersRouter);
app.use('/api/quotes', quoteRouter);
app.use('/api/update', updateRouter);
app.use('/api/goals', goalsRouter);

// Overlay routes
app.use('/overlay', overlayRouter);
app.use(express.static(path.join(__dirname, '../public')));


// Twitch authentication
app.use('/auth/twitch', twitchAuthRouter);
app.use('/auth/twitch/callback', twitchCallbackRouter);
app.use('/auth/twitch/admin', twitchAdminAuthRouter);

// GUI routes
app.use('/', guiRouter);


app.listen(port, () => {
    console.log(`Server is running`);
});