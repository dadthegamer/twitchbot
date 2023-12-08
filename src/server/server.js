
import express from 'express';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import MongoDBStore from 'connect-mongodb-session';
import { config } from 'dotenv';
import { schedulerService, usersDB } from './config/initializers.js';
import logger from './utilities/logger.js';


// setInterval(() => {
//     const usedMemory = process.memoryUsage();
//     console.log('Memory Usage (in MB):');
//     console.log('  rss: ' + (usedMemory.rss / (1024 * 1024)).toFixed(2) + ' MB');
//     console.log('  heapTotal: ' + (usedMemory.heapTotal / (1024 * 1024)).toFixed(2) + ' MB');
//     console.log('  heapUsed: ' + (usedMemory.heapUsed / (1024 * 1024)).toFixed(2) + ' MB');
//     console.log('  external: ' + (usedMemory.external / (1024 * 1024)).toFixed(2) + ' MB');
// }, 60 * 1000);

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname };

// const heapdumpPath = path.join(__dirname, 'heapdump');
// heapdump.writeSnapshot(heapdumpPath + Date.now() + '.heapsnapshot');

const app = express();
const port = 3001;

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}/twitchBot`,
    collection: 'sessions',
    ttl: 365 * 24 * 60 * 60,
});

store.on('error', (error) => {
    console.error('Session store error:', error);
    logger.error('Session store error:', error);
});

// Get the secret key from the environment variables if there is one if not use the default one
const secret = process.env.SESSION_SECRET

if (!secret) {
    throw new Error('SESSION_SECRET environment variable not set');
}


app.use(
    session({
        secret: secret,
        resave: false,
        saveUninitialized: false,
        store: store,
        cookie: {
            maxAge: 365 * 24 * 60 * 60 * 1000,
        },
    })
);

// Auth routes
import authRouter from './routes/loggedIn.js';

// Twitch authentication
import twitchAuthRouter from './routes/authRoutes/twitchAuth.js';
import twitchCallbackRouter from './routes/authRoutes/twitchCallback.js';
import twitchAdminAuthRouter from './routes/authRoutes/twitchAdminAuth.js';

// Discord authentication
import discordAuthRouter from './routes/authRoutes/discordAuth.js';
import discordCallbackRouter from './routes/authRoutes/discordCallback.js';

//API routes
import statusRouter from './routes/apiRoutes/status.js';
import commandsRouter from './routes/apiRoutes/commands.js';

// Auth routes
app.use('/api/check-auth', authRouter);

// Twitch authentication
app.use('/auth/twitch', twitchAuthRouter);
app.use('/auth/twitch/callback', twitchCallbackRouter);
app.use('/auth/twitch/admin', twitchAdminAuthRouter);

// Discord authentication
app.use('/auth/discord', discordAuthRouter);
app.use('/auth/discord/callback', discordCallbackRouter);

// API routes
app.use('/api/status', statusRouter);
app.use('/api/commands', commandsRouter);


app.listen(port, () => {
    console.log(`Server is running`);
    logger.info(`Server is running`);
});