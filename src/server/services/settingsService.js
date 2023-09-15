import logger from "../utilities/logger.js";


// Command Class
export class SettingsService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.setIntialSettings();
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
                }
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
}