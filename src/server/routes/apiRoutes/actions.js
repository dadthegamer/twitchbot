import { Router } from 'express';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        res.json({ message: 'Hello from the api!' });
    }
    catch (err) {
        logger.error(`Error in getting all commands from the api: ${err}`);
    }
});
