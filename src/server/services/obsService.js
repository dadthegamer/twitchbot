import OBSWebSocket from 'obs-websocket-js';
import logger from '../utilities/logger.js';
import { settingsDB } from '../config/initializers.js';

// OBS Class
class OBSService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.obs = new OBSWebSocket();
        this.ip = null;
        this.port = null;
        this.password = null;
        this.getObsSettings();
        this.connected = false;
        this.inteverals = [];
        this.reconnectToObs();
    }

    // Method to get the OBS settings from the database
    async getObsSettings() {
        try {
            const obsSettings = await settingsDB.getSetting('obsSettings');
            this.ip = obsSettings.ip;
            this.port = obsSettings.port;
            this.password = obsSettings.password;
            return obsSettings;
        } catch (err) {
            logger.error(`Error in getObsSettings: ${err}`);
        }
    }

    // Method to connect to OBS
    async connectToObs() {
        try {
            // Check if the ip, port, and password are set
            if (!this.ip || !this.port || !this.password) {
                logger.error('OBS Settings not set. Please set OBS settings in the settings page.');
                return;
            }

            // Check if the password , ip, and port are strings. If not, set them to strings.
            if (typeof this.password !== 'string' || typeof this.ip !== 'string' || typeof this.port !== 'string') {
                this.password = this.password.toString();
                this.ip = this.ip.toString();
                this.port = this.port.toString();
            }
            await this.obs.connect(`ws://${this.ip}:${this.port}`, this.password);
            this.connected = true;

            // Clear the intervals
            this.inteverals.forEach(interval => clearInterval(interval));
            this.startEventListeners();
            this.getScenes();
            this.startRecording();
        }
        catch (err) {
            console.log(err);
            logger.error(`Error in connectToObs: ${err}`);
        }
    }

    // Method to start the event listeners
    async startEventListeners() {
        try {
            // Connection Closed
            this.obs.on('ConnectionClosed', async () => {
                console.log('OBS Connection Closed');
                this.connected = false;
            });

            // Connection Opened
            this.obs.on('ConnectionOpened', async () => {
                console.log('Connection Opened');
                this.connected = true;
            });

            this.obs.on('ConnectionError ', async (err) => {
                console.log('Connection Error');
                this.connected = false;
                logger.error(`Error in startEventListeners: ${err}`);
            });

            // Replay Buffer Saved
            this.obs.on('ReplayBufferSaved', async (event) => {
                console.log('Replay Saved');
            });

            // Recording Event Listener
            this.obs.on('RecordStateChanged', (event) => {
                if (event.outputState == 'OBS_WEBSOCKET_OUTPUT_STARTED') {
                    const fileName = path.basename(event.outputPath);
                } else if (event.outputState == 'OBS_WEBSOCKET_OUTPUT_STOPPED') {
                    console.log('Recording stopped');
                }
            });

            // Scene change event listener
            this.obs.on('CurrentProgramSceneChanged', async (event) => {
                console.log('Current scene changed to', event.sceneName)
            });

            // Scene list changed event listener
            this.obs.on('SceneListChanged', async (event) => {
                console.log('Scene list changed');
            });

            // Scene is created event listener
            this.obs.on('SceneCreated', async (event) => {
                console.log('Scene created');
            });
        }
        catch (err) {
            console.log(err);
            logger.error(`Error in startEventListeners: ${err}`);
        }
    }

    // Method to handle attempting to reconnect to OBS every 5 seconds. If the connection is successful, clear the intervals.
    async reconnectToObs() {
        try {
            const interval = setInterval(async () => {
                if (this.connected) {
                    this.inteverals.forEach(interval => clearInterval(interval));
                    return;
                } else {
                    await this.connectToObs();
                }
            }, 5000);
            this.inteverals.push(interval);
        }
        catch (err) {
            logger.error(`Error in reconnectToObs: ${err}`);
        }
    }

    // Method to start recording
    async startRecording() {
        try {
            await this.obs.call('StartRecord');
        } catch (error) {
            console.log(error);
            logger.error(`Error starting recording: ${error}`);
        }
    }

    // Method to set the current scene
    async setCurrentScene(sceneName) {
        try {
            await this.obs.call('SetCurrentProgramScene', {
                'sceneName': sceneName
            });
        } catch (error) {
            logger.error(`Error setting current scene: ${error}`);
        }
    }

    // Method to get the current scene
    async getCurrentScene() {
        try {
            const currentScene = await this.obs.call('GetCurrentProgramScene');
            return currentScene.name;
        } catch (error) {
            logger.error(`Error getting current scene: ${error}`);
        }
    }

    // Method to get all the scenes in OBS and store them in the cache
    async getScenes() {
        try {
            const scenes = await this.obs.call('GetSceneList');
            console.log(scenes);
            return scenes.scenes.map(scene => {
                return {
                    sceneName: scene.sceneName
                };
            });
        } catch (error) {
            logger.error(`Error getting OBS scenes: ${error}`);
        }
    }
}

export default OBSService;