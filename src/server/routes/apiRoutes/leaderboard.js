import { Router } from 'express';
import logger from '../../utilities/logger.js';
import { usersDB, currencyDB } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        let leaderboards = [];

        let leaderboard = [];
        const allTimeViewTime = await usersDB.getLeaderboardByViewTime('allTime');
        for (let i = 0; i < allTimeViewTime.length; i++) {
            const data = {
                displayName: allTimeViewTime[i].displayName,
                profilePic: allTimeViewTime[i].profilePictureUrl,
                amount: allTimeViewTime[i].viewTime.allTime,
            };
            leaderboard.push(data);
        }
        leaderboards.push({
            name: 'All Time View Time',
            description: 'The top all time view time',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const monthlyViewTime = await usersDB.getLeaderboardByViewTime('monthly');
        for (let i = 0; i < monthlyViewTime.length; i++) {
            const data = {
                displayName: monthlyViewTime[i].displayName,
                profilePic: monthlyViewTime[i].profilePictureUrl,
                amount: monthlyViewTime[i].viewTime.monthly,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Monthly View Time',
            description: 'The top monthly view time',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const weeklyViewTime = await usersDB.getLeaderboardByViewTime('weekly');
        for (let i = 0; i < weeklyViewTime.length; i++) {
            const data = {
                displayName: weeklyViewTime[i].displayName,
                profilePic: weeklyViewTime[i].profilePictureUrl,
                amount: weeklyViewTime[i].viewTime.weekly,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Weekly View Time',
            description: 'The top weekly view time',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const streamViewTime = await usersDB.getLeaderboardByViewTime('stream');
        for (let i = 0; i < streamViewTime.length; i++) {
            const data = {
                displayName: streamViewTime[i].displayName,
                profilePic: streamViewTime[i].profilePictureUrl,
                amount: streamViewTime[i].viewTime.stream,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Stream View Time',
            description: 'The top stream view time',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const allTimeSubs = await usersDB.getLeaderboardBySubs('allTime');
        for (let i = 0; i < allTimeSubs.length; i++) {
            const data = {
                displayName: allTimeSubs[i].displayName,
                profilePic: allTimeSubs[i].profilePictureUrl,
                amount: allTimeSubs[i].subs.allTime,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'All Time Subs',
            description: 'The top all time gifted subs',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const yearlySubs = await usersDB.getLeaderboardBySubs('yearly');
        for (let i = 0; i < yearlySubs.length; i++) {
            const data = {
                displayName: yearlySubs[i].displayName,
                profilePic: yearlySubs[i].profilePictureUrl,
                amount: yearlySubs[i].subs.yearly,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Yearly Subs',
            description: 'The top yearly gifted subs',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const monthlySubs = await usersDB.getLeaderboardBySubs('monthly');
        for (let i = 0; i < monthlySubs.length; i++) {
            const data = {
                displayName: monthlySubs[i].displayName,
                profilePic: monthlySubs[i].profilePictureUrl,
                amount: monthlySubs[i].subs.monthly,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Monthly Subs',
            description: 'The top monthly gifted subs',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const weeklySubs = await usersDB.getLeaderboardBySubs('weekly');
        if (weeklySubs !== null) {
            for (let i = 0; i < weeklySubs.length; i++) {
                const data = {
                    displayName: weeklySubs[i].displayName,
                    profilePic: weeklySubs[i].profilePictureUrl,
                    amount: weeklySubs[i].subs.weekly,
                };
                leaderboard.push(data);
            };
            leaderboards.push({
                name: 'Weekly Subs',
                description: 'The top weekly gifted subs',
                data: leaderboard,
            });
        } else {
            leaderboards.push({
                name: 'Weekly Subs',
                description: 'The top weekly gifted subs',
                data: [],
            });
        }
    
        leaderboard = [];
    
        const streamSubs = await usersDB.getLeaderboardBySubs('stream');
        if (streamSubs !== null) {
            for (let i = 0; i < streamSubs.length; i++) {
                const data = {
                    displayName: streamSubs[i].displayName,
                    profilePic: streamSubs[i].profilePictureUrl,
                    amount: streamSubs[i].subs.stream,
                };
                leaderboard.push(data);
            };
            leaderboards.push({
                name: 'Stream Subs',
                description: 'The top stream gifted subs',
                data: leaderboard,
            });
        } else {
            leaderboards.push({
                name: 'Stream Subs',
                description: 'The top stream gifted subs',
                data: [],
            });
        }
    
        leaderboard = [];
    
        const allTimeBits = await usersDB.getLeaderboardByBits('allTime');
        for (let i = 0; i < allTimeBits.length; i++) {
            const data = {
                displayName: allTimeBits[i].displayName,
                profilePic: allTimeBits[i].profilePictureUrl,
                amount: allTimeBits[i].bits.allTime,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'All Time Bits',
            description: 'The top all time bits',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const yearlyBits = await usersDB.getLeaderboardByBits('yearly');
        for (let i = 0; i < yearlyBits.length; i++) {
            const data = {
                displayName: yearlyBits[i].displayName,
                profilePic: yearlyBits[i].profilePictureUrl,
                amount: yearlyBits[i].bits.yearly,
            };
            leaderboard.push(data);
        };
        leaderboards.push({
            name: 'Yearly Bits',
            description: 'The top yearly bits',
            data: leaderboard,
        });
    
        leaderboard = [];
    
        const monthlyBits = await usersDB.getLeaderboardByBits('monthly');
        if (monthlyBits !== null) {
            for (let i = 0; i < monthlyBits.length; i++) {
                const data = {
                    displayName: monthlyBits[i].displayName,
                    profilePic: monthlyBits[i].profilePictureUrl,
                    amount: monthlyBits[i].bits.monthly,
                };
                leaderboard.push(data);
            };
            leaderboards.push({
                name: 'Monthly Bits',
                description: 'The top monthly bits',
                data: leaderboard,
            });
        } else {
            leaderboards.push({
                name: 'Monthly Bits',
                description: 'The top monthly bits',
                data: [],
            });
        }
    
        leaderboard = [];
    
        const weeklyBits = await usersDB.getLeaderboardByBits('weekly');
        if (weeklyBits !== null) {
            for (let i = 0; i < weeklyBits.length; i++) {
                const data = {
                    displayName: weeklyBits[i].displayName,
                    profilePic: weeklyBits[i].profilePictureUrl,
                    amount: weeklyBits[i].bits.weekly,
                };
                leaderboard.push(data);
            };
            leaderboards.push({
                name: 'Weekly Bits',
                description: 'The top weekly bits',
                data: leaderboard,
            });
        } else {
            leaderboards.push({
                name: 'Weekly Bits',
                description: 'The top weekly bits',
                data: [],
            });
        }
    
        leaderboard = [];
    
        const streamBits = await usersDB.getLeaderboardByBits('stream');
        if (streamBits !== null) {
            for (let i = 0; i < streamBits.length; i++) {
                const data = {
                    displayName: streamBits[i].displayName,
                    profilePic: streamBits[i].profilePictureUrl,
                    amount: streamBits[i].bits.stream,
                };
                leaderboard.push(data);
            };
            leaderboards.push({
                name: 'Stream Bits',
                description: 'The top stream bits',
                data: leaderboard,
            });
        } else {
            leaderboards.push({
                name: 'Stream Bits',
                description: 'The top stream bits',
                data: [],
            });
        }
    
        leaderboard = [];
    
        const currencies = await currencyDB.getAllCurrencies();
        for (let i = 0; i < currencies.length; i++) {
            if (currencies[i].enabled) {
                const currencyLeaderboard = await usersDB.getLeaderboardByCurrency(currencies[i].name);
                for (let j = 0; j < currencyLeaderboard.length; j++) {
                    const data = {
                        displayName: currencyLeaderboard[j].displayName,
                        profilePic: currencyLeaderboard[j].profilePictureUrl,
                        amount: currencyLeaderboard[j].currency[currencies[i].name],
                    };
                    leaderboard.push(data);
                };
                leaderboards.push({
                    name: currencies[i].name,
                    description: `The top ${currencies[i].name} earners`,
                    data: leaderboard,
                });
            }
        };
        res.status(200).json(leaderboards);
    }
    catch (err) {
        logger.error(`Error getting leaderboard: ${err}`);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
);


export default router;
