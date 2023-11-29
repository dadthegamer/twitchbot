import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}/twitchBot`,
    collection: 'sessions',
    ttl: 365 * 24 * 60 * 60,
});

store.on('error', (error) => {
    console.error('Session store error:', error);
});

let secret = '';
// Get the secret from the environment. If there is no secret throw an error.
if (!process.env.SESSION_SECRET) {
    throw new Error('No session secret set in environment. Please set SESSION_SECRET.');
} else {
    secret = process.env.SESSION_SECRET;
}

export default session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    },
});
