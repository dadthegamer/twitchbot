import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { usersDB } from '../../config/initializers.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        let { type, amount } = req.body;
        if (typeof amount === 'string') {
            amount = parseInt(amount);
        }
        if (type === 'all') {
            const allViewers = await viewers.get('viewers');
            for (let i = 0; i < allViewers.length; i++) {
                await usersDB.increaseUserValue(allViewers[i].userId, 'leaderboard_points', amount);
            }
            res.status(200).send();
        } else if (type === 'user') {
            let { userId } = req.body;
            await usersDB.increaseUserValue(userId, 'leaderboard_points', amount);
            res.status(200).send();
        }
    }
    catch (err) {
        writeToLogFile('error', `Error in currency: ${err}`);
        res.status(500).send();
    }
});


export default router;
