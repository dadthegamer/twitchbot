import { writeToLogFile } from '../utilities/logging.js';
import { twitchApi } from '../config/initializers.js';
import { environment } from '../config/environmentVars.js';

// User class 
export class UsersDB {
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
            writeToLogFile('error', `Error in getAllUsers: ${error}`);
            return null;
        }
    }

    // Method to return rather a user is a follower or not
    async isFollower(userId) {
        try {
            if (typeof userId !== 'string') {
                userId = userId.toString();
            }
            const user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
            if (user.follow_date) {
                return true;
            } else {
                return false;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in isFollower: ${error}`);
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
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.newFollower(twitchUser);
                    user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                }
                this.cache.set(userId, user);
                return user;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getUser: ${error}`);
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
                if (user.profile_image_url === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.setUserValue(userId, 'profile_image_url', twitchUser.profile_image_url);
                    user = await this.getUserByUserId(userId);
                }
                return user.profile_image_url;
            } else {
                user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                if (user === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.newFollower(twitchUser);
                    user = await this.dbConnection.collection(this.collectionName).findOne({ id: userId });
                }
                if (user.profile_image_url === null) {
                    const twitchUser = await twitchApi.getUserDataById(userId);
                    this.setUserValue(userId, 'profile_image_url', twitchUser.profile_image_url);
                    user = await this.getUserByUserId(userId);
                }
                this.cache.set(userId, user);
                return user.profile_image_url;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getUserProfileImageUrl: ${error}`);
            return null;
        }
    }

    // Method to add a user
    async newFollower(userData) {
        try {
            const date = new Date();
            const query = { id: userData.id };
            const update = {
                $set: {
                    id: userData.id,
                    display_name: userData.display_name,
                    login: userData.login,
                    profile_image_url: userData.profile_image_url,
                    follow_date: date,
                    leaderboard_points: 0,
                    arrived: true,
                    view_time: 0,
                    stream_view_time: 0,
                    monthly_view_time: 0,
                    weekly_view_time: 0,
                    last_seen: date,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection(this.collectionName).findOneAndUpdate(query, update, options);
            this.cache.set(userData.id, userData);
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error in addUser: ${error}`);
        }
    }

    // Method to add a user manually
    async addUserManually(userData) {
        try {
            const date = new Date();
            const query = { id: userData.id };
            const update = {
                $set: {
                    id: userData.id,
                    display_name: userData.display_name,
                    login: userData.login,
                    profile_image_url: null,
                    follow_date: userData.follow_date,
                    leaderboard_points: 0,
                    arrived: true,
                    view_time: 0,
                    stream_view_time: 0,
                    monthly_view_time: 0,
                    weekly_view_time: 0,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection(this.collectionName).findOneAndUpdate(query, update, options);
            this.cache.set(userData.id, userData);
        }
        catch (error) {
            writeToLogFile('error', `Error in addUser: ${error}`);
        }
    }

    // Method to increase/decrease a users property
    async increaseUserValue(userId, property, value) {
        if (typeof userId !== 'string') {
            userId = userId.toString();
        };
        if (typeof value !== 'number') {
            try {
                value = parseInt(value);
                if (isNaN(value)) {
                    writeToLogFile('error', `Error in increaseUserValue: Value is not a number`);
                    return null;
                }
            }
            catch (error) {
                writeToLogFile('error', `Error in increaseUserValue: ${error}`);
            }
        }
        if (environment === 'development') {
            console.log(`increaseUserValue: ${userId} ${property} ${value}`);
            return;
        } else {
            try {
                const date = new Date();
                const last_seen = date;
                let user = this.cache.get(userId);
                if (!user) {
                    user = await this.getUserByUserId(userId);
                }
                if (property in user) {
                    user[property] += value;
                } else {
                    user[property] = value;
                }
                await this.dbConnection.collection(this.collectionName).updateOne(
                    { id: userId },
                    { $set: { [property]: user[property], last_seen: last_seen } },
                    { upsert: true }
                );
                this.cache.set(userId, user);
            } catch (error) {
                console.log(error);
                writeToLogFile('error', `Error in increaseUserValue: ${error}`);
            }
        }
    }

    // Method to set a users property
    async setUserValue(userId, property, value) {
        try {
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            user[property] = value;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                { $set: { [property]: user[property] } },
                { upsert: true }
            );
            this.cache.set(userId, user);
            return user;
        } catch (error) {
            writeToLogFile('error', `Error in setUserValue: ${error}`);
        }
    }

    // Method to get the rank of a user by a property
    async getUserRankByProperty(userId, property) {
        if (typeof userId !== 'string') {
            userId = userId.toString();
        }
        try {
            const collection = this.dbConnection.collection(this.collectionName);
            const result = await collection
                .find({})
                .sort({ [property]: -1 })
                .toArray();
            const user = result.find((user) => user.id === userId);
            const rank = result.indexOf(user) + 1;
            return rank;
        } catch (error) {
            writeToLogFile('error', `Error retrieving user rank by ${property}: ${error}`);
        }
    }

    // Method to return the userId of the user with the highest value of a property
    async getHighestUserByProperty(property) {
        try {
            const collection = this.dbConnection.collection(this.collectionName);
            const result = await collection
                .find({})
                .sort({ [property]: -1 })
                .toArray();
            return result[0].id;
        } catch (error) {
            writeToLogFile('error', `Error retrieving highest user by ${property}: ${error}`);
        }
    }

    // Method to get user data by a property
    async getUserByProperty(property, value) {
        try {
            const collection = this.dbConnection.collection(this.collectionName);
            const result = await collection.findOne({ [property]: value });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error retrieving user by ${property}: ${error}`);
        }
    }

    // Method to get a leaderboard by a property
    async getLeaderboardByProperty(property, count = 10) {
        try {
            const collection = this.dbConnection.collection(this.collectionName);
            const result = await collection
                .find({})
                .sort({ [property]: -1 })
                .limit(count)
                .toArray();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error retrieving leaderboard by ${property}: ${error}`);
        }
    }

    // Method to reset a property for all users to 0 in the database and cache
    async resetProperty(property) {
        try {
            const collection = this.dbConnection.collection(this.collectionName);
            const result = await collection.updateMany(
                {},
                { $set: { [property]: 0 } }
            );
            const users = await collection.find({}).toArray();
            this.cache.set('users', users);
            return result;
        } catch (error) {
            writeToLogFile('error', `Error in resetProperty: ${error}`);
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
            writeToLogFile('error', `Error in resetArrived: ${error}`);
        }
    }

    // Method to reset the leaderboard_points property for all users to 0
    async resetLeaderboardPoints() {
        try {
            await this.resetProperty('leaderboard_points');
        }
        catch (error) {
            writeToLogFile('error', `Error in resetLeaderboardPoints: ${error}`);
        }
    }

    // Method to reset all stream properties for all users to 0
    async resetStreamProperties() {
        try {
            await this.resetProperty('stream_view_time');
            await this.resetProperty('stream_bits');
            await this.resetProperty('stream_subs');
            await this.resetProperty('stream_donations');
        }
        catch (error) {
            writeToLogFile('error', `Error in resetStreamProperties: ${error}`);
        }
    }

    // Method to reset all weekly properties for all users to 0
    async resetWeeklyProperties() {
        try {
            await this.resetProperty('weekly_view_time');
            await this.resetProperty('weekly_bits');
            await this.resetProperty('weekly_subs');
            await this.resetProperty('weekly_donations');
        }
        catch (error) {
            writeToLogFile('error', `Error in resetWeeklyProperties: ${error}`);
        }
    }

    // Method to reset all monthly properties for all users to 0
    async resetMonthlyProperties() {
        try {
            await this.resetProperty('monthly_view_time');
            await this.resetProperty('monthly_bits');
            await this.resetProperty('monthly_subs');
            await this.resetProperty('monthly_donations');
        }
        catch (error) {
            writeToLogFile('error', `Error in resetMonthlyProperties: ${error}`);
        }
    }

    // Method to increase the view_time, stream_view_time, monthly_view_time, and weekly_view_time properties for a user. If the property does not exist, it will be created. Take in the time in seconds as a number.
    async increaseViewTime(userId, time) {
        try {
            const date = new Date();
            const last_seen = date;
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            user.view_time += time;
            user.stream_view_time += time;
            user.monthly_view_time += time;
            user.weekly_view_time += time;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set: {
                        view_time: user.view_time,
                        stream_view_time: user.stream_view_time,
                        monthly_view_time: user.monthly_view_time,
                        weekly_view_time: user.weekly_view_time,
                        last_seen: last_seen
                    }
                },
                { upsert: true }
            );
            this.cache.set(userId, user);
        } catch (error) {
            writeToLogFile('error', `Error in increaseViewTime: ${error}`);
        }
    }

    // Method to increase the stream_bits, all_time_bits, monthly_bits, and weekly_bits properties for a user. If the property does not exist, it will be created. Take in the number of bits as a number.
    async increaseBits(userId, bits) {
        try {
            const date = new Date();
            const last_seen = date;
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            user.stream_bits += bits;
            user.all_time_bits += bits;
            user.monthly_bits += bits;
            user.weekly_bits += bits;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set: {
                        stream_bits: user.stream_bits,
                        all_time_bits: user.all_time_bits,
                        monthly_bits: user.monthly_bits,
                        weekly_bits: user.weekly_bits,
                        last_seen: last_seen
                    }
                },
                { upsert: true }
            );
            this.cache.set(userId, user);
        } catch (error) {
            writeToLogFile('error', `Error in increaseBits: ${error}`);
        }
    }

    // Method to increase the stream_subs, all_time_subs, monthly_subs, and weekly_subs properties for a user. If the property does not exist, it will be created. Take in the number of subs as a number.
    async increaseSubs(userId, subs) {
        try {
            const date = new Date();
            const last_seen = date;
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            user.stream_subs += subs;
            user.all_time_subs += subs;
            user.monthly_subs += subs;
            user.weekly_subs += subs;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set: {
                        stream_subs: user.stream_subs,
                        all_time_subs: user.all_time_subs,
                        monthly_subs: user.monthly_subs,
                        weekly_subs: user.weekly_subs,
                        last_seen: last_seen
                    }
                },
                { upsert: true }
            );
            this.cache.set(userId, user);
        } catch (error) {
            writeToLogFile('error', `Error in increaseSubs: ${error}`);
        }
    }

    // Method to increase the stream_donations, all_time_donations, monthly_donations, and weekly_donations properties for a user. If the property does not exist, it will be created. Take in the amount of the donation as a number.
    async increaseDonations(userId, amount) {
        try {
            const date = new Date();
            const last_seen = date;
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUserByUserId(userId);
            }
            user.stream_donations += amount;
            user.all_time_donations += amount;
            user.monthly_donations += amount;
            user.weekly_donations += amount;
            await this.dbConnection.collection(this.collectionName).updateOne(
                { id: userId },
                {
                    $set: {
                        stream_donations: user.stream_donations,
                        all_time_donations: user.all_time_donations,
                        monthly_donations: user.monthly_donations,
                        weekly_donations: user.weekly_donations,
                        last_seen: last_seen
                    }
                },
                { upsert: true }
            );
            this.cache.set(userId, user);
        } catch (error) {
            writeToLogFile('error', `Error in increaseDonations: ${error}`);
        }
    }

}
