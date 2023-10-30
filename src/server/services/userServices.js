import logger from "../utilities/logger.js";
import { twitchApi } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';


// User class 
class UsersDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'users';
        this.getAllUsers();
    }

    // Method to return all users
    async getAllUsers() {
        try {
            let users = this.cache.get('users');
            if (users) {
                return users;
            } else {
                users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
                this.cache.set('users', users);
                return users;
            }
        }
        catch (error) {
            logger.error(`Error in getAllUsers: ${error}`);
            return null;
        }
    }

    // Get all users that have have a followDate and set the followers property in the cache
    async getFollowers() {
        try {
            const users = await this.getAllUsers();
            const followers = users.filter((user) => user.followDate !== null);
            this.cache.set('followers', followers);
            return followers;
        }
        catch (error) {
            logger.error(`Error in getFollowers: ${error}`);
            return null;
        }
    }

    // Method to get all users that are vip in and set the vips property in the cache
    async getVips() {
        try {
            const users = await this.getAllUsers();
            const vips = users.filter((user) => user.roles.vip === true);
            this.cache.set('vips', vips);
            return vips;
        }
        catch (error) {
            logger.error(`Error in getVips in users class: ${error}`);
            return null;
        }
    }

    // Method to get all users that are subscribers and set the subscribers property in the cache
    async getSubscribers() {
        try {
            const users = await this.getAllUsers();
            const subscribers = users.filter((user) => user.roles.subscriber === true);
            this.cache.set('subscribers', subscribers);
            return subscribers;
        }
        catch (error) {
            logger.error(`Error in getSubscribers in users class: ${error}`);
            return null;
        }
    }

    // Method to get all users that have moderators set to true and set the moderators property in the cache
    async getModerators() {
        try {
            const users = await this.getAllUsers();
            const moderators = users.filter((user) => user.roles.moderator === true);
            this.cache.set('moderators', moderators);
            return moderators;
        }
        catch (error) {
            logger.error(`Error in getModerators in users class: ${error}`);
            return null;
        }
    }

    // Method to add a user to the moderator role
    async addModerator(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.getUserByUserId(userId);
            user.roles.moderator = true;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: { 'roles.moderator': true } },
                { upsert: true }
            );
            this.cache.set(userId, user);
        }
        catch (error) {
            logger.error(`Error in addModerator in users class: ${error}`);
        }
    }

    // Method to add a user to the subscriber role
    async addSubscriber(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.getUserByUserId(userId);
            user.roles.subscriber = true;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: { 'roles.subscriber': true } },
                { upsert: true }
            );
            this.cache.set(userId, user);
        }
        catch (error) {
            logger.error(`Error in addSubscriber in users class: ${error}`);
        }
    }

    // Method to add a user to the vip role
    async addVip(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.getUserByUserId(userId);
            user.roles.vip = true;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: { 'roles.vip': true } },
                { upsert: true }
            );
            this.cache.set(userId, user);
        }
        catch (error) {
            logger.error(`Error in addVip in users class: ${error}`);
        }
    }

    // Method to get all the users who are assigned a custom role and set the customRoles property in the cache
    async getCustomRoles() {
        try {
            const users = await this.getAllUsers();
            const customRoles = users.filter((user) => Object.keys(user.customRoles).length !== 0);
            this.cache.set('customRoles', customRoles);
            return customRoles;
        }
        catch (error) {
            logger.error(`Error in getCustomRoles in users class: ${error}`);
            return null;
        }
    }

    // Method to add a user to a custom role
    async addUserToCustomRole(userId, customRole) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if the user exists in the database. If they do not then add them to the database
            const userExists = this.getUserByUserId(userId);
            if (!userExists) {
                this.newUser(userId);
            };
            const user = await this.getUserByUserId(userId);
            user.roles.custom[customRole] = true;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: { [`roles.custom.${customRole}`]: true } },
                { upsert: true }
            );
            this.cache.set(userId, user);
        }
        catch (error) {
            logger.error(`Error in addUserToCustomRole in users class: ${error}`);
        }
    }

    // Method to remove a user from a custom role
    async removeUserFromCustomRole(userId, customRole) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if the user exists in the database. If they do not then add them to the database
            const userExists = this.getUserByUserId(userId);
            if (!userExists) {
                this.newUser(userId);
            };
            const user = await this.getUserByUserId(userId);
            delete user.roles.custom[customRole];
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $unset: { [`roles.custom.${customRole}`]: "" } },
                { upsert: true }
            );
            this.cache.set(userId, user);
        }
        catch (error) {
            logger.error(`Error in removeUserFromCustomRole in users class: ${error}`);
        }
    }

    // Method to return rather a user is a follower or not from the cache
    async isFollower(userId) {
        try {
            if (userId === undefined) {
                return false;
            }
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const users = this.cache.get('users');
            if (users) {
                const user = users.find((user) => user.id === userId);
                if (user.followDate !== null) {
                    return true;
                } else {
                    return false;
                }
            } else {
                const user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                if (user.followDate !== null) {
                    return true;
                } else {
                    return false;
                }
            }
        }
        catch (error) {
            logger.error(`Error in isFollower: ${error}`);
            return null;
        }
    }

    // Method to return user data
    async getUserByUserId(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            let user = this.cache.get(userId);
            if (user) {
                return user;
            } else {
                user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                if (user === null) {
                    await this.newUser(userId);
                    user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                }
                this.cache.set(userId, user);
                return user;
            }
        }
        catch (error) {
            logger.error(`Error in getUserByUserId: ${error}`);
            return null;
        }
    }

    // Method to update a user by their userId
    async updateUserByUserId(userId, update) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: update },
                { upsert: true }
            );
            const user = await this.getUserByUserId(userId);
            this.cache.set(userId, update);
            return user;
        }
        catch (error) {
            logger.error(`Error in updateUserByUserId: ${error}`);
            return null;
        }
    }

    // Method to return the user profile image url. If it is null then grab it from the Twitch API and update the database
    async getUserProfileImageUrl(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            let user = this.cache.get(userId);
            if (user) {
                if (user.profilePictureUrl === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.setUserValue(userId, 'profilePictureUrl', twitchUser.profilePictureUrl);
                    user = await this.getUserByUserId(userId);
                }
                return user.profilePictureUrl;
            } else {
                user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                if (user === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.newFollower(twitchUser);
                    user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                }
                if (user.profilePictureUrl === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.setUserValue(userId, 'profilePictureUrl', twitchUser.profilePictureUrl);
                    user = await this.getUserByUserId(userId);
                }
                this.cache.set(userId, user);
                return user.profilePictureUrl;
            }
        }
        catch (error) {
            logger.error(`Error in getUserProfileImageUrl: ${error}`);
            return undefined;
        }
    }

    // Method to add a user to the database and cache from t he stream directly
    async newUser(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
            if (user) {
                return;
            }
            const userData = await twitchApi.getUserDataById(userId);
            const date = new Date();
            const query = { id: userId };
            const update = {
                $set: {
                    id: userId,
                    displayName: userData.displayName,
                    userName: userData.name,
                    profilePictureUrl: userData.profilePictureUrl,
                    broadcasterType: userData.broadcasterType,
                    followDate: date,
                    lastSeen: date,
                    arrived: true,
                    viewTime: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    roles: {
                        vip: false,
                        subscriber: false,
                        moderator: false,
                        custom: {},
                    },
                    subs: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    bits: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    donations: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    currency: {
                        points: 0,
                    },
                    lastSeen: date,
                    metaData: []
                }
            };
            const options = { upsert: true };
            const res = await this.dbConnection.collection(this.collectionName).findOneAndUpdate(query, update, options);
            this.cache.set(userData.id, userData);
            return res.value;
        }
        catch (error) {
            logger.error(`Error in newFollower: ${error}`);
        }
    }

    async addUserManually(userId, followDate) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if the user is already in the database. If they are then return
            const user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
            if (user) {
                return;
            }
            const userData = await twitchApi.getUserDataById(userId);
            const date = new Date();
            const query = { id: userId };
            const update = {
                $set: {
                    id: userId,
                    displayName: userData.displayName,
                    userName: userData.name,
                    profilePictureUrl: userData.profilePictureUrl,
                    broadcasterType: userData.broadcasterType,
                    followDate: followDate,
                    arrived: false,
                    viewTime: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    roles: {
                        vip: false,
                        subscriber: false,
                        moderator: false,
                        custom: {},
                    },
                    subs: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    bits: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    donations: {
                        allTime: 0,
                        yearly: 0,
                        monthly: 0,
                        weekly: 0,
                        stream: 0
                    },
                    currency: {
                        points: 0,
                    },
                    lastSeen: date,
                    metaData: []
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection(this.collectionName).findOneAndUpdate(query, update, options);
            this.cache.set(userId, userData);
        }
        catch (error) {
            logger.error(`Error in newFollower: ${error}`);
        }
    }

    // Method to set a users value in the database and cache
    async setUserValue(userId, property, value) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            if (environment === 'development') {
                console.log(`setUserValue: ${userId} ${property} ${value}`);
                return;
            } else {
                // Set the property for the user in the cache
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                user[property] = value;
                this.cache.set(userId, user);
                // Set the property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    { $set: { [property]: value } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in setUserValue: ${error}`);
        }
    }

    // Method to increase a currency property for a user
    async increaseCurrency(userId, currency, amount) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in increaseCurrency: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in increaseCurrency: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`increaseUserValue: ${userId} ${currency} ${amount}`);
                return;
            } else {
                // Increase the currency property for the user in the cache
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                if (currency in user.currency) {
                    user.currency[currency] += amount;
                } else {
                    user.currency[currency] = amount;
                }
                this.cache.set(userId, user);
                // Increase the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    // Increase the currency name within the currency object to the amount
                    { $inc: { [`currency.${currency}`]: amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            console.log(`Error in increaseCurrency: ${error}`);
            logger.error(`Error in increaseCurrency: ${error}`);
        }
    }

    // Method to increase a currency property for a a list of users
    async increaseCurrencyForUsers(userIds, currency, amount) {
        try {
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in increaseCurrencyForUsers: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in increaseCurrencyForUsers: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`increaseCurrencyForUsers: ${userIds} ${currency} ${amount}`);
                return;
            } else {
                // Increase the currency property for the user in the cache
                let users = this.cache.get('users');
                if (!users) {
                    users = await this.getAllUsers();
                }
                for (const userId of userIds) {
                    const user = users.find((user) => user.id === userId);
                    if (currency in user.currency) {
                        user.currency[currency] += amount;
                    } else {
                        user.currency[currency] = amount;
                    }
                    this.cache.set(userId, user);
                }
                // Increase the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateMany(
                    { id: { $in: userIds } },
                    // Increase the currency name within the currency object to the amount
                    { $inc: { [`currency.${currency}`]: amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in increaseCurrencyForUsers: ${error}`);
        }
    }

    // Method to decrease a currency property for a user
    async decreaseCurrency(userId, currency, amount) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in decreaseCurrency: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in decreaseCurrency: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`decreaseCurrency: ${userId} ${currency} ${amount}`);
                return;
            } else {
                // Decrease the currency property for the user in the cache
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                if (currency in user.currency) {
                    user.currency[currency] -= amount;
                } else {
                    user.currency[currency] = amount;
                }
                this.cache.set(userId, user);
                // Decrease the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    // Decrease the currency name within the currency object to the amount
                    { $inc: { [`currency.${currency}`]: -amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in decreaseCurrency: ${error}`);
        }
    }

    // Method to set a currency property for a user
    async setCurrency(userId, currency, amount) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in setCurrency: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in setCurrency: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`setCurrency: ${userId} ${currency} ${amount}`);
                return;
            } else {
                // Set the currency property for the user in the cache
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                user.currency[currency] = amount;
                this.cache.set(userId, user);
                // Set the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    // Set the currency name within the currency object to the amount
                    { $set: { [`currency.${currency}`]: amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in setCurrency: ${error}`);
        }
    }

    // Method to get a currency property for a user
    async getCurrency(userId, currency) {
        try {
            // Get the currency property for the user in the cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            // Get the currency property for the user in the database
            const result = await this.dbConnection.collection(this.collectionName).findOne(
                { id: userId },
                { projection: { [`currency.${currency}`]: 1 } }
            );
            return result.currency[currency];
        } catch (error) {
            logger.error(`Error in getCurrency: ${error}`);
            return undefined;
        }
    }

    // Method to get all the users who have a currency property of at least 1. For each of the currency the user has add the user to an array. Return the array
    async getUsersWithCurrency(currency) {
        try {
            const users = await this.getAllUsers();
            const usersWithCurrency = users.filter((user) => user.currency[currency] >= 1);
            // For each of the users with the currency, add the userid to an array the amount of times they have the currency
            const userIds = [];
            for (const user of usersWithCurrency) {
                for (let i = 0; i < user.currency[currency]; i++) {
                    userIds.push(user.id);
                }
            }
            return userIds;
        } catch (error) {
            logger.error(`Error in getUsersWithCurrency: ${error}`);
        }
    }

    // Method to set the arrived property for a user
    async setArrived(userId, arrived) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if arrived is a boolean
            if (typeof arrived !== 'boolean') {
                try {
                    arrived = JSON.parse(arrived);
                    if (typeof arrived !== 'boolean') {
                        logger.error(`Error in setArrived: Arrived is not a boolean`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in setArrived: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`setArrived: ${userId} ${arrived}`);
                return;
            } else {
                // Set the arrived property for the user in the cache
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                user.arrived = arrived;
                this.cache.set(userId, user);
                // Set the arrived property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    { $set: { arrived: arrived } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in setArrived: ${error}`);
        }
    }

    // Method to get the rank of a user by a property in the currency object
    async getUserRankByCurrencyProperty(userId, property) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Get the currency property for the user in the cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            const users = await this.getAllUsers();
            const sortedUsers = users.sort((a, b) => b.currency[property] - a.currency[property]);
            const rank = sortedUsers.findIndex((user) => user.id === userId) + 1;
            return rank;
        } catch (error) {
            logger.error(`Error in getUserRankByProperty: ${error}`);
        }
    }

    // Method to get the leaderboard for a currency property sorted by the property from highest to lowest
    async getLeaderboardByCurrency(currency, count = 10) {
        try {    
            const collection = await this.dbConnection.collection(this.collectionName);
    
            // Construct the sort object dynamically
            const sortObj = {};
            sortObj[`currency.${currency}`] = -1;
    
            const result = await collection
                .find({})
                .sort(sortObj)
                .limit(count)
                .toArray();
    
            return result;
        } catch (error) {
            logger.error(`Error in getLeaderboardByProperty: ${error}`);
        }
    }

    // Method to get the leaderboard for the top users in view time
    async getLeaderboardByViewTime(leaderboardType, count = 10) {
        try {
            // Validate the leaderboard type
            if (!['allTime', 'yearly', 'monthly', 'weekly', 'stream'].includes(leaderboardType)) {
                logger.error(`Error in getLeaderboardByViewTime: Invalid leaderboard type`);
                return null;
            }
    
            const collection = await this.dbConnection.collection(this.collectionName);
    
            // Construct the sort object dynamically
            const sortObj = {};
            sortObj[`viewTime.${leaderboardType}`] = -1;
    
            const result = await collection
                .find({})
                .sort(sortObj)
                .limit(count)
                .toArray();
    
            return result;
        } catch (error) {
            logger.error(`Error in getLeaderboardByViewTime: ${error}`);
            return null; // Handle the error gracefully
        }
    }
    


    // Method to get the leaderboard for subs
    async getLeaderboardBySubs(leaderboardType, count = 10) {
        try {
            // Validate the leaderboard type
            if (!['allTime', 'yearly', 'monthly', 'weekly', 'stream'].includes(leaderboardType)) {
                logger.error(`Error in getLeaderboardByViewTime: Invalid leaderboard type`);
                return null;
            }
    
            const collection = await this.dbConnection.collection(this.collectionName);
    
            // Construct the sort object dynamically
            const sortObj = {};
            sortObj[`subs.${leaderboardType}`] = -1;
    
            const result = await collection
                .find({})
                .sort(sortObj)
                .limit(count)
                .toArray();
    
            return result;
        } catch (error) {
            logger.error(`Error in getLeaderboardByViewTime: ${error}`);
            return null; // Handle the error gracefully
        }
}

    // Method to get the leaderboard for bits
    async getLeaderboardByBits(leaderboardType, count = 10) {
        try {
            // Validate the leaderboard type
            if (!['allTime', 'yearly', 'monthly', 'weekly', 'stream'].includes(leaderboardType)) {
                logger.error(`Error in getLeaderboardByBits: Invalid leaderboard type`);
                return null;
            }
    
            const collection = await this.dbConnection.collection(this.collectionName);
    
            // Construct the sort object dynamically
            const sortObj = {};
            sortObj[`bits.${leaderboardType}`] = -1;
    
            const result = await collection
                .find({})
                .sort(sortObj)
                .limit(count)
                .toArray();
    
            return result;
        } catch (error) {
            logger.error(`Error in getLeaderboardByBits: ${error}`);
            return null; // Handle the error gracefully
        }
}

    // Method to reset a currency property for all users to 0
    async resetCurrency(property) {
    try {
        const result = await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            { $set: { [`currency.${property}`]: 0 } }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
        return result;
    } catch (error) {
        logger.error(`Error in resetProperty: ${error}`);
    }
}

    // Method to delete a currency from the currency object for all users
    async deleteCurrency(property) {
    try {
        const result = await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            { $unset: { [`currency.${property}`]: "" } }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
        return result;
    } catch (error) {
        logger.error(`Error in deleteCurrency: ${error}`);
    }
}

    // Method to reset the arrived property for all users to false in the database and cache
    async resetArrived() {
    try {
        const result = await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            { $set: { arrived: false } }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
        return result;
    } catch (error) {
        logger.error(`Error in resetArrived: ${error}`);
    }
}

    // Method to reset all stream related properties for all users to 0
    async resetStreamProperties() {
    try {
        await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            {
                $set: {
                    viewTime: {
                        stream: 0
                    },
                    subs: {
                        stream: 0
                    },
                    bits: {
                        stream: 0
                    },
                    donations: {
                        stream: 0
                    }
                }
            }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
    } catch (error) {
        logger.error(`Error in resetStreamProperties: ${error}`);
    }
}


    // Method to reset all weekly related properties for all users to 0
    async resetWeeklyProperties() {
    try {
        await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            {
                $set: {
                    viewTime: {
                        weekly: 0
                    },
                    subs: {
                        weekly: 0
                    },
                    bits: {
                        weekly: 0
                    },
                    donations: {
                        weekly: 0
                    }
                }
            }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
    }
    catch (error) {
        logger.error(`Error in resetWeeklyProperties: ${error}`);
    }
}

    // Method to reset all monthly properties for all users to 0
    async resetMonthlyProperties() {
    try {
        await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            {
                $set: {
                    viewTime: {
                        monthly: 0
                    },
                    subs: {
                        monthly: 0
                    },
                    bits: {
                        monthly: 0
                    },
                    donations: {
                        monthly: 0
                    }
                }
            }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
    }
    catch (error) {
        logger.error(`Error in resetMonthlyProperties: ${error}`);
    }
}

    // Method to reset all yearly properties for all users to 0
    async resetYearlyProperties() {
    try {
        await this.dbConnection.collection(this.collectionName).updateMany(
            {},
            {
                $set: {
                    viewTime: {
                        yearly: 0
                    },
                    subs: {
                        yearly: 0
                    },
                    bits: {
                        yearly: 0
                    },
                    donations: {
                        yearly: 0
                    }
                }
            }
        );
        const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
        this.cache.set('users', users);
    }
    catch (error) {
        logger.error(`Error in resetYearlyProperties: ${error}`);
    }
}

    // Method to set a viewtime property for a user
    async setViewTime(userId, property, amount) {
    try {
        // Check if the propery is in the viewTime object
        const viewTimeProperties = ['allTime', 'yearly', 'monthly', 'weekly', 'stream'];
        if (!viewTimeProperties.includes(property)) {
            console.log(`Error in setViewTime: Property is not in the viewTime object`);
            logger.error(`Error in setViewTime: Property is not in the viewTime object`);
            return null;
        }
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        if (typeof amount !== 'number') {
            try {
                amount = parseInt(amount);
                if (isNaN(amount)) {
                    logger.error(`Error in setViewTime: Amount is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in setViewTime: ${error}`);
            }
        }
        // Set the viewTime property for the user in the cache and then the database
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        user.viewTime[property] = amount;
        this.cache.set(userId, user);
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            { $set: { [`viewTime.${property}`]: amount } },
            { upsert: true }
        );
    } catch (error) {
        logger.error(`Error in setViewTime: ${error}`);
    }
}



    // Method to increase the viewTime for allTime, yearly, monthly, weekly, and stream for a user. If the property does not exist, it will be created. Take in the number of minutes as a number.
    async increaseViewTime(userId, minutes) {
    try {
        if (minutes === undefined || minutes === null) {
            logger.error(`Error in increaseViewTime: Minutes is undefined`);
            return;
        }
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if minutes is a number
        if (typeof minutes !== 'number') {
            try {
                minutes = parseInt(minutes);
                if (isNaN(minutes)) {
                    logger.error(`Error in increaseViewTime: Minutes is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseViewTime: ${error}`);
            }
        }
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }

        // Check if any of the view time properties are NaN. If they are then set them to 0
        if (isNaN(user.viewTime.allTime)) {
            user.viewTime.allTime = 0;
        }
        if (isNaN(user.viewTime.yearly)) {
            user.viewTime.yearly = 0;
        }
        if (isNaN(user.viewTime.monthly)) {
            user.viewTime.monthly = 0;
        }
        if (isNaN(user.viewTime.weekly)) {
            user.viewTime.weekly = 0;
        }
        if (isNaN(user.viewTime.stream)) {
            user.viewTime.stream = 0;
        }
        user.viewTime.allTime += minutes;
        user.viewTime.yearly += minutes;
        user.viewTime.monthly += minutes;
        user.viewTime.weekly += minutes;
        user.viewTime.stream += minutes;
        // Increase the viewTime property for the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            {
                $set: {
                    viewTime: {
                        allTime: user.viewTime.allTime,
                        yearly: user.viewTime.yearly,
                        monthly: user.viewTime.monthly,
                        weekly: user.viewTime.weekly,
                        stream: user.viewTime.stream
                    },
                    lastSeen: lastSeen
                }
            },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in increaseViewTime: ${error}`);
    }
}

    // Method to increase the bits for allTime, yearly, monthly, weekly, and stream for a user. If the property does not exist, it will be created. Take in the number of bits as a number.
    async increaseBits(userId, bits) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if bits is a number
        if (typeof bits !== 'number') {
            try {
                bits = parseInt(bits);
                if (isNaN(bits)) {
                    logger.error(`Error in increaseBits: Bits is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseBits: ${error}`);
            }
        }

        // Check if the user exists in the database. If they do not then add them to the database
        const userExists = this.getUserByUserId(userId);
        if (!userExists) {
            this.newUser(userId);
        };
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        user.bits.allTime += bits;
        user.bits.yearly += bits;
        user.bits.monthly += bits;
        user.bits.weekly += bits;
        user.bits.stream += bits;
        // Increase the bits property for the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            {
                $set: {
                    bits: {
                        allTime: user.bits.allTime,
                        yearly: user.bits.yearly,
                        monthly: user.bits.monthly,
                        weekly: user.bits.weekly,
                        stream: user.bits.stream
                    },
                    lastSeen: lastSeen
                }
            },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in increaseBits: ${error}`);
    }
}

    // Method to set the bits for allTime
    async setBitsManually(userId, bits) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if bits is a number
        if (typeof bits !== 'number') {
            try {
                bits = parseInt(bits);
                if (isNaN(bits)) {
                    logger.error(`Error in setBits: Bits is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in setBits: ${error}`);
            }
        }

        // Check if the user exists in the database. If they do not then add them to the database
        const userExists = this.getUserByUserId(userId);
        if (!userExists) {
            this.newUser(userId);
        };
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        user.bits.allTime = bits;

        // Increase the bits property for the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            {
                $set: {
                    bits: {
                        allTime: bits,
                    },
                }
            },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        console.log(`Error in setBits: ${error}`);
        logger.error(`Error in setBits: ${error}`);
    }
}

    // Method to increase the subs for allTime, yearly, monthly, weekly, and stream for a user. If the property does not exist, it will be created. Take in the number of bits as a number.
    async increaseSubs(userId, subs) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if subs is a number
        if (typeof subs !== 'number') {
            try {
                subs = parseInt(subs);
                if (isNaN(subs)) {
                    logger.error(`Error in increaseSubs: Subs is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseSubs: ${error}`);
            }
        }
        // Check if the user exists in the database. If they do not then add them to the database
        const userExists = this.getUserByUserId(userId);
        if (!userExists) {
            this.newUser(userId);
        };
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        user.subs.allTime += subs;
        user.subs.yearly += subs;
        user.subs.monthly += subs;
        user.subs.weekly += subs;
        user.subs.stream += subs;
        // Increase the subs property for the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            {
                $set: {
                    subs: {
                        allTime: user.subs.allTime,
                        yearly: user.subs.yearly,
                        monthly: user.subs.monthly,
                        weekly: user.subs.weekly,
                        stream: user.subs.stream
                    },
                    lastSeen: lastSeen
                }
            },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in increaseSubs: ${error}`);
    }
}

    // Method to increase the donations for allTime, yearly, monthly, weekly, and stream for a user. If the property does not exist, it will be created. Take in the number of bits as a number.
    async increaseDonations(userId, donations) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if donations is a number
        if (typeof donations !== 'number') {
            try {
                donations = parseInt(donations);
                if (isNaN(donations)) {
                    logger.error(`Error in increaseDonations: Donations is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseDonations: ${error}`);
            }
        }
        // Check if the user exists in the database. If they do not then add them to the database
        const userExists = this.getUserByUserId(userId);
        if (!userExists) {
            this.newUser(userId);
        };
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        user.donations.allTime += donations;
        user.donations.yearly += donations;
        user.donations.monthly += donations;
        user.donations.weekly += donations;
        user.donations.stream += donations;
        // Increase the donations property for the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            {
                $set: {
                    donations: {
                        allTime: user.donations.allTime,
                        yearly: user.donations.yearly,
                        monthly: user.donations.monthly,
                        weekly: user.donations.weekly,
                        stream: user.donations.stream
                    },
                    lastSeen: lastSeen
                }
            },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in increaseDonations: ${error}`);
    }
}

    // Method to add meta data to a users metadata array. It will be a property and then the value. Example property: value
    async addMetaData(userId, property, value) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if property is a string
        if (typeof property !== 'string') {
            property = property.toString();
        }
        // Check if value is a string
        if (typeof value !== 'string') {
            value = value.toString();
        }
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        const metaData = {};
        metaData[property] = value;
        user.metaData.push(metaData);
        // Add the meta data to the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            { $push: { metaData: metaData } },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in addMetaData: ${error}`);
    }
}

    // Method to set a meta data property for a user
    async setMetaDataProperty(userId, property, value) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if property is a string
        if (typeof property !== 'string') {
            property = property.toString();
        }
        // Check if value is a string
        if (typeof value !== 'string') {
            value = value.toString();
        }
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        const metaData = {};
        metaData[property] = value;
        user.metaData.push(metaData);
        // Add the meta data to the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            { $set: { metaData: metaData } },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in setMetaDataProperty: ${error}`);
    }
}

    // Method to increase a meta data property for a user if the value of the property in the database is a number
    async increaseMetaDataProperty(userId, property, amount) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if property is a string
        if (typeof property !== 'string') {
            property = property.toString();
        }
        // Check if amount is a number
        if (typeof amount !== 'number') {
            try {
                amount = parseInt(amount);
                if (isNaN(amount)) {
                    logger.error(`Error in increaseMetaDataProperty: Amount is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseMetaDataProperty: ${error}`);
            }
        }
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        const metaData = {};
        metaData[property] = value;
        user.metaData.push(metaData);
        // Add the meta data to the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            { $inc: { [`metaData.${property}`]: amount } },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in increaseMetaDataProperty: ${error}`);
    }
}

    // Method to remove a meta data property for a user
    async removeMetaDataProperty(userId, property) {
    try {
        // Check if userId is a string
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        // Check if property is a string
        if (typeof property !== 'string') {
            property = property.toString();
        }
        const date = new Date();
        const lastSeen = date;
        let user = this.cache.get(userId);
        if (!user) {
            user = await this.getUserByUserId(userId);
        }
        const metaData = {};
        metaData[property] = value;
        user.metaData.push(metaData);
        // Add the meta data to the user in the database
        await this.dbConnection.collection(this.collectionName).updateOne(
            { id: userId },
            { $unset: { [`metaData.${property}`]: "" } },
            { upsert: true }
        );
        this.cache.set(userId, user);
    } catch (error) {
        logger.error(`Error in removeMetaDataProperty: ${error}`);
    }
}
}


export default UsersDB;