import logger from "../utilities/logger.js";
import { msToMinutes } from "../utilities/utils.js";
import { chatLogService } from "../config/initializers.js";


// Class to handle all stream related services
class StreamDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.setInitialStreamData();
        this.setInitialLatestEvents();
        this.getLatestEvents();
        this.counter = 0;
    }

    // Stream Template
    streamTemplate() {
        return {
            status: 'offline',
            title: null,
            streamId: null,
            gameName: null,
            tags: null,
            streamId: null,
            startDate: null,
            endDate: null,
            followers: [],
            giftedSubs: [],
            bits: [],
            raids: [],
            donations: [],
            maxViewers: 0,
            averageViewers: 0,
            viewers: [],
            tiktTokLive: false,
            tikTokLikes: 0,
            tikTokFollowers: 0,
            tikTokGifts: 0,
        }
    }

    // Latest Events Template
    latestEventsTemplate() {
        return {
            type: null,
            displayName: null,
            userId: null,
            profilePic: null,
        }
    }

    // Latest Events Array
    latestEventsArray() {
        return [
            'latestFollower',
            'latestDonation',
            'latestRaid',
            'latestCheer',
            'latestSub'
        ]
    }

    // Method to insert the template into the database if it doesn't exist
    async setInitialStreamData() {
        try {
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            const streamData = await this.dbConnection.collection('streamData').findOne(query);
            if (streamData) {
                return;
            } else {
                await this.dbConnection.collection('streamData').insertOne(this.streamTemplate());
            }
        }
        catch (error) {
            logger.error(`Error in setInitialStreamData: ${error}`);
        }
    }

    // Method to set the initial latest events data
    async setInitialLatestEvents() {
        try {
            const latestEventsArray = this.latestEventsArray();
            latestEventsArray.forEach(async (event) => {
                const query = { type: event };
                const latestEvent = await this.dbConnection.collection('latestEvents').findOne(query);
                if (latestEvent) {
                    return;
                } else {
                    await this.dbConnection.collection('latestEvents').insertOne({
                        type: event,
                        displayName: null,
                        userId: null,
                        profilePic: null
                    });
                }
            });
        }
        catch (error) {
            logger.error(`Error in setInitialLatestEvents: ${error}`);
        }
    }

    // Method to return the latest stream data from the database
    async getStreamData() {
        try {
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            const streamData = await this.dbConnection.collection('streamData').findOne(query);
            this.cache.set('stream', streamData);
            return streamData;
        }
        catch (error) {
            logger.error(`Error in getStreamData in streamService: ${error}`);
        }
    }

    // Get latest events from the database
    async getLatestEvents() {
        try {
            let latestEvents = this.cache.get('latestEvents');
            if (!latestEvents) {
                // Get the latest events from the database from the entire collection
                const latestEvents = await this.dbConnection.collection('latestEvents').find().toArray();
                this.cache.set('latestEvents', latestEvents);
                return latestEvents;
            } else {
                return latestEvents;
            }
        }
        catch (error) {
            logger.error(`Error in getLatestEvents in streamService: ${error}`);
        }
    }

    // Method to start a stream
    async newStream(streamTitle, gameName, streamId, startDate, tags) {
        try {
            const streamData = this.streamTemplate();
            streamData.status = 'online';
            streamData.title = streamTitle;
            streamData.gameName = gameName;
            streamData.streamId = streamId;
            streamData.startDate = startDate;
            streamData.tags = tags;
            this.cache.set('stream', streamData);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    status: 'online',
                    title: streamTitle,
                    gameName: gameName,
                    streamId: streamId,
                    startDate: startDate,
                    tags: tags
                }
            });
            return true;
        }
        catch (error) {
            logger.error(`Error in creating newStream in streamService: ${error}`);
            return false;
        }
    }

    // Method to end a stream and store the stream data in the streams collection
    async endStream() {
        try {
            const streamData = this.cache.get('stream');
            streamData.status = 'offline';
            streamData.endDate = new Date();
            await this.dbConnection.collection('streams').insertOne(streamData);
            this.cache.set('stream', this.streamTemplate());
            // Update the database with the new stream data template
            await this.dbConnection.collection('streamData').updateOne({ status: 'online' }, {
                $set: this.streamTemplate()
            });
            return true;
        }
        catch (error) {
            logger.error(`Error in endStream in streamService: ${error}`);
            return false;
        }
    }

    // Method to add a follower to the stream data
    async addFollower(follower) {
        try {
            const streamData = this.getStreamData();
            streamData.followers.push(follower);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    followers: streamData.followers
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addFollower in streamService: ${error}`);
            return false;
        }
    }

    // Method to add a donation to the stream data
    async addDonation({ userId, displayName, amount }) {
        try {
            const streamData = this.getStreamData();
            const donation = {
                userId,
                displayName,
                amount
            };
            streamData.donations.push(donation);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    donations: streamData.donations
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addDonation in streamService: ${error}`);
            return false;
        }
    }

    // Method to add a raid to the stream data
    async addRaid({ userId, displayName, viewerCount }) {
        try {
            const streamData = this.getStreamData();
            const raid = {
                userId,
                displayName,
                viewerCount
            };
            streamData.raids.push(raid);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    raids: streamData.raids
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addRaid in streamService: ${error}`);
            return false;
        }
    }

    // Method to add a sub to the stream data
    async addGiftedSub({ userId, displayName, amount }) {
        try {
            const streamData = this.getStreamData();
            const giftedSub = {
                userId,
                displayName,
                amount
            };
            streamData.giftedSubs.push(giftedSub);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    giftedSubs: streamData.giftedSubs
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addGiftedSub in streamService: ${error}`);
            return false;
        }
    }

    // Method to add bits to the stream data
    async addBits({ userId, displayName, amount }) {
        try {
            const streamData = this.getStreamData();
            const bits = {
                userId,
                displayName,
                amount
            };
            streamData.bits.push(bits);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    bits: streamData.bits
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addBits in streamService: ${error}`);
            return false;
        }
    }

    // Method to add a viewer to the stream data
    async addViewer(viewer) {
        try {
            const streamData = this.getStreamData();
            streamData.viewers.push(viewer);
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    viewers: streamData.viewers
                }
            });
            this.cache.set('stream', streamData);
            return true;
        }
        catch (error) {
            logger.error(`Error in addViewer in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the max viewers
    async updateMaxViewers(viewerCount) {
        try {
            const streamData = this.getStreamData();
            if (viewerCount > streamData.maxViewers) {
                streamData.maxViewers = viewerCount;
                const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
                await this.dbConnection.collection('streamData').updateOne(query, {
                    $set: {
                        maxViewers: viewerCount
                    }
                });
                this.cache.set('stream', streamData);
            }
            return true;
        }
        catch (error) {
            logger.error(`Error in updateViewers in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the average viewers
    async updateAverageViewers(viewerCount) {
        try {
            const streamData = this.getStreamData();
            // Find the average viewers by getting the current average, multiplying it by the counter and adding the new viewer count, then dividing by the new counter
            const averageViewers = (streamData.averageViewers * this.counter + viewerCount) / (this.counter + 1);
            streamData.averageViewers = averageViewers;
            this.counter++;
            const query = { $or: [{ status: 'offline' }, { status: 'online' }] };
            await this.dbConnection.collection('streamData').updateOne(query, {
                $set: {
                    averageViewers: averageViewers
                }
            });
            return true;
        }
        catch (error) {
            logger.error(`Error in updateViewers in streamService: ${error}`);
            return false;
        }
    }

    // Method to handle viewer count updates
    async updateViewers(viewerCount) {
        try {
            await this.updateMaxViewers(viewerCount);
            await this.updateAverageViewers(viewerCount);
            return true;
        }
        catch (error) {
            logger.error(`Error in updateViewers in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the latest follower
    async updateLatestFollower({ displayName, userId, profilePic }) {
        try {
            const latestEvents = this.getLatestEvents();
            // Find the latest follower in the latestEvents array
            const latestFollower = latestEvents.find(event => event.type === 'latestFollower');
            if (latestFollower) {
                latestFollower.displayName = displayName;
                latestFollower.userId = userId;
                latestFollower.profilePic = profilePic;
                const query = { type: 'latestFollower' };
                await this.dbConnection.collection('latestEvents').updateOne(query, {
                    $set: {
                        displayName: displayName,
                        userId: userId,
                        profilePic: profilePic
                    }
                });
                this.cache.set('latestEvents', latestEvents);
                return true;
            }
        }
        catch (error) {
            logger.error(`Error in updateLatestFollower in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the latest donation
    async updateLatestDonation({ displayName, userId, profilePic }) {
        try {
            const latestEvents = this.getLatestEvents();
            const latestDonation = latestEvents.find(event => event.type === 'latestDonation');
            if (latestDonation) {
                latestDonation.displayName = displayName;
                latestDonation.userId = userId;
                latestDonation.profilePic = profilePic;
                const query = { type: 'latestDonation' };
                await this.dbConnection.collection('latestEvents').updateOne(query, {
                    $set: {
                        displayName: displayName,
                        userId: userId,
                        profilePic: profilePic
                    }
                });
                this.cache.set('latestEvents', latestEvents);
                return true;
            }
        }
        catch (error) {
            logger.error(`Error in updateLatestDonation in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the latest raid
    async updateLatestRaid({ displayName, userId, profilePic }) {
        try {
            const latestEvents = this.getLatestEvents();
            const latestRaid = latestEvents.find(event => event.type === 'latestRaid');
            if (latestRaid) {
                latestRaid.displayName = displayName;
                latestRaid.userId = userId;
                latestRaid.profilePic = profilePic;
                const query = { type: 'latestRaid' };
                await this.dbConnection.collection('latestEvents').updateOne(query, {
                    $set: {
                        displayName: displayName,
                        userId: userId,
                        profilePic: profilePic
                    }
                });
                this.cache.set('latestEvents', latestEvents);
                return true;
            }
        }
        catch (error) {
            logger.error(`Error in updateLatestRaid in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the latest cheer
    async updateLatestCheer({ displayName, userId, profilePic }) {
        try {
            const latestEvents = this.getLatestEvents();
            const latestCheer = latestEvents.find(event => event.type === 'latestCheer');
            if (latestCheer) {
                latestCheer.displayName = displayName;
                latestCheer.userId = userId;
                latestCheer.profilePic = profilePic;
                const query = { type: 'latestCheer' };
                await this.dbConnection.collection('latestEvents').updateOne(query, {
                    $set: {
                        displayName: displayName,
                        userId: userId,
                        profilePic: profilePic
                    }
                });
                this.cache.set('latestEvents', latestEvents);
                return true;
            }
        }
        catch (error) {
            logger.error(`Error in updateLatestCheer in streamService: ${error}`);
            return false;
        }
    }

    // Method to update the latest sub
    async updateLatestSub({ displayName, userId, profilePic }) {
        try {
            const latestEvents = this.getLatestEvents();
            const latestSub = latestEvents.find(event => event.type === 'latestSub');
            if (latestSub) {
                latestSub.displayName = displayName;
                latestSub.userId = userId;
                latestSub.profilePic = profilePic;
                const query = { type: 'latestSub' };
                await this.dbConnection.collection('latestEvents').updateOne(query, {
                    $set: {
                        displayName: displayName,
                        userId: userId,
                        profilePic: profilePic
                    }
                });
                this.cache.set('latestEvents', latestEvents);
                return true;
            }
        }
        catch (error) {
            logger.error(`Error in updateLatestSub in streamService: ${error}`);
            return false;
        }
    }
}

export default StreamDB;