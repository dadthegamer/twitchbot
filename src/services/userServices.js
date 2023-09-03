import { writeToLogFile } from '../utilities/logging.js';

// User class 
export class UsersDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
    }

    // Method to return all users
    async getAllUsers() {
        try {
            let users = this.cache.get('users');
            if (users) {
                return users;
            } else {
                users = await this.dbConnection.collection('userData').find({}).toArray();
                this.cache.set('users', users);
                return users;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getAllUsers: ${error}`);
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
                user = await this.dbConnection.collection('userData').findOne({ id: userId });
                this.cache.set(userId, user);
                console.log(user);
                return user;
            }
        }
        catch (error) {
            writeToLogFile('error', `Error in getUser: ${error}`);
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
            await this.dbConnection.collection('userData').findOneAndUpdate(query, update, options);
            this.cache.set(userData.id, userData);
        }
        catch (error) {
            writeToLogFile('error', `Error in addUser: ${error}`);
        }
    }

    // Method to increase/decrease a users property
    async increaseUserValue(userId, property, value) {
        if (typeof value !== 'number') {
            try {
                value = parseInt(value);
                console.log(typeof value)
                if (isNaN(value)) {
                    writeToLogFile('error', `Error in increaseUserValue: Value is not a number`);
                    return null;
                }
            }
            catch (error) {
                writeToLogFile('error', `Error in increaseUserValue: ${error}`);
            }
        }
        try {
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUser(userId);
            }
            if (property in user) {
                user[property] += value;
            } else {
                user[property] = value;
            }
            await this.dbConnection.collection('userData').updateOne(
                { id: userId },
                { $set: { [property]: user[property] } }
            );
            this.cache.set(userId, user);
        } catch (error) {
            writeToLogFile('error', `Error in increaseUserValue: ${error}`);
        }
    }

    // Method to set a users property
    async setUserValue(userId, property, value) {
        try {
            let user = this.cache.get(userId);
            if (!user) {
                user = await this.getUser(userId);
            }
            user[property] = value;
            await this.dbConnection.collection('userData').updateOne(
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
            const collection = this.dbConnection.collection("userData");
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
            const collection = this.dbConnection.collection("userData");
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
            const collection = this.dbConnection.collection("userData");
            const result = await collection.findOne({ [property]: value });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error retrieving user by ${property}: ${error}`);
        }
    }

    // Method to get a leaderboard by a property
    async getLeaderboardByProperty(property, count = 10) {
        try {
            const collection = this.dbConnection.collection("userData");
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
}
