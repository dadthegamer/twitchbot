import { writeToLogFile } from "../utilities/logging.js";
import { msToMinutes } from "../utilities/utils.js";
import { chatLogService } from "../config/initializers.js";

// Class to handle all stream related services
export class StreamDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.setInitialStreamData();
        this.getJackpot();
        this.getLatestEvents();
        this.checkStream();
    }

    // Method to set the initial stream data in the database if there is not already a document in the streamData collection with a status of offline or online
    async setInitialStreamData() {
        try {
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            const update = {
                $set: {
                    status: 'offline',
                    title: null,
                    category: null,
                    date: null,
                    followers: [],
                    new_subs: [],
                    gifted_subs: 0,
                    total_subs: 0,
                    bits: 0,
                    raids: 0,
                    donations: [],
                    max_viewers: 0,
                    average_viewers: 0,
                    viewers: [],
                    tiktTokLive: false,
                    tikTokLikes: 0,
                    tikTokFollowers: 0,
                    tikTokGifts: 0,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in setInitialStreamData: ${error}`);
            return false;
        }
    }

    // Method to start a stream
    async startStream(streamTitle, category) {
        if (await this.checkStream() !== null) {
            console.log('There is already a stream started within the last hour');
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
                        new_subs: [],
                        gifted_subs: 0,
                        total_subs: 0,
                        bits: 0,
                        raids: 0,
                        donations: [],
                        max_viewers: 0,
                        average_viewers: 0,
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
                writeToLogFile('error', `Error in startStream: ${error}`);
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
            writeToLogFile('error', `Error in endStream: ${error}`);
            return false;
        }
    }

    // Check if a stream has been started within the last hour
    async checkStream() {
        try {
            const streamData = await this.dbConnection.collection('streamData').findOne({ status: 'online' });
            console.log(`Stream data: ${streamData}`)
            if (streamData) {
                console.log('There is already a stream started within the last hour');
                this.cache.set('stream', streamData);
                this.cache.set('streamStartedAt', streamData.date);
                this.cache.set('streamTitle', streamData.title);
                this.cache.set('streamGame', streamData.category);
                this.cache.set('streamSubs', streamData.total_subs);
                this.cache.set('streamBits', streamData.bits);
                this.cache.set('streamDonations', streamData.donations);
                this.cache.set('viewers', streamData.viewers);
                this.cache.set('live', true);
                this.cache.set('TikTokLive', streamData.tikTokLive);
                this.cache.set('TikTokLiveId', streamData.tikTokLiveId);
                this.cache.set('TikTokLikes', streamData.tikTokLikes);
                this.cache.set('TikTokFollowers', streamData.tikTokFollowers);
                this.cache.set('TikTokGifts', streamData.tikTokGifts);

                // Set the stream id in the cache
                const streamId = streamData._id;
                this.cache.set('streamId', streamId);
                return streamData;
            } else {
                return null;
            }
        }
        catch (error) {
            console.log(error);
            writeToLogFile('error', `Error in checkStream: ${error}`);
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
                new_subs: streamData.new_subs,
                gifted_subs: streamData.gifted_subs,
                total_subs: streamData.total_subs,
                bits: streamData.bits,
                raids: streamData.raids,
                donations: streamData.donations,
                max_viewers: streamData.max_viewers,
                average_viewers: streamData.average_viewers,
                viewers: streamData.viewers,
                uptime: uptime,
            };
            await this.dbConnection.collection('streams').insertOne(stream);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in insertNewStream: ${error}`);
            return false;
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
            writeToLogFile('error', `Error in getStreamData: ${error}`);
            return null;
        }
    }

    // Method to increase a stream property
    async increaseStreamProperty(property, value) {
        if (typeof value !== 'number') {
            try {
                value = parseInt(value);
                if (isNaN(value)) {
                    writeToLogFile('error', `Error in increaseStreamProperty: Value is not a number`);
                    return null;
                }
            }
            catch (error) {
                writeToLogFile('error', `Error in increaseStreamProperty: ${error}`);
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
        } catch (error) {
            writeToLogFile('error', `Error in increaseStreamProperty: ${error}`);
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
            writeToLogFile('error', `Error in addFollower: ${error}`);
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
            writeToLogFile('error', `Error in addNewSub: ${error}`);
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
            writeToLogFile('error', `Error in addViewer: ${error}`);
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
                    [eventType]: userData,
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.getLatestEvents();
        }
        catch (error) {
            writeToLogFile('error', `Error in setLatestEvent: ${error}`);
        }
    }

    // Method to get the latest event from the database in one query
    async getLatestEvents() {
        try {
            let events = [];
            const latestFollower = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_follower' });
            const latestSub = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_subscriber' });
            const latestCheer = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_cheer' });
            const latestDonation = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_donation' });
            events.push(latestFollower);
            events.push(latestSub);
            events.push(latestCheer);
            events.push(latestDonation);
            this.cache.set('latestEvents', events);
            return events;
        }
        catch (error) {
            writeToLogFile('error', `Error in getLatestEvents: ${error}`);
            return null;
        }
    }

    // Method to get the current jackpot amount from the database and store it in the cache
    async getJackpot() {
        try {
            const data = await this.dbConnection.collection('streamData').findOne({ id: 'jackpot' });
            const jackpot = data.jackpot;
            this.cache.set('jackpot', jackpot);
            return jackpot;
        }
        catch (error) {
            writeToLogFile('error', `Error in getJackpot: ${error}`);
            return null;
        }
    }

    // Method to increase the jackpot amount in the database and cache
    async increaseJackpot(amount) {
        try {
            const jackpot = this.cache.get('jackpot');
            const newJackpot = jackpot + amount;
            await this.dbConnection.collection('streamData').updateOne(
                { id: 'jackpot' },
                { $set: { jackpot: newJackpot } }
            );
            this.cache.set('jackpot', newJackpot);
            return newJackpot;
        }
        catch (error) {
            writeToLogFile('error', `Error in increaseJackpot: ${error}`);
            return null;
        }
    }

    // Method to set the jackpot amount in the database and cache
    async setJackpot(amount) {
        try {
            await this.dbConnection.collection('streamData').updateOne(
                { id: 'jackpot' },
                { $set: { jackpot: amount } }
            );
            this.cache.set('jackpot', amount);
            return amount;
        }
        catch (error) {
            writeToLogFile('error', `Error in setJackpot: ${error}`);
            return null;
        }
    }
}