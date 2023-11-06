import { Router } from 'express';
import { cache, chatClient } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { toggleEventListener } from '../../services/twitchEventListenerServices.js';
import { toggleTikTokConnection } from '../../services/tikTokService.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json({ online: true });
    }
    catch (err) {
        logger.error(`Error in status: ${err}`);
    }
});

router.get('/:service', async (req, res) => {
    try {
        const service = req.params.service;
        const status = cache.get(`${service}Connected`);
        res.json({ connected: status });
    }
    catch (err) {
        logger.error(`Error in getting ${service} status: ${err}`);
    }
});

router.get('/tiktok', async (req, res) => {
    try {
        const status = cache.get('tiktokConnected');
        res.json({ connected: status });
    }
    catch (err) {
        logger.error(`Error in getting tiktok status: ${err}`);
    }
});

router.put('/twitch', async (req, res) => {
    try {
        await toggleEventListener();
        await chatClient.toggleConnection();
        res.json({ success: true });
    }
    catch (err) {
        logger.error(`Error in updating twitch status: ${err}`);
    }
});

router.put('/tiktok', async (req, res) => {
    try {
        console.log('tiktok status update');
        await toggleTikTokConnection();
        res.json({ success: true });
    }
    catch (err) {
        logger.error(`Error in updating tiktok status: ${err}`);
    }
});


export default router;