import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { usersDB, currencyDB } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    let leaderboards = [];
    const allTimeViewTime = await usersDB.getLeaderboardByViewTime('allTime');
    const monthlyViewTime = await usersDB.getLeaderboardByViewTime('monthly');
    const weeklyViewTime = await usersDB.getLeaderboardByViewTime('weekly');
    const streamViewTime = await usersDB.getLeaderboardByViewTime('stream');

    const currencies = await currencyDB.getAllCurrencies();

    // Add all time view time to leaderboards
    leaderboards.push({
        name: 'All Time View Time',
        data: allTimeViewTime,
    });

    // Add monthly view time to leaderboards
    leaderboards.push({
        name: 'Monthly View Time',
        data: monthlyViewTime,
    });

    // Add weekly view time to leaderboards
    leaderboards.push({
        name: 'Weekly View Time',
        data: weeklyViewTime,
    });

    // Add stream view time to leaderboards
    leaderboards.push({
        name: 'Stream View Time',
        data: streamViewTime,
    });

    res.json(leaderboards);
}
);


export default router;
