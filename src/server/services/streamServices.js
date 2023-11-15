import logger from "../utilities/logger.js";
import { msToMinutes } from "../utilities/utils.js";
import { chatLogService } from "../config/initializers.js";

// Class to handle all stream related services
class StreamDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.setInitialStreamData();
        this.getLatestEvents();
        this.checkStream();
    }

    // Method to set the initial stream data in the database if there is not already a document in the streamData collection with a status of offline or online
    async setInitialStreamData() {
        try {
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            // Check if there is already a document in the streamData collection with a status of offline or online
            const streamData = await this.dbConnection.collection('streamData').findOne(query);
            if (streamData) {
                return;
            }
            const update = {
                $set: {
                    status: 'offline',
                    title: null,
                    category: null,
                    date: null,
                    followers: [],
                    subs: 0,
                    bits: 0,
                    raids: 0,
                    donations: [],
                    maxViewers: 0,
                    averageViewers: 0,
                    viewers: [],
                    tiktTokLive: false,
                    tikTokLikes: 0,
                    tikTokFollowers: 0,
                    tikTokGifts: 0,
                    streamId: null,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            return true;
        }
        catch (error) {
            logger.error(`Error in setInitialStreamData: ${error}`);
            return false;
        }
    }

    // Method to start a stream
    async startStream(streamTitle, category) {
        if (await this.checkStream() !== null) {
            return;
        } else {
            try {
                const date = new Date();
                const query = { status: 'offline' };
                const streamId = await chatLogService.createChatLogForStream();
                const update = {
                    $set: {
                        status: 'online',
                        title: streamTitle,
                        category: category,
                        date: date,
                        followers: [],
                        subs: 0,
                        bits: 0,
                        raids: 0,
                        donations: [],
                        maxViewers: 0,
                        averageViewers: 0,
                        viewers: [],
                        tiktTokLive: false,
                        tikTokLikes: 0,
                        tikTokFollowers: 0,
                        tikTokGifts: 0,
                        streamId: streamId,
                    }
                };
                const options = { upsert: true };
                const res = await this.dbConnection.collection('streamData').updateOne(query, update, options);
                this.cache.set('stream', update.$set);
                this.cache.set('streamId', streamId)
                return res;
            }
            catch (error) {
                logger.error(`Error in startStream: ${error}`);
                return;
            }
        }
    }

    // Method to end a stream and store the stream data in the streams collection
    async endStream() {
        try {
            await this.insertNewStream();
            const query = { status: 'online' };
            const update = {
                $set: {
                    status: 'offline',
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.cache.del('stream');
            return true;
        }
        catch (error) {
            logger.error(`Error in endStream: ${error}`);
            return false;
        }
    }

    // Check if a stream has been started within the last hour
    async checkStream() {
        try {
            const streamData = await this.dbConnection.collection('streamData').findOne({ status: 'online' });
            // Check if a stream
            if (streamData) {
                this.cache.set('stream', streamData);
                return streamData;
            } else {
                return null;
            }
        }
        catch (error) {
            logger.error(`Error in checkStream: ${error}`);
            return null;
        }
    }

    // Method to copy the stream data from the streamData collection to the streams collection. Remove the status field from the streamData collection and insert
    // an uptime field that is calculated from the date field. Format the uptime field to be a string in the format of HH:MM:SS
    async insertNewStream() {
        try {
            const date = new Date();
            const streamData = await this.dbConnection.collection('streamData').findOne({ status: 'online' });
            const uptime = msToMinutes(date - streamData.date);
            const stream = {
                title: streamData.title,
                category: streamData.category,
                date: streamData.date,
                followers: streamData.followers,
                subs: streamData.subs,
                bits: streamData.bits,
                raids: streamData.raids,
                donations: streamData.donations,
                maxViewers: streamData.maxViewers,
                averageViewers: streamData.averageViewers,
                viewers: streamData.viewers,
                duration: uptime,
                tikTokLive: streamData.tikTokLive,
                tikTokLikes: streamData.tikTokLikes,
                tikTokFollowers: streamData.tikTokFollowers,
                tikTokGifts: streamData.tikTokGifts,
                streamId: streamData.streamId,
            };
            await this.dbConnection.collection('streams').insertOne(stream);
        }
        catch (error) {
            logger.error(`Error in insertNewStream: ${error}`);
        }
    }

    // Method to get the current stream data from the database and store it in the cache
    async getStreamData() {
        try {
            const streamData = await this.dbConnection.collection('streamData').findOne({ status: 'online' });
            this.cache.set('stream', streamData);
            return streamData;
        }
        catch (error) {
            logger.error(`Error in getStreamData: ${error}`);
            return null;
        }
    }

    // Method to increase a stream property
    async increaseStreamProperty(property, value) {
        if (typeof value !== 'number') {
            try {
                value = parseInt(value);
                if (isNaN(value)) {
                    logger.error(`Error in increaseStreamProperty: value is not a number`);
                    return null;
                }
            }
            catch (error) {
                logger.error(`Error in increaseStreamProperty: ${error}`);
                return null;
            }
        }
        try {
            const stream = this.cache.get('stream');
            if (property in stream) {
                stream[property] += value;
            } else {
                stream[property] = value;
            }
            await this.dbConnection.collection('streamData').updateOne(
                { status: 'online' },
                { $set: { [property]: stream[property] } }
            );
            this.cache.set('stream', stream);
            return;
        } catch (error) {
            logger.error(`Error in increaseStreamProperty: ${error}`);
        }
    }

    // Method to add a follower to the stream data
    async addFollower(displayName) {
        try {
            const stream = this.cache.get('stream');
            if (!stream.followers.includes(displayName)) {
                stream.followers.push(displayName);
                await this.dbConnection.collection('streamData').updateOne(
                    { status: 'online' },
                    { $set: { followers: stream.followers } }
                );
                this.cache.set('stream', stream);
            }
        }
        catch (error) {
            logger.error(`Error in addFollower: ${error}`);
        }
    }

    // Method to add a new sub to the stream data
    async addNewSub(displayName) {
        try {
            const stream = this.cache.get('stream');
            if (!stream.new_subs.includes(displayName)) {
                stream.new_subs.push(displayName);
                await this.dbConnection.collection('streamData').updateOne(
                    { status: 'online' },
                    { $set: { new_subs: stream.new_subs } }
                );
                this.cache.set('stream', stream);
            }
        }
        catch (error) {
            logger.error(`Error in addNewSub: ${error}`);
        }
    }

    // Method to add a viewer to the stream data
    async addViewer(userId) {
        try {
            const stream = this.cache.get('stream');
            if (!stream.viewers.includes(userId)) {
                stream.viewers.push(userId);
                await this.dbConnection.collection('streamData').updateOne(
                    { status: 'online' },
                    { $set: { viewers: stream.viewers } }
                );
                this.cache.set('stream', stream);
            }
        }
        catch (error) {
            logger.error(`Error in addViewer: ${error}`);
        }
    }

    // Method to set the latest event
    async setLatestEvent(eventType, eventData) {
        try {
            const stream = this.cache.get('stream');
            stream[eventType] = eventData;
            const query = { eventType: eventType };
            const update = {
                $set: {
                    [eventType]: eventData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
            return;
        }
        catch (error) {
            logger.error(`Error in setLatestEvent: ${error}`);
        }
    }

    // Methodt to set the latest follower
    async setLatestFollower(userData) {
        try {
            const stream = this.cache.get('stream');
            stream.latestFollower = userData;
            const query = { eventType: 'latestFollower' };
            const update = {
                $set: {
                    latestFollower: userData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
        }
        catch (error) {
            logger.error(`Error in setLatestFollower: ${error}`);
        }
    }

    // Method to set the latest sub
    async setLatestSub(userData) {
        try {
            const stream = this.cache.get('stream');
            stream.latestSub = userData;
            const query = { eventType: 'latestSub' };
            const update = {
                $set: {
                    latestSub: userData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
        }
        catch (error) {
            logger.error(`Error in setLatestSub: ${error}`);
        }
    }

    // Method to set the latest cheer
    async setLatestCheer(userData) {
        try {
            const stream = this.cache.get('stream');
            stream.latestCheer = userData;
            const query = { eventType: 'latestCheer' };
            const update = {
                $set: {
                    latestCheer: userData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
        }
        catch (error) {
            logger.error(`Error in setLatestCheer: ${error}`);
        }
    }

    // Method to set the latest donation
    async setLatestDonation(userData) {
        try {
            const stream = this.cache.get('stream');
            stream.latestDonation = userData;
            const query = { eventType: 'latestDonation' };
            const update = {
                $set: {
                    latestDonation: userData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
        }
        catch (error) {
            logger.error(`Error in setLatestDonation: ${error}`);
        }
    }

    // Method to get the latest event from the database in one query
    async getLatestEvents() {
        try {
            let events = [];
            const latestFollower = await this.dbConnection.collection('streamData').findOne({ eventType: 'latestFollower' });
            const latestSub = await this.dbConnection.collection('streamData').findOne({ eventType: 'latestSub' });
            const latestCheer = await this.dbConnection.collection('streamData').findOne({ eventType: 'latestCheer' });
            const latestDonation = await this.dbConnection.collection('streamData').findOne({ eventType: 'latestDonation' });
            events.push(latestFollower);
            events.push(latestSub);
            events.push(latestCheer);
            events.push(latestDonation);
            this.cache.set('latestEvents', events);
            return events;
        }
        catch (error) {
            logger.error(`Error in getLatestEvents: ${error}`);
            return null;
        }
    }
}

export default StreamDB;