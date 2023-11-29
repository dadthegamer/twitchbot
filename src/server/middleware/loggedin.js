import logger from '../utilities/logger.js';

// Define a middleware function to check if the user is logged in. If they are not logged in, redirect them to the login page.
function isLoggedIn(req, res, next) {
    if (!req.session.userData) {
        const ip = req.ip;
        logger.error(`Unauthorized request to ${req.originalUrl} from ${ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    } else {
        next();
    }
};

// Export the middleware function.
export default isLoggedIn;