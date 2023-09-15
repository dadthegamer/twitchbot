import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { usersDB, currencyDB } from '../../config/initializers.js';

const router = Router();


router.get('/', async (req, res) => {
    try {
        const currencies = await currencyDB.getAllCurrencies();
        res.status(200).json(currencies);
    }
    catch (error) {
        writeToLogFile('error', `Error getting all currencies: ${error}`);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


export default router;
