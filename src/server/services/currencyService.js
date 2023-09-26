import { cache, usersDB } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';
import { getChattersWithoutBots } from '../handlers/twitch/viewTimeHandler.js';
import NodeCache from 'node-cache';
import { activeUsersCache } from '../config/initializers.js';
import logger from '../utilities/logger.js';
import { commands } from '../config/initializers.js';
import { ObjectId } from 'mongodb';

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
        await this.getAllCurrencies();
        await this.createFirstCurrency();
        await this.createRaffleCurrency();
        await this.currencyPayoutHandler();
    }

    // Method to restart the currency payout handler and reset the intervals
    async restartCurrencyPayoutHandler() {
        this.clearAllPayoutIntervals();
        await this.currencyPayoutHandler();
    }

    // Method to create the first currency if it doesn't exist
    async createFirstCurrency() {
        try {
            const res = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            if (res.length === 0) {
                const currency = {
                    name: 'points',
                    enabled: true,
                    payoutSettings: {
                        interval: 1,
                        amount: 1,
                        follower: 1,
                        subs: {
                            amount: 1,
                            minimum: 0,
                            tierMultiplier: false,
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
                        first: {
                            first: 1,
                            second: 1,
                            third: 1,
                        },
                        hypeTrain: 0,
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
                    autoReset: false,
                    limit: false,
                };
                await this.dbConnection.collection(this.collectionName).insertOne(currency);
                commands.createCommand('points', [{ type: 'chat', response: '$user you curreny have $currency.points points and rank $rank.points' }], 'Check how many points you have', 'everyone', true, 0, 0, false);
                return currency;
            }
        } catch (err) {
            logger.error(`Error in createFirstCurrency: ${err}`);
        }
    }

    // Method to create raffle currency if it doesn't exist
    async createRaffleCurrency() {
        try {
            const res = await this.getCurrencyByName('raffle');
            if (!res) {
                const currency = {
                    name: 'raffle',
                    enabled: true,
                    payoutSettings: {
                        interval: 1,
                        amount: 1,
                        follower: 1,
                        subs: {
                            amount: 1,
                            minimum: 0,
                            tierMultiplier: false,
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
                        first: {
                            first: 1,
                            second: 1,
                            third: 1,
                        },
                        hypeTrain: 0,
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
                    autoReset: false,
                    limit: false,
                };
                await this.dbConnection.collection(this.collectionName).insertOne(currency);
                await commands.createCommand('raffle', [{ type: 'chat', response: '$user you curreny have $currency.raffle tickets and rank $rank.raffle' }], 'Check how raffle tickets you have', 'everyone', true, 0, 0, false)
                return currency;
            }
        }
        catch (err) {
            logger.error(`Error in createRaffleCurrency: ${err}`);
        }
    }

    // Method to get a currency by name
    async getCurrencyByName(name) {
        name = name.toLowerCase();
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

    // Method to get a currency by id
    async getCurrencyById(id) {
        try {
            const currency = await this.dbConnection
                .collection(this.collectionName)
                .findOne({ _id: new ObjectId(id) }); // Convert id to ObjectId
            return currency;
        } catch (err) {
            logger.error(`Error in getCurrencyById: ${err}`);
            throw err; // Rethrow the error so it can be handled appropriately in the calling code
        }
    }

    // Method to update a currency by id
    async updateCurrencyById(id, currency) {
        try {
            const res = await this.dbConnection.collection(this.collectionName).updateOne({ _id: new ObjectId(id) }, { $set: currency });
            await this.getAllCurrencies();
            this.restartCurrencyPayoutHandler();
            return res;
        } catch (err) {
            logger.error(`Error in updateCurrencyById: ${err}`);
            throw err; // Rethrow the error so it can be handled appropriately in the calling code
        }
    }

    // Method to delete a currency
    async deleteCurrency(name) {
        name = name.toLowerCase();
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
    async createCurrency(name, enabled, payoutSettings, roleBonuses, restrictions, limit, autoReset) {
        name = name.toLowerCase();
        // If the currency already exists, return
        const currency = await this.getCurrencyByName(name);
        if (currency) {
            return 'Currency already exists';
        }
        try {
            const currency = {
                name: name,
                enabled: enabled,
                payoutSettings: {
                    interval: payoutSettings.interval,
                    amount: payoutSettings.amount,
                    follower: payoutSettings.follower,
                    subs: {
                        amount: payoutSettings.subs.amount,
                        minimum: payoutSettings.subs.minimum,
                        tierMultiplier: payoutSettings.subs.tierMultiplier,
                    },
                    bits: {
                        amount: payoutSettings.bits.amount,
                        minimum: payoutSettings.bits.minimum,
                    },
                    donations: {
                        amount: payoutSettings.donations.amount,
                        minimum: payoutSettings.donations.minimum,
                    },
                    raids: payoutSettings.raids,
                    arrived: payoutSettings.arrived,
                    first: {
                        first: payoutSettings.first.first,
                        second: payoutSettings.first.second,
                        third: payoutSettings.first.third,
                    },
                    hypeTrain: 0,
                },
                createdAt: new Date(),
                roleBonuses: {
                    moderator: roleBonuses.moderator,
                    subscriber: roleBonuses.subscriber,
                    vip: roleBonuses.vip,
                    activeChatUser: roleBonuses.activeChatUser,
                    tier1: roleBonuses.tier1,
                    tier2: roleBonuses.tier2,
                    tier3: roleBonuses.tier3,
                },
                restrictions: {
                    follower: restrictions.follower,
                    subscriber: restrictions.subscriber,
                    vip: restrictions.vip,
                    regular: restrictions.regular,
                    activeChatUser: restrictions.activeChatUser,
                    tier1: restrictions.tier1,
                    tier2: restrictions.tier2,
                    tier3: restrictions.tier3,
                },
                autoReset: autoReset,
                limit: limit,
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
        currencyName = currencyName.toLowerCase();
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
            const { name, payoutSettings, enabled, roleBonuses, restrictions, limit } = currency;
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
                    const viewers = this.cache.get('currentViewers');
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

                            // If the currency is not limited then add the total payout to the viewer
                            await usersDB.increaseCurrency(viewer.userId, name, totalPayout);
                        }
                    }
                }
            }, interval * 60000);

            this.payoutIntervals.push(intervalId);
        }
    }

    // Method to clear all payout intervals
    clearAllPayoutIntervals() {
        this.payoutIntervals.forEach(intervalId => clearInterval(intervalId));
        this.payoutIntervals = [];
    }

    // Method to add a currency to a user for subs
    async addCurrencyForSub(userId, subsAmount, tier) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { subs } = payoutSettings;
                    const { amount, minimum, tierMultiplier } = subs;
                    if (subsAmount >= minimum) {
                        if (tierMultiplier) {
                            await usersDB.increaseCurrency(userId, name, (amount * subsAmount * tier));
                        } else {
                            await usersDB.increaseCurrency(userId, name, (amount * subsAmount));
                        }
                    }
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForSub: ${err}`);
        }
    }

    // Method to add a currency to a user for bits
    async addCurrencyForBits(userId, bitsAmount) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { bits, hypeTrain } = payoutSettings;
                    const { amount, minimum } = bits;
                    if (bitsAmount >= minimum) {
                        await usersDB.increaseCurrency(userId, name, (amount * bitsAmount));
                    }
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForBits: ${err}`);
        }
    }

    // Method to add a currency to a user for donations
    async addCurrencyForDonations(userId, donationsAmount) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { donations } = payoutSettings;
                    const { amount, minimum } = donations;
                    if (donationsAmount >= minimum) {
                        await usersDB.increaseCurrency(userId, name, (amount * donationsAmount));
                    }
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

    // Method to add current for followers
    async addCurrencyForNewFollower(userId) {
        try {
            // Loop through all currencies and add the amount to the user
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { follower } = payoutSettings;
                    await usersDB.increaseCurrency(userId, name, follower);
                }
            }
        }
        catch (err) {
            logger.error(`Error in addCurrencyForNewFollower: ${err}`);
        }
    }

    // Method to add currency for being first in chat
    async addCurrencyForFirst(userId, position) {
        try {
            const currencies = this.cache.get('currencies');
            for (const currency of currencies) {
                const { name, payoutSettings, enabled } = currency;
                if (!enabled) {
                    continue;
                } else {
                    const { first } = payoutSettings;
                    if (position === 1) {
                        await usersDB.increaseCurrency(userId, name, first.first);
                    } else if (position === 2) {
                        await usersDB.increaseCurrency(userId, name, first.second);
                    } else if (position === 3) {
                        await usersDB.increaseCurrency(userId, name, first.third);
                    }
                }
            }
        }
        catch (err) {
            console.error(err);
            logger.error(`Error in addCurrencyForFirst: ${err}`);
        }
    }

    // Method to reward all viewers in chat with currency
    async rewardAllViewersWithCurrency(name, amount) {
        const currency = await this.getCurrencyByName(name);
        if (!currency) {
            return;
        }
        try {
            const viewers = await getChattersWithoutBots();
            for (const viewer of viewers) {
                await usersDB.increaseCurrency(viewer.userId, name, amount);
            }
        }
        catch (err) {
            logger.error(`Error in rewardAllViewersWithCurrency: ${err}`);
        }
    }

    // Method to reward all active chat users with currency
    async rewardAllActiveChatUsersWithCurrency(name, amount) {
        // Check to make sure the currency exists
        const currency = await this.getCurrencyByName(name);
        if (!currency) {
            return;
        }
        try {
            const activeUsers = await activeUsersCache.getAllActiveUsers();
            for (const user of activeUsers) {
                await usersDB.increaseCurrency(user.userId, name, amount);
            }
        }
        catch (err) {
            logger.error(`Error in rewardAllActiveChatUsersWithCurrency: ${err}`);
        }
    }

    // Method to reward all viewers in chat with currency for a hype train progress. Loop through all the currencies and add the amount to the viewers
    async rewardAllViewersWithCurrencyForHypeTrainProgress() {
        const currencies = this.cache.get('currencies');
        const currenViewers = this.cache.get('currentViewers');
        for (const currency of currencies) {
            const { name, payoutSettings, enabled } = currency;
            if (!enabled) {
                continue;
            } else {
                const { hypeTrain } = payoutSettings;
                for (const viewer of currenViewers) {
                    await usersDB.increaseCurrency(viewer.userId, name, hypeTrain);
                }
            }
        }
    }
}

export default CurrencyService;