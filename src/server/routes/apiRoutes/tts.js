import { Router } from 'express';
import logger from '../../utilities/logger.js';
import {textToSpeech} from '../../services/awsService.js';
import { apiAuth } from '../../middleware/apiAuth.js';

const router = Router();


router.post('/', apiAuth, async (req, res) => {
    try {
        const { message } = req.body;
        const speech = await textToSpeech(message);
        // Get the AudioStream
        const audioStream = speech.AudioStream;
        if (!audioStream) {
            res.status(500).send('Internal Server Error');
        } else {
            res.setHeader('Content-Type', 'audio/mpeg');
            res.end(audioStream);
        }
    } catch (err) {
        if (err.message === 'TypeError: Cannot read properties of null') {
            return res.status(400).send('Bad Request');
        } else {
            logger.error(`Error in tts: ${err}`);
            res.status(500).send('Internal Server Error');
        }
    }

});


export default router;