import { Router } from 'express';
import { goalDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';
import isStreamer from '../../middleware/loggedin.js';



const router = Router();

router.get('/', async (req, res) => {
    try {
        const goals = await goalDB.getAllGoals();
        res.json(goals);
    } catch (err) {
        logger.error(err);
    }
});

router.put('/', isStreamer, async (req, res) => {
    try {
        let { goal, update } = req.body;
        switch (goal) {
            case 'Daily Sub Goal':
                goal = 'dailySubGoal';
                break;
            case 'Monthly Sub Goal':
                goal = 'monthlySubGoal';
                break;
            case 'Daily Donation Goal':
                goal = 'dailyDonationGoal';
                break;
            case 'Monthly Donation Goal':
                goal = 'monthlyDonationGoal';
                break;
            case 'Daily Follower Goal':
                goal = 'dailyFollowersGoal';
                break;
            case 'Monthly Follower Goal':
                goal = 'monthlyFollowersGoal';
                break;
            case 'Daily Bits Goal':
                goal = 'dailyBitsGoal';
                break;
            case 'Monthly Bits Goal':
                goal = 'monthlyBitsGoal';
                break;
        }
        // Get the key of the update object
        const updateKey = Object.keys(update)[0];
        if (updateKey === 'current') {
            await goalDB.setGoalCurrent(goal, Number(update.current));
            res.sendStatus(200);
        } else if (update.goal) {
            await goalDB.setGoal(goal, Number(update.goal));
            res.sendStatus(200);
        } else if (update.description) {
            if (update.description === '') {
                update.description = null;
            }
            await goalDB.setGoalDescription(goal, update.description);
            res.sendStatus(200);
        } else if (update.enabled === true || update.enabled === false) {
            await goalDB.setGoalEnabled(goal, update.enabled);
            res.sendStatus(200);
        }
    }
    catch (err) {
        logger.error(`Error updating goal: ${err}`);
        res.sendStatus(500).json({ error: err });
    }
});

export default router;