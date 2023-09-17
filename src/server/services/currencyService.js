import { cache, usersDB } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';
import { getChattersWithoutBots } from '../handlers/twitch/viewTimeHandler.js';
import NodeCache from 'node-cache';
import { activeUsersCache } from '../config/initializers.js';
import logger from '../utilities/logger.js';

// Currency Class
class CurrencyService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.currencyCache = new NodeCache();
        this.collectionName = 'currency';
        this.payoutIntervals = [];
        this.initializeCurrencies();
    }

    // Method for initializing the currencies
    async initializeCurrencies() {
        this.clearAllPayoutIntervals();
        await this.createFirstCurrency();
        await this.createRaffleCurrency();
        await this.getAllCurrencies();
        await this.currencyPayoutHandler();
    }

    // Method to create the first currency if it doesn't exist
    async createFirstCurrency() {
        try {
            const res = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            if (res.length === 0) {
                const currency = {
                    name: 'Points',
                    enabled: true,
                    payoutSettings: {
                        interval: 1,
                        amount: 1,
                        subs: {
                            amount: 1,
                            minimum: 0,
                        },
                        bits: {
                            amount: 1,
                            minimum: 0,
                        },
                        donations: {
                            amount: 1,
                            minimum: 0,
                        },
                        raids: 1,
                        arrived: 1,
                    },
                    createdAt: new Date(),
                    roleBonuses: {
                        streamer: 0,
                        moderator: 0,
                        subscriber: 0,
                        vip: 0,
                        activeChatUser: 0,
                        tier1: 0,
                        tier2: 0,
                        tier3: 0,
                    },
                    restrictions: {
                        follower: false,
                        subscriber: false,
                        vip: false,
                        regular: false,
                        activeChatUser: false,
                        tier1: false,
                        tier2: false,
                        tier3: false,
                    },
                    limit: false,
                };
                await this.dbConnection.collection(this.collectionName).insertOne(currency);
                return currency;
            }
        } catch (err) {
            logger.error(`Error in createFirstCurrency: ${err}`);
        }
    }

    // Method to create raffle currency if it doesn't exist
    async createRaffleCurrency() {
        try {
            const res = await this.getCurrencyByName('Raffle');
            if (!res) {
                const currency = {
                    name: 'Raffle',
                    enabled: false,
                    payoutSettings: {
                        interval: 1,
                        amount: 1,
                        subs: {
                            amount: 1,
                            minimum: 0,
                        },
                        bits: {
                            amount: 1,
                            minimum: 0,
                        },
                        donations: {
                            amount: 1,
                            minimum: 0,
                        },
                        raids: 1,
                        arrived: 1,
                    },
                    hypeTrainBonus: false,
                    createdAt: new Date(),
                    roleBonuses: {
                        moderator: 0,
                        subscriber: 0,
                        vip: 0,
                        activeChatUser: 0,
                        tier1: 0,
                        tier2: 0,
                        tier3: 0,
                    },
                    restrictions: {
                        follower: false,
                        subscriber: false,
                        vip: false,
                        moderator: false,
                        activeChatUser: false,
                        tier1: false,
                        tier2: false,
                        tier3: false,
                    },
                    limit: false,
                };
                await this.dbConnection.collection(this.collectionName).insertOne(currency);
                return currency;
            }
        }
        catch (err) {
            logger.error(`Error in createRaffleCurrency: ${err}`);
        }
    }

    // Method to get a currency by name
    async getCurrencyByName(name) {
        try {
            const currency = await this.dbConnection.collection(this.collectionName).findOne({ name });
            return currency;
        } catch (err) {
            logger.error(`Error in getCurrencyByName: ${err}`);
        }
    }

    // Method to get all currencies
    async getAllCurrencies() {
        try {
            const currencies = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('currencies', currencies);
            return currencies;
        } catch (err) {
            logger.error(`Error in getAllCurrencies: ${err}`);
        }
    }

    // Method to update a currency
    async updateCurrency(name, currency) {
        try {
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ name }, { $set: currency });
            await getAllCurrencies();
            return res;
        } catch (err) {
            logger.error(`Error in updateCurrency: ${err}`);
        }
    }

    // Method to delete a currency
    async deleteCurrency(name) {
        if (name === 'Raffle') {
            return 'Cannot delete the raffle currency';
        }
        try {
            const res = await this.dbConnection.collection(this.collectionName).deleteOne({ name });
            await getAllCurrencies();
            return res;
        }
        catch (err) {
            logger.error(`Error in deleteCurrency: ${err}`);
        }
    }

    // Method to create a currency
    async createCurrency(name, enabled, payoutSettings, roleBonuses, limit) {
        // If the currency already exists, return
        const currency = await this.getCurrencyByName(name);
        if (currency) {
            return 'Currency already exists';
        }
        try {
            const currency = {
                name: 'Points',
                enabled: true,
                payoutSettings: {
                    interval: 1,
                    amount: 1,
                    subs: {
                        amount: 1,
                        minimum: 0,
                    },
                    bits: {
                        amount: 1,
                        minimum: 0,
                    },
                    donations: {
                        amount: 1,
                        minimum: 0,
                    },
                    raids: 1,
                    arrived: 1,
                },
                hypeTrainBonus: false,
                createdAt: new Date(),
                roleBonuses: {
                    moderator: 0,
                    subscriber: 0,
                    vip: 0,
                    activeChatUser: 0,
                    tier1: 0,
                    tier2: 0,
                    tier3: 0,
                },
                restrictions: {
                    follower: false,
                    subscriber: false,
                    vip: false,
                    moderator: false,
                    activeChatUser: false,
                    tier1: false,
                    tier2: false,
                    tier3: false,
                },
                limit: false,
            };
            const res = await this.dbConnection.collection(this.collectionName).insertOne(currency);
            await getAllCurrencies();
            return res;
        } catch (err) {
            logger.error(`Error in createCurrency: ${err}`);
        }
    }

    // Method to handle the restriction payout
    async restrictionPayoutHandler(userId, currencyName) {
        try {
            // Set the initial data
            const followersList = await usersDB.getFollowers();
            const subscribersList = await usersDB.getSubscribers();
            const vipsList = await usersDB.getVips();
            const moderatorsList = await usersDB.getModerators();
            const activeUsersList = await activeUsersCache.getAllUsers();
            // Get the currency
            const currency = this.cache.get('currencies').find((currency) => currency.name === currencyName);

            // Get the restriction values
            const { restrictions } = currency;
            const { follower, subscriber, vip, moderator, activeChatUser, tier1, tier2, tier3 } = restrictions;

            let roles = [];

            // For each of the restrictions check if the viewer is in the corresponding list. If they are then add them to the roles array
            if (follower) {
                if (followersList.includes(userId)) {
                    roles.push('follower');
                }
            }
            if (subscriber) {
                if (subscribersList.includes(userId)) {
                    roles.push('subscriber');
                }
            }
            if (vip) {
                if (vipsList.includes(userId)) {
                    roles.push('vip');
                }
            }

            if (moderator) {
                if (moderatorsList.includes(userId)) {
                    roles.push('moderator');
                }
            }

            if (activeChatUser) {
                if (activeUsersList.includes(userId)) {
                    roles.push('activeChatUser');
                }
            }

            return roles;
        }
        catch (err) {
            logger.error(`Error in restrictionPayoutHandler: ${err}`);
        }
    }

    // Method to handle the currency payout
    async currencyPayoutHandler() {
        for (const id of this.payoutIntervals) {
            clearInterval(id);
        }

        // Reset the intervals list
        this.payoutIntervals = [];
        const currencies = this.cache.get('currencies');
        if (currencies === undefined) {
            return;
        }
        if (currencies.length === 0) {
            return;
        }
        for (const currency of currencies) {
            const { name, payoutSettings, hypeTrainBonus, enabled, roleBonuses, restrictions, limit } = currency;
            // If the currency is not enabled then continue to the next currency
            if (!enabled) {
                continue;
            }
            const { interval, amount, subs, bits, donations, raids, arrived } = payoutSettings;
            if (interval === 0) {
                continue;
            }
            // Set an interval to payout the currency
            const intervalId = setInterval(async () => {
                if (environment === 'development') {
                    console.log(`Paying out ${amount} ${name} to all viewers`);
                    return;
                } else {
                    // Get the viewers
                    const viewers = await getChattersWithoutBots();
                    for (const viewer of viewers) {
                        // Check if the viewer is a follower, subscriber, vip, or moderator
                        const payout = await this.restrictionPayoutHandler(viewer.userId, name);
                        if (payout.length > 0) {
                            let bonus = 0
                            const { moderator, subscriber, vip, activeChatUser, tier1, tier2, tier3 } = roleBonuses;
                            // For each of the roles, check if the viewer has the role and add the bonus to the bonus variable
                            if (payout.includes('moderator')) {
                                bonus += moderator;
                            }
                            if (payout.includes('subscriber')) {
                                bonus += subscriber;
                            }
                            if (payout.includes('vip')) {
                                bonus += vip;
                            }
                            if (payout.includes('activeChatUser')) {
                                bonus += activeChatUser;
                            }
                            const totalPayout = amount + bonus;
                            // If the currency is limited then check if the viewer has reached the limit
                            if (limit) {
                                const currentAmount = await usersDB.getCurrency(viewer.userId, name);
                                if (currentAmount + totalPayout > limit) {
                                    // Set the amount to the limit
                                    await usersDB.setCurrency(viewer.userId, name, limit);
                                    continue;
                                }
                            }

                            if (hypeTrainBonus !== false) {
                                const hypeTrain = await cache.get('hypeTrain');
                                if (hypeTrain !== null) {
                                    bonus += hypeTrainBonus
                                }
                            }
                            // If the currency is not limited then add the total payout to the viewer
                            await usersDB.increaseCurrency(viewer.userId, name, totalPayout);
                        }
                    }
                }
            }, interval * 60000);

            this.payoutIntervals.push(intervalId);
        }
    }

    // Method to update a currency
    async updateCurrency(name, currency) {
        try {
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ name }, { $set: currency });
            await getAllCurrencies();
            this.clearAllPayoutIntervals();
            this.currencyPayoutHandler();
            return res;
        } catch (err) {
            logger.error(`Error in updateCurrency: ${err}`);
        }
    }

    // Method to clear all payout intervals
    clearAllPayoutIntervals() {
        this.payoutIntervals.forEach(intervalId => clearInterval(intervalId));
        this.payoutIntervals = [];
    }

    // Method to add a currency to a user for subs
    async addCurrencyForSub(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { subs } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, subs);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForSub: ${err}`);
        }
    }

    // Method to add a currency to a user for bits
    async addCurrencyForBits(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { bits } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, bits);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForBits: ${err}`);
        }
    }

    // Method to add a currency to a user for donations
    async addCurrencyForDonations(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { donations } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, donations);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForDonations: ${err}`);
        }
    }

    // Method to add a currency to a user for raids
    async addCurrencyForRaids(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { raids } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, raids);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForRaids: ${err}`);
        }
    }

    // Method to add a currency to a user for arriving
    async addCurrencyForArriving(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { arrived } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, arrived);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForArriving: ${err}`);
        }
    }
}

export default CurrencyService;