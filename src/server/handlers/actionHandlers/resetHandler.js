import logger from '../../utilities/logger.js';
import { usersDB, goalDB } from '../../config/initializers.js';


// Function to reset weekly stats
export async function resetWeek() {
    try {
        await usersDB.resetWeeklyProperties();
    }
    catch (err) {
        logger.error(err);
    }
}

// Function to reset the month stats
export async function resetMonth() {
    try {
        await usersDB.resetMonthlyProperties();
        await goalDB.setGoal('monthlySubGoal', 0);
        logger.info('Month stats reset');
    }
    catch (err) {
        logger.error(err);
    }
}


// Function to reset the year stats
export async function resetYear() {
    try {
        await usersDB.resetYearlyProperties();
        logger.info('Year stats reset');
    }
    catch (err) {
        logger.error(err);
    }
}