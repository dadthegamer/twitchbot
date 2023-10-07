import { Router } from 'express';
import logger from '../../utilities/logger.js';
import {textToSpeech} from '../../services/awsService.js';
import cors from 'cors';


const router = Router();
router.use(cors());

router.get('/:message', async (req, res) => {
    try {
        const { message } = req.params;
        const speech = await textToSpeech(message);
        const audioStream = speech.AudioStream;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.end(audioStream);
    } catch (err) {
        console.log('Error generating speech:', err);
        logger.error(`Error generating speech: ${err}`);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const speech = await textToSpeech(message);
        // Get the AudioStream
        const audioStream = speech.AudioStream;
        res.setHeader('Content-Type', 'audio/mpeg');
        res.end(audioStream);
    } catch (err) {
        console.log('Error generating speech:', err);
        logger.error(`Error generating speech: ${err}`);
        res.status(500).send('Internal Server Error');
    }

});


export default router;