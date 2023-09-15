import session from 'express-session';
import MongoDBStore from 'connect-mongodb-session';

const MongoDBStoreSession = MongoDBStore(session);
const store = new MongoDBStoreSession({
    uri: `mongodb://${process.env.MONGO_INITDB_DATABASE_HOST}:${process.env.MONGO_INITDB_DATABASE_PORT}/website`,
    collection: 'sessions',
    ttl: 365 * 24 * 60 * 60,
});

store.on('error', (error) => {
    console.error('Session store error:', error);
});

export default session({
    secret: 'XRxs!4ins3E!8NK6jM@LehijGsHmSQ',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        maxAge: 365 * 24 * 60 * 60 * 1000,
    },
});
