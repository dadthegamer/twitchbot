import { Router } from 'express';
import { streamathonService } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const streamathon = await streamathonService.getStreamathonSettings();
        res.status(200).send(streamathon);
    }
    catch (err) {
        logger.error(`Error getting streamathon settings: ${err}`);
    }
});

// Route to update the streamathon settings
router.put('/', async (req, res) => {
    try {
        const { settings } = req.body;
        await streamathonService.updateStreamathonSettings(settings);
        res.status(200).json({ success: true });
    }
    catch (err) {
        console.log(err);
        logger.error(`Error updating streamathon settings: ${err}`);
    }
});


export default router;