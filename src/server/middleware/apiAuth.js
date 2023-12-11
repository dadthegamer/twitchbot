import logger from '../utilities/logger.js';

// Middleware function to check rather api key is valid.
function apiAuth(req, res, next) {
    // Get the api key from the request header.
    const apiKey = req.headers['x-api-key'];
    // If the api key is not valid, return a 401 status code.
    if (apiKey !== process.env.API_KEY) {
        const ip = req.ip;
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

export { apiAuth };