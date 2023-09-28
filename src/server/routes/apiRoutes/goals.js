import { Router } from 'express';
import { goalDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const goals = await goalDB.getAllGoals();
        res.json(goals);
    } catch (err) {
        logger.error(err);
    }
});

router.put('/', async (req, res) => {
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
        console.log('goal:', goal)
        console.log('update:', update)

        if (update.current) {
            console.log('update.current:', update.current)
            await goalDB.setGoalCurrent(goal, Number(update.current));
            res.sendStatus(200).json({ message: 'Goal updated successfully' });
        } else if (update.goal) {
            await goalDB.setGoal(goal, Number(update.goal));
            res.sendStatus(200).json({ message: 'Goal updated successfully' });
        } else if (update.description) {
            if (update.description === '') {
                update.description = null;
            }
            await goalDB.setGoalDescription(goal, update.description);
            res.sendStatus(200).json({ message: 'Goal updated successfully' });
        } else if (update.enabled === true || update.enabled === false) {
            await goalDB.setGoalEnabled(goal, update.enabled);
            res.sendStatus(200).json({ message: 'Goal updated successfully' });
        }
    }
    catch (err) {
        logger.error(`Error updating goal: ${err}`);
        res.sendStatus(500).json({ error: err });
    }
});

export default router;