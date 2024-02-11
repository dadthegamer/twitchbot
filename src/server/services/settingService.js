import logger from "../utilities/logger.js";
import { usersDB, currencyDB } from "../config/initializers.js";


// Command Class
class SettingsService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.setIntialSettings();
        this.getAllSettings();
    }

    // Method to set the initial database values for OBS settings
    async setIntialSettings() {
        try {
            const initialSettings = [
                {
                    name: 'obsSettings',
                    ip: null,
                    port: null,
                    password: null,
                },
                {
                    name: 'phillipsHueSettings',
                    ip: null,
                    port: null,
                    username: null,
                    lightId: null,
                },
                {
                    name: 'AWSSettings',
                    accessKeyId: null,
                    secretAccessKey: null,
                },
                {
                    name: 'alertTime',
                    time: 8000,
                },
                {
                    name: 'tikTokSettings',
                    username: null,
                },
                {
                    name: 'streamElementsSettings',
                    jwt: null,
                },
                {
                    name: 'chatLogSettings',
                    cacheThreshold: 100,
                    deleteAfter: 365,
                },
                {
                    name: 'commandPrefix',
                    prefix: '!d',
                },
                {
                    name: 'databaseSettings',
                    removeUsersAfter: 365,
                },
                {
                    name: 'rapidApikey',
                    key: null,
                },
                {
                    name: 'apiNinjaKey',
                    key: null,
                },
                {
                    name: 'OpenAIKey',
                    key: null,
                },
                {
                    name: 'appVersion',
                    version: '1.0.0-Alpha',
                },
                {
                    name: 'apikey',
                    key: null,
                },
                {
                    name: 'weeklyReset',
                    dateReset: null,
                    nextReset: null,
                },
                {
                    name: 'monthlyReset',
                    dateReset: null,
                    nextReset: null,
                },
            ]
            // Check if there are as many settings in the database as there are in the initial settings array as well as checking to make sure each key exists under each setting
            const settings = await this.dbConnection.collection('settings').find().toArray();
            if (settings.length !== initialSettings.length || settings.some(setting => !initialSettings.some(initialSetting => initialSetting.name === setting.name))) {
                // If there are not as many settings in the database as there are in the initial settings array, or if there are settings in the database that do not exist in the initial settings array, then delete all settings in the database and insert the initial settings
                await this.dbConnection.collection('settings').deleteMany({});
                await this.dbConnection.collection('settings').insertMany(initialSettings);
            }

            // Cache the settings
            const cachedSettings = await this.dbConnection.collection('settings').find().toArray();
            this.cache.set('applicationSettings', cachedSettings);
        } catch (error) {
            logger.error(`Error setting initial settings: ${error}`);
        }
    }

    // Method to get all settings
    async getAllSettings() {
        try {
            const settings = await this.dbConnection.collection('settings').find().toArray();
            this.cache.set('applicationSettings', settings);
            return settings;
        } catch (error) {
            logger.error(`Error getting all settings: ${error}`);
        }
    }

    // Method to get a specific setting
    async getSetting(name) {
        try {
            const setting = await this.dbConnection.collection('settings').findOne({ name: name });
            return setting;
        } catch (error) {
            logger.error(`Error getting setting: ${error}`);
        }
    }

    // Method to update a specific setting
    async updateSetting(name, value) {
        try {
            const setting = await this.dbConnection.collection('settings').findOneAndUpdate({ name: name }, { $set: value }, { returnOriginal: false });
            await this.getAllSettings();
            return setting;
        } catch (error) {
            logger.error(`Error updating setting: ${error}`);
        }
    }

    // Method to update the API key
    async updateApiKey(key) {
        try {
            const res = await this.dbConnection.collection('settings').findOneAndUpdate({ name: 'apikey' }, { $set: { key: key } }, { returnOriginal: false });
            await this.getAllSettings();
            return res;
        }
        catch (error) {
            logger.error(`Error updating API key: ${error}`);
        }
    }

    // Method to update the tiktok username
    async updateTikTokUsername(username) {
        try {
            const res = await this.dbConnection.collection('settings').findOneAndUpdate({ name: 'tikTokSettings' }, { $set: { username: username } }, { returnOriginal: false });
            await this.getAllSettings();
            return res;
        }
        catch (error) {
            logger.error(`Error updating TikTok username: ${error}`);
        }
    }

    // Method to set the date of the next weeekly reset. The date should be set to the next Sunday at 12:00 AM
    async setWeeklyResetDate() {
        try {
            // Get the current day
            const currentDay = new Date().getDate();
            // Get the current calendar day
            const currentCalendarDay = new Date().getDay();
            // Get the next reset date. It should always be the next Sunday at 12:00 AM in the format of a Date object
            let nextReset = new Date();
            // Set the next reset date to the next Sunday at 12:00 AM
            if (currentCalendarDay === 0) {
                nextReset.setDate(currentDay + 7);
            } else {
                nextReset.setDate(currentDay + (7 - currentCalendarDay));
            }
            nextReset.setHours(0, 0, 0, 0);
            // Update the reset date in the database
            await this.dbConnection.collection('settings').findOneAndUpdate({ name: 'weeklyReset' }, { $set: { dateReset: new Date(), nextReset: nextReset } });
            return nextReset;
        }
        catch (error) {
            logger.error(`Error setting weekly reset date: ${error}`);
        }
    }

    // Method to set the date of the next monthly reset. The date should be set to the next first of the month at 12:00 AM
    async setMonthlyResetDate() {
        try {
            // Get the next reset date. It should always be the next first of the month at 12:00 AM in the format of a Date object
            let nextReset = new Date();
            // Set the next reset date to the next first of the month at 12:00 AM
            nextReset.setDate(1);
            nextReset.setHours(0, 0, 0, 0);
            // Get the current month
            nextReset.getMonth() === 11 ? nextReset.setFullYear(nextReset.getFullYear() + 1, 0, 1) : nextReset.setMonth(nextReset.getMonth() + 1);
            // Update the reset date in the database
            await this.dbConnection.collection('settings').findOneAndUpdate({ name: 'monthlyReset' }, { $set: { dateReset: new Date(), nextReset: nextReset } });
            return nextReset;
        }
        catch (error) {
            logger.error(`Error setting monthly reset date: ${error}`);
        }
    }

    // Method to reset the weekly stats
    async resetWeeklyStats() {
        try {
            // Get the current reset status from the database
            const resetStatus = await this.dbConnection.collection('settings').findOne({ name: 'weeklyReset' });
            const nextReset = resetStatus.nextReset;
            // Get the current date
            const currentDate = new Date();
            if (currentDate >= nextReset) {
                logger.info('Weekly stats have been reset');
                this.setWeeklyResetDate();
                usersDB.resetWeeklyProperties();
                return;
            }
        }
        catch (error) {
            logger.error(`Error resetting weekly stats: ${error}`);
        }
    }
    
    // Method to reset the monthly stats
    async resetMonthlyStats() {
        try {
            // Get the current reset status from the database
            const resetStatus = await this.dbConnection.collection('settings').findOne({ name: 'monthlyReset' });
            const nextReset = resetStatus.nextReset;
            // Get the current date
            const currentDate = new Date();
            if (currentDate >= nextReset) {
                logger.info('Monthly stats have been reset');
                usersDB.resetMonthlyProperties();
                currencyDB.resetCurrencyIfAutoReset();
                this.setMonthlyResetDate();
                return;
            }
        }
        catch (error) {
            logger.error(`Error resetting monthly stats: ${error}`);
        }
    }
}

export default SettingsService;