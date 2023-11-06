import { Router } from 'express';
import { cache, settingsDB } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    const tiktokData = await cache.get('tiktok');
    res.json(tiktokData);
});