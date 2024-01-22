import { Router } from 'express';
import { interactionsDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import { isStreamer } from '../../middleware/loggedin.js';

const router = Router();


// Get all the bits boards
router.get('/', async (req, res) => {
    try {
        const bitsBoards = await interactionsDB.getBitsBoard();
        res.json(bitsBoards);
    }
    catch (err) {
        logger.error(`Error in GET /bitsboards: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a bits board item
router.post('/', isStreamer, async (req, res) => {
    try {
        const { name, cost, description, handlers } = req.body;
        const bitsBoard = await interactionsDB.createBitsBoardItem(name, cost, description, handlers);
        if (bitsBoard) {
            res.json({ message: 'Bits board item created' });
        } else {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
    catch (err) {
        logger.error(`Error in POST /bitsboards: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});