
import express from 'express';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import MongoDBStore from 'connect-mongodb-session';
import { config } from 'dotenv';
import { schedulerService, usersDB } from './config/initializers.js';
import logger from './utilities/logger.js';


config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export { __dirname };

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

// Twitch authentication
import twitchAuthRouter from './routes/authRoutes/twitchAuth.js';
import twitchCallbackRouter from './routes/authRoutes/twitchCallback.js';
import twitchAdminAuthRouter from './routes/authRoutes/twitchAdminAuth.js';

//API routes
import statusRouter from './routes/apiRoutes/status.js';
import commandsRouter from './routes/apiRoutes/commands.js';

// Twitch authentication
app.use('/auth/twitch', twitchAuthRouter);
app.use('/auth/twitch/callback', twitchCallbackRouter);
app.use('/auth/twitch/admin', twitchAdminAuthRouter);

// API routes
app.use('/api/status', statusRouter);
app.use('/api/commands', commandsRouter);


app.listen(port, () => {
    console.log(`Server is running`);
    logger.info(`Server is running`);
});