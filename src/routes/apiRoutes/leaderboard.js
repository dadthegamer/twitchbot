import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { usersDB } from '../../config/initializers.js';

const router = Router();

router.post('/', async (req, res) => {
    try {
        const { leaderboard, period, count } = req.body;
        if (count === undefined) {
            res.status(400).json({ message: 'Count is required' });
        }
        if (leaderboard === undefined) {
            res.status(400).json({ message: 'Leaderboard is required' });
        }
        if (period === undefined) {
            res.status(400).json({ message: 'Period is required' });
        }
        switch (leaderboard) {
            case 'subs':
                switch (period) {
                    case 'allTime':
                        const subsLeaderboard = await usersDB.getLeaderboardByProperty('all_time_subs', count);
                        res.json(subsLeaderboard);
                        break;
                    case 'monthly':
                        const subsMonthlyLeaderboard = await usersDB.getLeaderboardByProperty('monthly_subs', count);
                        res.json(subsMonthlyLeaderboard);
                        break;
                    case 'weekly':
                        const subsWeeklyLeaderboard = await usersDB.getLeaderboardByProperty('weekly_subs', count);
                        res.json(subsWeeklyLeaderboard);
                        break;
                    case 'stream':
                        const subsStreamLeaderboard = await usersDB.getLeaderboardByProperty('stream_subs', count);
                        res.json(subsStreamLeaderboard);
                        break;
                }
                break;
            case 'bits':
                switch (period) {
                    case 'allTime':
                        const bitsLeaderboard = await usersDB.getLeaderboardByProperty('all_time_bits', count);
                        res.json(bitsLeaderboard);
                        break;
                    case 'monthly':
                        const bitsMonthlyLeaderboard = await usersDB.getLeaderboardByProperty('monthly_bits', count);
                        res.json(bitsMonthlyLeaderboard);
                        break;
                    case 'weekly':
                        const bitsWeeklyLeaderboard = await usersDB.getLeaderboardByProperty('weekly_bits', count);
                        res.json(bitsWeeklyLeaderboard);
                        break;
                    case 'stream':
                        const bitsStreamLeaderboard = await usersDB.getLeaderboardByProperty('stream_bits', count);
                        res.json(bitsStreamLeaderboard);
                        break;
                }
                break;
            case 'viewtime':
                switch (period) {
                    case 'allTime':
                        const viewTimeLeaderboard = await usersDB.getLeaderboardByProperty('view_time', count);
                        res.json(viewTimeLeaderboard);
                        break;
                    case 'monthly':
                        const viewTimeMonthlyLeaderboard = await usersDB.getLeaderboardByProperty('monthly_view_time', count);
                        res.json(viewTimeMonthlyLeaderboard);
                        break;
                    case 'weekly':
                        const viewTimeWeeklyLeaderboard = await usersDB.getLeaderboardByProperty('weekly_view_time', count);
                        res.json(viewTimeWeeklyLeaderboard);
                        break;
                    case 'stream':
                        const viewTimeStreamLeaderboard = await usersDB.getLeaderboardByProperty('stream_view_time', count);
                        res.json(viewTimeStreamLeaderboard);
                        break;
                }
                break;
            case 'leaderboardPoints':
                const leaderboardPointsLeaderboard = await usersDB.getLeaderboardByProperty('leaderboard_points', count);
                res.json(leaderboardPointsLeaderboard);
                break;
            }
    }
    catch (err) {
        writeToLogFile('error', `Error in leaderboard getting leaderboard from api: ${err}`);
    }}
);

export default router;
