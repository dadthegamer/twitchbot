import { Router } from 'express';
import { interactionsDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import isStreamer from '../../middleware/loggedin.js';

const router = Router();


// Get all the sounds
router.get('/', async (req, res) => {
    try {
        const sounds = await interactionsDB.getAllSounds();
        res.json(sounds);
    }
    catch (err) {
        logger.error(`Error in GET /sounds: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a sound by name
router.get('/:name', async (req, res) => {
    try {
        const { name } = req.params;
        const sound = await interactionsDB.getSound(name);
        res.json(sound);
    }
    catch (err) {
        logger.error(`Error in GET /sounds/:name: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a sound
router.post('/', isStreamer, async (req, res) => {
    try {
        const { name, fileName } = req.body;
        const sound = await interactionsDB.createSound(name, fileName);
        res.json(sound);
    }
    catch (err) {
        logger.error(`Error in POST /sounds: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a sound
router.delete('/:name', isStreamer, async (req, res) => {
    try {
        const { name } = req.params;
        const sound = await interactionsDB.deleteSound(name);
        res.json(sound);
    }
    catch (err) {
        logger.error(`Error in DELETE /sounds/:name: ${err}`);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;