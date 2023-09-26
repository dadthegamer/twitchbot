import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { settingsDB } from '../../config/initializers.js';
import { checkForUpdates } from '../../services/updateService.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await settingsDB.getSetting('appVersion');
        const version = data.version;
        const update = await checkForUpdates(version);
        if (!update) {
            res.json({ update: false });
        } else {
            res.json({ update: update });
        }
    }
    catch (err) {
        logger('error', `Error in status: ${err}`);
    }
});


export default router;