import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import {textToSpeech} from '../../services/awsService.js';
import cors from 'cors';


const router = Router();
router.use(cors());

router.post('/', async (req, res) => {

    const { message } = req.body;

    try {
        const speech = await textToSpeech(message);

        // Get the AudioStream
        const audioStream = speech.AudioStream;

        res.setHeader('Content-Type', 'audio/mpeg');
        res.end(audioStream);
        writeToLogFile('info', `Speech generated for message: ${message}`);
    } catch (err) {
        writeToLogFile('error', `Error generating speech: ${err}`);
        res.status(500).send('Internal Server Error');
    }

});


export default router;