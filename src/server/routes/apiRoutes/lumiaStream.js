import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { getLumiaStreamCommands } from '../../services/lumiaStreamService.js';

const router = Router();

// Endpoint to get all lumia stream commands
router.get('/', async (req, res) => {
    try {
        const commands = await getLumiaStreamCommands();
        res.json(commands);
    }
    catch (err) {
        console.log('Error in getting all lumia stream commands from the api: ', err)
        logger.error(`Error in getting all lumia stream commands from the api: ${err}`);
    }
});


export default router;