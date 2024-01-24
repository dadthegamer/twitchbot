import logger from '../utilities/logger.js';
import { streamerUserId } from '../config/environmentVars.js';

// Define a middleware function to check if the user is logged in. If they are not logged in, redirect them to the login page.
export function isLoggedIn(req, res, next) {
    if (!req.session.userData) {
        const ip = req.ip;
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

// Define a middleware to check rather the streamer is logged in. 
export function isStreamer(req, res, next) {
    if (req.session.userData.id !== streamerUserId) {
        const ip = req.ip;
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

// Define a middlehwere to check if the user is logged in and is the userId in the URL matches the userId in the session.
export function isUser(req, res, next) {
    if (req.session.userData.id !== req.params.id) {
        const ip = req.ip;
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

// Define a middleware to check if the user is logged in and is the userId in the URL matches the userId in the session or if the user is the streamer.
export function isUserOrStreamer(req, res, next) {
    if (req.session.userData.id !== req.params.id && req.session.userData.id !== streamerUserId) {
        const ip = req.ip;
        console.log(req.session.userData.id);
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};