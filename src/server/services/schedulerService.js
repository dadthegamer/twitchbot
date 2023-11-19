import { twitchApi, cache, usersDB } from '../config/initializers.js';
import logger from "../utilities/logger.js";
import NodeCache from "node-cache";


export class SchedulerService {
    constructor(dbConnection) {
        this.dbConnection = dbConnection;
        this.knownBots = new NodeCache();
        this.initialize();
    }

    initialize() {
        try {
            this.getAllFollowers();
            this.getAllSubscribers();
            this.addBotsToKnownBots();
            this.getAllModerators();
            this.getBitsLeaderboard();
            this.getAllVips();
            this.getChattersInterval();
        }
        catch (error) {
            logger.error(`Error initializing SchedulerService: ${error}`);
            throw error;
        }
    }

    // Method to get all the viewers in the channel
    async getChattersInterval() {
        try {
            setInterval(async () => {
                const chatters = await twitchApi.getChatters();
                if (process.env.NODE_ENV !== 'development') {
                    const bots = knownBots.keys();
                    const chattersWithoutBots = chatters.filter((chatter) => !bots.includes(chatter.userId));
                    cache.set('currentViewers', chattersWithoutBots);
                    return chattersWithoutBots;
                } else {
                    cache.set('currentViewers', chatters);
                    return chatters;
                }
            }, 60000);
        }
        catch (err) {
            logger.error(`Error in getChattersWithoutBots: ${err}`);
        }
    }

    // Method to get the bits leaderboard
    async getBitsLeaderboard() {
        try {
            const leaderboard = await this.twitchAPI.getBitsLeaderboard();
            for (const user of leaderboard) {
                await usersDB.setBitsManually(user.userId, user.amount);
            }
            return leaderboard;
        }
        catch (error) {
            logger.error(`Error getting bits leaderboard: ${error}`);
        }
    }

    // Method to get all the followers for a channel and udpate the database
    async getAllFollowers() {
        try {
            const followers = await this.twitchAPI.getFollowers();
            for (const follower of followers) {
                await usersDB.addUserManually(follower.userId, follower.followDate);
            }
        }
        catch (error) {
            logger.error(`Error getting followers: ${error}`);
        }
    }

    // Method to get all the subscribers for a channel and update the database
    async getAllSubscribers() {
        try {
            const subscribers = await this.twitchAPI.getChannelSubscribers();
            for (const subscriber of subscribers) {
                await usersDB.addSubscriber(subscriber.userId);
            }
        }
        catch (error) {
            logger.error(`Error getting subscribers: ${error}`);
        }
    }

    // method to get all the VIP's for a channel and update the database
    async getAllVips() {
        try {
            const vips = await this.twitchAPI.getChannelVips();
            for (const vip of vips) {
                await usersDB.addVip(vip.id);
            }
        }
        catch (error) {
            logger.error(`Error getting VIP's: ${error}`);
        }
    }

    // Method to get all the moderators for a channel and update the database
    async getAllModerators() {
        try {
            const moderators = await this.twitchAPI.getChannelModerators();
            for (const moderator of moderators) {
                await usersDB.addModerator(moderator.userId);
            }
        }
        catch (error) {
            logger.error(`Error getting moderators: ${error}`);
        }
    }

    addBotsToKnownBots() {
        this.knownBots.set('671284746', {
            id: '671284746',
            username: 'thedadb0t',
            display_name: 'TheDadB0t',
        });
        this.knownBots.set('64431397', {
            id: '671284746',
            username: 'dadthegam3r',
            display_name: 'DadTheGam3r',
        });
        this.knownBots.set('447685927', {
            id: 447685927,
            username: 'playwithviewersbot',
            display_name: 'PlayWithViewersBot',
        });
        this.knownBots.set('25681094', {
            id: 25681094,
            username: 'commanderroot',
            display_name: 'CommanderRoot',
        })
        this.knownBots.set('605116711', {
            id: 605116711,
            username: 'lumiastream',
            display_name: 'LumiaStream',
        })
        this.knownBots.set('451658633', {
            id: 451658633,
            username: 'streamlootsbot',
            display_name: 'StreamlootsBot',
        })
        this.knownBots.set('196328541', {
            id: 196328541,
            username: 'lumiathingamabot',
            display_name: 'LumiaThingamaBot',
        })
        this.knownBots.set('406576975', {
            id: 406576975,
            username: 'anotherttvviewer',
            display_name: 'AnotherTTVViewer',
        })
        this.knownBots.set('191739645', {
            id: 191739645,
            username: '01ella',
            display_name: '01Ella',
        })
        this.knownBots.set('654447790', {
            id: '654447790',
            username: 'aliceydra',
            display_name: 'aliceydra'
        })
        this.knownBots.set('43547909', {
            id: '43547909',
            username: 'drapsnatt',
            userDisplayName: 'Drapsnatt'
        })
        this.knownBots.set('909524085', {
            id: '909524085',
            username: 'morgane2k7',
            display_name: 'Morgane2k7'
        })
        this.knownBots.set('100135110', {
            id: '100135110',
            username: 'streamelements',
            display_name: 'StreamElements'
        })
        this.knownBots.set('216527497', {
            id: '216527497',
            username: 'soundalerts',
            display_name: 'SoundAlerts'
        })
    }
};