import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { cache, viewTimeDB, activeUsersCache } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const stream = await cache.get('streamInfo');
        const live = await cache.get('live');
        const data = {
            stream,
            live,
        };
        res.status(200).json(data);
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});

// Endpoint to get the current viewers in chat
router.get('/viewers', async (req, res) => {
    try {
        const viewers = await cache.get('currentViewers');
        res.status(200).json(viewers);
    }
    catch (err) {
        logger.error(`Error in viewers: ${err}`);
    }
});

// Endpoint to get a random viewer from the current viewers in chat
router.get('/random-viewer', async (req, res) => {
    try {
        const viewers = await cache.get('currentViewers');
        if (viewers === undefined || viewers.length === 0) {
            res.status(200).json({});
            return;
        } else {
            const randomViewer = viewers[Math.floor(Math.random() * viewers.length)];
            res.status(200).json(randomViewer);
        }
    }
    catch (err) {
        logger.error(`Error in randomViewer: ${err}`);
    }
});

// Endpoint to get a random active user
router.get('/random-activeUser', async (req, res) => {
    try {
        const randomUser = await activeUsersCache.getRandomActiveUser();
        res.status(200).json(randomUser);
    }
    catch (err) {
        logger.error(`Error in randomActiveUser: ${err}`);
    }
});

// Endpoint to get the latest events
router.get('/events', async (req, res) => {
    try {
        const events = await cache.get('latestEvents');
        res.status(200).json(events);
    }
    catch (err) {
        logger.error(`Error in events: ${err}`);
    }
});


export default router;