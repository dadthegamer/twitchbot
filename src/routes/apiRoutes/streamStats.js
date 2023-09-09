import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { cache } from '../../config/initializers.js';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const game = cache.get('streamGame');
        const title = cache.get('streamTitle');
        const live = cache.get('live');
        const currentViewers = cache.get('currentViewers');
        const streamStartedAt = cache.get('streamStartedAt');
        const streamSubs = cache.get('streamSubs');
        const streamSubGoal = cache.get('streamSubGoal');
        const streamBits = cache.get('streamBits');
        const streamDonations = cache.get('streamDonations');
        const streamFollowers = cache.get('streamFollowers');
        const monthlySubs = cache.get('monthlySubs');
        const monthlySubGoal = cache.get('monthlySubGoal');
        const monthlyBits = cache.get('monthlyBits');
        const monthlyDonations = cache.get('monthlyDonations');
        const latestEvents = cache.get('latestEvents');
        const data = {
            streamInfo: {
                game,
                title,
                live,
                currentViewers,
                streamStartedAt,
                streamFollowers,
            },
            subInfo: {
                streamSubs,
                streamSubGoal,
                monthlySubs,
                monthlySubGoal,
            },
            bitsInfo: {
                streamBits,
                monthlyBits,
            },
            donationInfo: {
                streamDonations,
                monthlyDonations,
            },
            latestEvents,
        }
        res.json(data);
    }
    catch (err) {
        writeToLogFile('error', `Error in status: ${err}`);
    }
}
);


export default router;