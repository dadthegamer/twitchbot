import express from 'express';
import session from 'express-session';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import MongoDBStore from 'connect-mongodb-session';
import { config } from 'dotenv';
import { usersDB } from './config/initializers.js'

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

app.use(express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
    console.log(`Server is running`);
});