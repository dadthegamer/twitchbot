import logger from "../utilities/logger.js";
import { twitchApi, currencyDB } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';


// User class 
class UsersDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'users';
        this.getAllUsers();
    }

    // Method to return what a user object should look like
    userTemplate() {
        return {
            id: null,
            displayName: null,
            userName: null,
            profilePictureUrl: null,
            broadcasterType: null,
            followDate: null,
            lastSeen: null,
            arrived: false,
            email: null,
            viewTime: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            activeViewTime: {
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
            channelPointsSpent: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            channelPointRedemptions: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            emotesUsed: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            clips: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            hypeTrainsParticipated: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            topHypeTrainTopContributor: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            hypeTrainContributions: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            bans: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            raids: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
            },
            miniGameWins: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            chatMessages: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
                weekly: 0,
                stream: 0
            },
            streamsWatched: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            first: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            second: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            third: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            firstFive: {
                allTime: 0,
                yearly: 0,
                monthly: 0,
            },
            lastSeen: null,
            metaData: []
        }
    };

    // Method to ensure that a number is a number and not a string. Return the number if it is a number or return null if it is not a number
    ensureNumber(number) {
        if (typeof number !== 'number') {
            try {
                number = parseInt(number);
                if (isNaN(number)) {
                    logger.error(`Error in ensureNumber: Number is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in ensureNumber: ${error}`);
            }
        }
        return number;
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
            console.log(error);
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
                if (!user) {
                    return false;
                } else {
                    return true;
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
            console.log(error);
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
                    this.newUser(twitchUser);
                    user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                }
                if (user.profilePictureUrl === null) {
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
    async newUser(userId, { followDate = new Date(), email = null }) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
            if (user) {
                // If the user is in the database then check if they have an email. If they do not then update the email
                if (user.email === null || user.email === undefined) {
                    this.setUserValue(userId, 'email', email);
                    return;
                } else {
                    return;
                }
            } else {
                const userData = await twitchApi.getUserDataById(userId);
                const query = { id: userId };
                // Get the user template and set the user data
                const userTemplate = this.userTemplate();
                userTemplate.id = userId;
                userTemplate.displayName = userData.displayName;
                userTemplate.userName = userData.name;
                userTemplate.profilePictureUrl = userData.profilePictureUrl;
                userTemplate.broadcasterType = userData.broadcasterType;
                userTemplate.followDate = followDate;
                userTemplate.lastSeen = date;
                userTemplate.arrived = true;
                userTemplate.email = email;
                const options = { upsert: true };
                const res = await this.dbConnection.collection(this.collectionName).findOneAndUpdate(query, userTemplate, options);
                this.cache.set(userId, userTemplate);
                return res;
            }
        }
        catch (error) {
            console.log(error);
            logger.error(`Error in adding a new user: ${error}`);
        }
    }

    // Method to set a users value in the database and cache
    async setUserValue(userId, property, value) {
        try {
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
        } catch (error) {
            logger.error(`Error in setUserValue: ${error}`);
        }
    }

    // Method to increase a property for a user. The property is a user object with a properties of allTime, yearly, monthly, weekly, and stream
    async increaseUserValue(userId, property, amount) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            amount = this.ensureNumber(amount);
            if (amount === null) {
                logger.error(`Error in increaseUserValue for property ${property}: Amount is not a number`);
                return;
            } else {
                // Get the user template and see if the property exists in the user object
                const userTemplate = this.userTemplate();
                const propertyExists = property in userTemplate;
                if (!propertyExists) {
                    logger.error(`Error in increaseUserValue: Property ${property} does not exist`);
                    return;
                } else {
                    let user = this.cache.get(userId);
                    if (!user) {
                        user = await this.getUserByUserId(userId);
                    }
                    user[property].allTime += amount;
                    user[property].yearly += amount;
                    user[property].monthly += amount;
                    user[property].weekly += amount;
                    user[property].stream += amount;
                    this.cache.set(userId, user);
                    // Increase the property for the user in the database
                    await this.dbConnection.collection(this.collectionName).updateOne(
                        { id: userId },
                        // Increase the property name within the property object to the amount
                        { $inc: { [`${property}.allTime`]: amount, [`${property}.yearly`]: amount, [`${property}.monthly`]: amount, [`${property}.weekly`]: amount, [`${property}.stream`]: amount } },
                        { upsert: true }
                    );
                }
            }
        } catch (error) {
            logger.error(`Error in increaseUserValue: ${error}`);
        }
    }

    // Method to get a leaderboard of users by a property
    async getLeaderboardByProperty(leaderboardProperty, limit = 10) {
        try {
            const userTemplate = this.userTemplate();
            const propertyExists = leaderboardProperty in userTemplate;
            if (!propertyExists) {
                logger.error(`Error in getLeaderboardByProperty: Property ${leaderboardProperty} does not exist`);
                return null;
            } else {
                const properties = Object.keys(userTemplate[leaderboardProperty]);
                const leaderboardData = [];

                await Promise.all(properties.map(async (property) => {
                    const sortObj = {};
                    sortObj[`${leaderboardProperty}.${property}`] = -1;

                    const users = await this.dbConnection.collection(this.collectionName)
                        .find({})
                        .sort(sortObj)
                        .limit(limit)
                        .toArray();

                    const leaderboard = users.map(user => ({
                        id: user.id,
                        displayName: user.displayName,
                        amount: user[leaderboardProperty][property],
                        profilePic: user.profilePictureUrl
                    })).filter(user => user.amount !== 0);

                    leaderboardData.push(
                        {
                            period: property,
                            leaderboard
                        }
                    );
                }));
                const data = {
                    leaderboardProperty,
                    leaderboardData
                }
                return data;
            }
        } catch (error) {
            console.log(error);
            logger.error(`Error in getLeaderboardByProperty: ${error}`);
            return null;
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
            // Get all the currency's that exist
            const currencies = await currencyDB.getAllCurrencies();
            // Make sure the currency exists in the currency database. It will have a property of name
            const currencyExists = currencies.find((currencyObj) => currencyObj.name === currency);
            if (!currencyExists) {
                logger.error(`Error in increaseCurrency: Currency does not exist`);
                return null;
            }
            // Check if the user exists. If they do not then return
            const user = await this.getUserByUserId(userId);
            if (!user) {
                return;
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
                // Check if the currency property exists. If it does then increase the amount. If it does not then set the amount
                if (user.currency === null || user.currency === undefined) {
                    user.currency = {};
                    user.currency[currency] = amount;
                } else {
                    if (currency in user.currency) {
                        user.currency[currency] += amount;
                    } else {
                        user.currency[currency] = amount;
                    }
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
            console.log(error);
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

    // Method to decrease currency for a list of users
    async decreaseCurrencyForUsers(userIds, currency, amount) {
        try {
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in decreaseCurrencyForUsers: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in decreaseCurrencyForUsers: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`decreaseCurrencyForUsers: ${userIds} ${currency} ${amount}`);
                return;
            } else {
                // Decrease the currency property for the user in the cache
                let users = this.cache.get('users');
                if (!users) {
                    users = await this.getAllUsers();
                }
                for (const userId of userIds) {
                    const user = users.find((user) => user.id === userId);
                    if (currency in user.currency) {
                        user.currency[currency] -= amount;
                    } else {
                        user.currency[currency] = amount;
                    }
                    this.cache.set(userId, user);
                }
                // Decrease the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateMany(
                    { id: { $in: userIds } },
                    // Decrease the currency name within the currency object to the amount
                    { $inc: { [`currency.${currency}`]: -amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in decreaseCurrencyForUsers: ${error}`);
        }
    }

    // Method to set a currency property for a list of users
    async setCurrencyForUsers(userIds, currency, amount) {
        try {
            if (typeof amount !== 'number') {
                try {
                    amount = parseInt(amount);
                    if (isNaN(amount)) {
                        logger.error(`Error in setCurrencyForUsers: Amount is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in setCurrencyForUsers: ${error}`);
                }
            }
            if (environment === 'development') {
                console.log(`setCurrencyForUsers: ${userIds} ${currency} ${amount}`);
                return;
            }
            else {
                // Set the currency property for the user in the cache
                let users = this.cache.get('users');
                if (!users) {
                    users = await this.getAllUsers();
                }
                for (const userId of userIds) {
                    const user = users.find((user) => user.id === userId);
                    user.currency[currency] = amount;
                    this.cache.set(userId, user);
                }
                // Set the currency property for the user in the database
                await this.dbConnection.collection(this.collectionName).updateMany(
                    { id: { $in: userIds } },
                    // Set the currency name within the currency object to the amount
                    { $set: { [`currency.${currency}`]: amount } },
                    { upsert: true }
                );
            }
        } catch (error) {
            logger.error(`Error in setCurrencyForUsers: ${error}`);
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

    // Method to delete all currency for all users
    async deleteAllCurrencies() {
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $unset: { currency: "" } }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            logger.error(`Error in deleteAllCurrency: ${error}`);
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
            await this.increaseStreamsWatched(userId)
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

    // Method to get the leaderboard for the top users in cumulativeMonths
    async getLeaderboardByCumulativeMonths(count = 10) {
        try {
            const collection = await this.dbConnection.collection(this.collectionName);
            const result = await collection
                .find({})
                .sort({ cumulativeMonths: -1 })
                .limit(count)
                .toArray();
            return result;
        } catch (error) {
            logger.error(`Error in getLeaderboardByCumulativeMonths: ${error}`);
            return null; // Handle the error gracefully
        }
    }

    // Method to reset a currency property for all users to 0
    async resetCurrency(currencyName) {
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $set: { [`currency.${currencyName}`]: 0 } }
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

    // TODO: Add a method to reset all properties for all users to 0
    // Method to reset all stream related properties for all users to 0
    async resetStreamProperties() {
        try {
            const update = {};
            const userTemplate = this.userTemplate();
            const properties = Object.keys(userTemplate);

            properties.forEach(property => {
                // Check if property is an object and not null
                if (typeof userTemplate[property] === 'object' && userTemplate[property] !== null) {
                    // Now check if there is a property in the object of stream
                    if ('stream' in userTemplate[property]) {
                        update[`${property}.stream`] = 0;
                    }
                }
            });
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $set: update }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            console.log(error);
            logger.error(`Error in resetStreamProperties: ${error}`);
        }
    }

    // Method to reset all weekly related properties for all users to 0
    async resetWeeklyProperties() {
        try {
            const update = {};
            const userTemplate = this.userTemplate();
            const properties = Object.keys(userTemplate);

            properties.forEach(property => {
                // Check if property is an object and not null
                if (typeof userTemplate[property] === 'object' && userTemplate[property] !== null) {
                    // Now check if there is a property in the object of weekly
                    if ('weekly' in userTemplate[property]) {
                        update[`${property}.weekly`] = 0;
                    }
                }
            });
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $set: update }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            logger.error(`Error in resetWeeklyProperties: ${error}`);
        }
    }

    // Method to reset all monthly properties for all users to 0
    async resetMonthlyProperties() {
        try {
            const update = {};
            const userTemplate = this.userTemplate();
            const properties = Object.keys(userTemplate);

            properties.forEach(property => {
                // Check if property is an object and not null
                if (typeof userTemplate[property] === 'object' && userTemplate[property] !== null) {
                    // Now check if there is a property in the object of monthly
                    if ('monthly' in userTemplate[property]) {
                        update[`${property}.monthly`] = 0;
                    }
                }
            });
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $set: update }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            logger.error(`Error in resetMonthlyProperties: ${error}`);
        }
    }

    // Method to reset all yearly properties for all users to 0
    async resetYearlyProperties() {
        try {
            const update = {};
            const userTemplate = this.userTemplate();
            const properties = Object.keys(userTemplate);

            properties.forEach(property => {
                // Check if property is an object and not null
                if (typeof userTemplate[property] === 'object' && userTemplate[property] !== null) {
                    // Now check if there is a property in the object of yearly
                    if ('yearly' in userTemplate[property]) {
                        update[`${property}.yearly`] = 0;
                    }
                }
            });
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                {},
                { $set: update }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
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

    // Method to increase active view time for a user
    async increaseActiveViewTime(userId, minutes) {
        try {
            if (minutes === undefined || minutes === null) {
                logger.error(`Error in increaseActiveViewTime: Minutes is undefined`);
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
                        logger.error(`Error in increaseActiveViewTime: Minutes is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in increaseActiveViewTime: ${error}`);
                }
            }
            let user = this.cache.get(userId);
            if (!user) {
                return;
            }
            const date = new Date();
            const lastSeen = date;
            if (user.activeViewTime === undefined) {
                user.activeViewTime = 0;
            };
            user.activeViewTime += minutes;
            // Increase the activeViewTime property for the user in the database
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set: {
                        activeViewTime: user.activeViewTime,
                        lastSeen: lastSeen
                    }
                },
                { upsert: true }
            );
            this.cache.set(userId, user);
            logger.info(`Increased active view time for ${userId} by ${minutes} minutes`);
        } catch (error) {
            logger.error(`Error in increaseActiveViewTime: ${error}`);
        }
    }

    // Increase view time for a list of users using the updateMany method
    async increaseViewTimeForUsers(userIds, minutes) {
        try {
            if (minutes === undefined || minutes === null) {
                logger.error(`Error in increaseViewTimeForUsers: Minutes is undefined`);
                return;
            }
            // Check if minutes is a number
            if (typeof minutes !== 'number') {
                try {
                    minutes = parseInt(minutes);
                    if (isNaN(minutes)) {
                        logger.error(`Error in increaseViewTimeForUsers: Minutes is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in increaseViewTimeForUsers: ${error}`);
                }
            }
            const date = new Date();
            const lastSeen = date;
            const result = await this.dbConnection.collection(this.collectionName).updateMany(
                { id: { $in: userIds } },
                {
                    $inc: {
                        'viewTime.allTime': minutes,
                        'viewTime.yearly': minutes,
                        'viewTime.monthly': minutes,
                        'viewTime.weekly': minutes,
                        'viewTime.stream': minutes
                    },
                    $set: {
                        lastSeen: lastSeen
                    },
                },
                { upsert: true }
            );
            const users = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            logger.error(`Error in increaseViewTimeForUsers: ${error}`);
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

    // Method to set the tiktok username for a user
    async setTikTokUsername(userId, tiktokUsername) {
        try {
            // Check if userId is a string
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if tiktokUsername is a string
            if (typeof tiktokUsername !== 'string') {
                tiktokUsername = tiktokUsername.toString();
            }
            // Check if the user exists in the database. If they do not then add them to the database
            const userExists = this.getUserByUserId(userId);
            if (!userExists) {
                this.newUser(userId);
            };
            // Set the tiktokUsername property for the user in the cache and then the database
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            };
            user.tiktokUsername = tiktokUsername;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set:
                        { tiktokUsername: tiktokUsername }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in setTikTokUsername: ${error}`);
        }
    }

    // Method to get increase the TikTok likes for a user
    async increaseTikTokLikes(user, likes) {
        try {
            if (likes === undefined || likes === null) {
                logger.error(`Error in increaseViewTime: Minutes is undefined`);
                return;
            }
            // Check if likes is a number
            if (typeof likes !== 'number') {
                try {
                    likes = parseInt(likes);
                    if (isNaN(likes)) {
                        logger.error(`Error in increaseViewTime: Minutes is not a number`);
                        return null;
                    }
                }
                catch (error) {
                    logger.error(`Error in increaseViewTime: ${error}`);
                }
            }

            // Increase the all time, yearly, monthly, weekly and stream TikTok likes for the user in the database
            await this.dbConnection.collection(this.collectionName).updateOne(
                { tiktokUsername: user },
                {
                    $inc: {
                        'tiktokLikes.allTime': likes,
                        'tiktokLikes.yearly': likes,
                        'tiktokLikes.monthly': likes,
                        'tiktokLikes.weekly': likes,
                        'tiktokLikes.stream': likes
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in tikTokLikes: ${error}`);
        }
    }

    // Method to store the discord username
    async setDiscordUsername(userId, username) {
        try {
            // Check if userId is a string
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if username is a string
            if (typeof username !== 'string') {
                username = username.toString();
            }
            // Check if the user exists in the database. If they do not then add them to the database
            const userExists = this.getUserByUserId(userId);
            if (!userExists) {
                this.newUser(userId);
            };
            // Set the discordUsername property for the user in the cache and then the database
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            };
            user.discordUsername = username;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set:
                        { discordUsername: username }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in setDiscordUsername: ${error}`);
        }
    }

    // Method to store the discord id
    async setDiscordId(userId, discordId) {
        try {
            // Check if userId is a string
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            // Check if discordId is a string
            if (typeof discordId !== 'string') {
                discordId = discordId.toString();
            }
            // Check if the user exists in the database. If they do not then add them to the database
            const userExists = this.getUserByUserId(userId);
            if (!userExists) {
                this.newUser(userId);
            };
            // Set the discordId property for the user in the cache and then the database
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            };
            user.discordId = discordId;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set:
                        { discordId: discordId }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in setDiscordId: ${error}`);
        }
    }

    // Method to increase the streams a user has watched
    async increaseStreamsWatched(userId) {
        try {
            // Increase the streams watched for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.streamsWatched === undefined) {
                user.streamsWatched = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.streamsWatched.allTime++;
            user.streamsWatched.yearly++;
            user.streamsWatched.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'streamsWatched.allTime': 1,
                        'streamsWatched.yearly': 1,
                        'streamsWatched.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseStreamsWatched: ${error}`);
        }
    }

    // Method to increase the amount of channel points redeemed for a user
    async increaseChannelPointsSpent(userId, amount) {
        try {
            // Increase the channel points redeemed for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.channelPointsSpent === undefined) {
                user.channelPointsSpent = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                    weekly: 0,
                    stream: 0
                }
            }
            user.channelPointsSpent.allTime += amount;
            user.channelPointsSpent.yearly += amount;
            user.channelPointsSpent.monthly += amount;
            user.channelPointsSpent.weekly += amount;
            user.channelPointsSpent.stream += amount;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'channelPointsSpent.allTime': amount,
                        'channelPointsSpent.yearly': amount,
                        'channelPointsSpent.monthly': amount,
                        'channelPointsSpent.weekly': amount,
                        'channelPointsSpent.stream': amount
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in channelPointsSpent: ${error}`);
        }
    }

    // Method to increase the amount of channel point redemtions for a user
    async increaseChannelPointRedemptions(userId) {
        try {
            // Increase the channel points redeemed for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.channelPointRedemptions === undefined) {
                user.channelPointRedemptions = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                    weekly: 0,
                    stream: 0
                }
            }
            user.channelPointRedemptions.allTime++;
            user.channelPointRedemptions.yearly++;
            user.channelPointRedemptions.monthly++;
            user.channelPointRedemptions.weekly++;
            user.channelPointRedemptions.stream++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'channelPointRedemptions.allTime': 1,
                        'channelPointRedemptions.yearly': 1,
                        'channelPointRedemptions.monthly': 1,
                        'channelPointRedemptions.weekly': 1,
                        'channelPointRedemptions.stream': 1
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in channelPointRedemptions: ${error}`);
        }
    }

    // Method to increase the raids for a user
    async increaseRaids(userId) {
        try {
            // Increase the raids for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.raids === undefined) {
                user.raids = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                    weekly: 0,
                    stream: 0
                }
            }
            user.raids.allTime++;
            user.raids.yearly++;
            user.raids.monthly++;
            user.raids.weekly++;
            user.raids.stream++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'raids.allTime': 1,
                        'raids.yearly': 1,
                        'raids.monthly': 1,
                        'raids.weekly': 1,
                        'raids.stream': 1
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseRaids: ${error}`);
        }
    }

    // Method to increase the amount of times a user was first
    async increaseFirstPlace(userId) {
        try {
            // Increase the first place for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.first === undefined) {
                user.first = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.first.allTime++;
            user.first.yearly++;
            user.first.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'first.allTime': 1,
                        'first.yearly': 1,
                        'first.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseFirstPlace: ${error}`);
        }
    }

    // Method to increase the amount of times a user was second
    async increaseSecondPlace(userId) {
        try {
            // Increase the second place for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.second === undefined) {
                user.second = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.second.allTime++;
            user.second.yearly++;
            user.second.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'second.allTime': 1,
                        'second.yearly': 1,
                        'second.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseSecondPlace: ${error}`);
        }
    }

    // Method to increase the amount of times a user was third
    async increaseThirdPlace(userId) {
        try {
            // Increase the third place for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.third === undefined) {
                user.third = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.third.allTime++;
            user.third.yearly++;
            user.third.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'third.allTime': 1,
                        'third.yearly': 1,
                        'third.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseThirdPlace: ${error}`);
        }
    }

    // Method to increase the amount of time a user entered the stream within the first 5 minutes
    async increaseFirstFiveMinutes(userId) {
        try {
            // Increase the first five minutes for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.firstFive === undefined) {
                user.firstFive = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.firstFive.allTime++;
            user.firstFive.yearly++;
            user.firstFive.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'firstFive.allTime': 1,
                        'firstFive.yearly': 1,
                        'firstFive.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseFirstFiveMinutes: ${error}`);
        }
    }

    // Method to increase the hype train participation for a user
    async increaseHypeTrainParticipation(userId) {
        try {
            // Increase the hype train participation for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.hypeTrainsParticipated === undefined) {
                user.hypeTrainsParticipated = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.hypeTrainsParticipated.allTime++;
            user.hypeTrainsParticipated.yearly++;
            user.hypeTrainsParticipated.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'hypeTrainsParticipated.allTime': 1,
                        'hypeTrainsParticipated.yearly': 1,
                        'hypeTrainsParticipated.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseHypeTrainParticipation: ${error}`);
        }
    }

    // Method to increase the times a user was the top contributor to a hype train
    async increaseTopHypeTrainContributor(userId) {
        try {
            // Increase the top hype train contributor for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.topHypeTrainTopContributor === undefined) {
                user.topHypeTrainTopContributor = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.topHypeTrainTopContributor.allTime++;
            user.topHypeTrainTopContributor.yearly++;
            user.topHypeTrainTopContributor.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'topHypeTrainTopContributor.allTime': 1,
                        'topHypeTrainTopContributor.yearly': 1,
                        'topHypeTrainTopContributor.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseTopHypeTrainContributor: ${error}`);
        }
    }

    // Method to increase hype train contributions
    async increaseHypeTrainContributions(userId, amount) {
        try {
            // Increase the hype train contributions for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.hypeTrainContributions === undefined) {
                user.hypeTrainContributions = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.hypeTrainContributions.allTime += amount;
            user.hypeTrainContributions.yearly += amount;
            user.hypeTrainContributions.monthly += amount;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'hypeTrainContributions.allTime': amount,
                        'hypeTrainContributions.yearly': amount,
                        'hypeTrainContributions.monthly': amount,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseHypeTrainContributions: ${error}`);
        }
    }

    // Method to increase the raids for a user
    async increaseRaidParticipation(userId) {
        try {
            // Increase the raid participation for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.raids === undefined) {
                user.raids = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                }
            }
            user.raids.allTime++;
            user.raids.yearly++;
            user.raids.monthly++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'raids.allTime': 1,
                        'raids.yearly': 1,
                        'raids.monthly': 1,
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseRaids: ${error}`);
        }
    }

    // Increase the amount of mini games won
    async increaseMiniGamesWon(userId) {
        try {
            // Increase the mini games won for the user in the database and cache
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            if (user.miniGameWins === undefined) {
                user.miniGameWins = {
                    allTime: 0,
                    yearly: 0,
                    monthly: 0,
                    weekly: 0,
                    stream: 0
                }
            }
            user.miniGameWins.allTime++;
            user.miniGameWins.yearly++;
            user.miniGameWins.monthly++;
            user.miniGameWins.weekly++;
            user.miniGameWins.stream++;
            this.cache.set(userId, user);
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $inc: {
                        'miniGameWins.allTime': 1,
                        'miniGameWins.yearly': 1,
                        'miniGameWins.monthly': 1,
                        'miniGameWins.weekly': 1,
                        'miniGameWins.stream': 1
                    }
                },
                { upsert: true }
            );
        } catch (error) {
            logger.error(`Error in increaseMiniGamesWon: ${error}`);
        }
    }
}


export default UsersDB;