import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { usersDB, currencyDB, leaderboardDB } from '../../config/initializers.js';
import { apiAuth } from '../../middleware/apiAuth.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const propertyKeys = [
            {
                baseKey: 'viewTime',
                leaderboards: [
                    {
                        name: 'All Time View Time',
                        period: 'allTime',
                        description: 'The top all time view time',
                    },
                    {
                        name: 'Yearly View Time',
                        period: 'yearly',
                        description: 'The top monthly view time',
                    },
                    {
                        name: 'Monthly View Time',
                        period: 'monthly',
                        description: 'The top monthly view time',
                    },
                    {
                        name: 'Weekly View Time',
                        period: 'weekly',
                        description: 'The top weekly view time',
                    },
                    {
                        name: 'Stream View Time',
                        period: 'stream',
                        description: 'The top weekly view time',
                    },
                ],
            },
            {
                baseKey: 'bits',
                leaderboards: [
                    {
                        name: 'All Time Bits',
                        period: 'allTime',
                        description: 'The top all time bits',
                    },
                    {
                        name: 'Yearly Bits',
                        period: 'yearly',
                        description: 'The top yearly bits',
                    },
                    {
                        name: 'Monthly Bits',
                        period: 'monthly',
                        description: 'The top monthly bits',
                    },
                    {
                        name: 'Weekly Bits',
                        period: 'weekly',
                        description: 'The top weekly bits',
                    },
                    {
                        name: 'Stream Bits',
                        period: 'stream',
                        description: 'The top weekly bits',
                    },
                ],
            },
            {
                baseKey: 'subs',
                leaderboards: [
                    {
                        name: 'All Time Subs',
                        period: 'allTime',
                        description: 'The top all time subs',
                    },
                    {
                        name: 'Yearly Subs',
                        period: 'yearly',
                        description: 'The top yearly subs',
                    },
                    {
                        name: 'Monthly Subs',
                        period: 'monthly',
                        description: 'The top monthly subs',
                    },
                    {
                        name: 'Weekly Subs',
                        period: 'weekly',
                        description: 'The top weekly subs',
                    },
                    {
                        name: 'Stream Subs',
                        period: 'stream',
                        description: 'The top weekly subs',
                    },
                ],
            },
            {
                baseKey: 'donations',
                leaderboards: [
                    {
                        name: 'All Time Donations',
                        period: 'allTime',
                        description: 'The top all time donations',
                    },
                    {
                        name: 'Yearly Donations',
                        period: 'yearly',
                        description: 'The top yearly donations',
                    },
                    {
                        name: 'Monthly Donations',
                        period: 'monthly',
                        description: 'The top monthly donations',
                    },
                    {
                        name: 'Weekly Donations',
                        period: 'weekly',
                        description: 'The top weekly donations',
                    },
                    {
                        name: 'Stream Donations',
                        period: 'stream',
                        description: 'The top weekly donations',
                    },
                ],
            },
        ];
        const leaderboards = [];
        await Promise.all(propertyKeys.map(async (propertyKey) => {
            const leaderboardData = await usersDB.getLeaderboardByProperty(propertyKey.baseKey);
            // Match the leaderboard to the period and description
            propertyKey.leaderboards.forEach((leaderboardKey) => {
                // Find the leaderboard that matches the period
                const matchedLeaderboard = leaderboardData.leaderboardData.find((leaderboard) => leaderboard.period === leaderboardKey.period);
                if (matchedLeaderboard) {
                    leaderboards.push({
                        name: leaderboardKey.name,
                        period: leaderboardKey.period,
                        description: leaderboardKey.description,
                        data: matchedLeaderboard.leaderboard,
                    });
                }
            });
        }));
        return res.status(200).json(leaderboards);
    }
    catch (err) {
        logger.error(`Error getting leaderboard: ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }}
);


export default router;
