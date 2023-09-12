import { writeToLogFile } from '../utilities/logging.js';


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
                }
            ]
            // Check if there are as many settings in the database as there are in the initial settings array
            const settings = await this.dbConnection.collection('settings').find().toArray();
            if (settings.length !== initialSettings.length) {
                // If not then set the initial settings if the name doesn't already exist
                initialSettings.forEach(async (setting) => {
                    const settingExists = await this.dbConnection.collection('settings').findOne({ name: setting.name });
                    if (!settingExists) {
                        await this.dbConnection.collection('settings').insertOne(setting);
                    }
                });
            }

            // Cache the settings
            const cachedSettings = await this.dbConnection.collection('settings').find().toArray();
            this.cache.set('applicationSettings', cachedSettings);
        } catch (error) {
            writeToLogFile('error', `Error setting initial settings: ${error}`);
        }
    }

    // Method to get all settings
    async getAllSettings() {
        try {
            const settings = await this.dbConnection.collection('settings').find().toArray();
            this.cache.set('applicationSettings', settings);
            return settings;
        } catch (error) {
            writeToLogFile('error', `Error getting all settings: ${error}`);
        }
    }

    // Method to get a specific setting
    async getSetting(name) {
        try {
            const setting = await this.dbConnection.collection('settings').findOne({ name: name });
            return setting;
        } catch (error) {
            writeToLogFile('error', `Error getting setting: ${error}`);
        }
    }

    // Method to update a specific setting
    async updateSetting(name, value) {
        try {
            const setting = await this.dbConnection.collection('settings').findOneAndUpdate({ name: name }, { $set: value }, { returnOriginal: false });
            await this.getAllSettings();
            return setting;
        } catch (error) {
            writeToLogFile('error', `Error updating setting: ${error}`);
        }
    }
}