

// Class to handle all stream related services
export class StreamDB {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.getJackpot();
    }

    // Method to start a stream
    async startStream(streamTitle, category) {
        try {
            const date = new Date();
            const query = { status: 'offline' };
            const update = {
                $set: {
                    status: 'online',
                    title: streamTitle,
                    category: category,
                    date: date,
                    followers: [],
                    new_subs: [],
                    gifted_subs: 0,
                    bits: 0,
                    raids: 0,
                    donations: [],
                    max_viewers: 0,
                    average_viewers: 0,
                    viewers: [],
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            this.cache.set('stream', update.$set);
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in startStream: ${error}`);
            return false;
        }
    }

    // Method to end a stream and store the stream data in the streams collection
    async endStream() {
        try {
            // Get the stream data from the database
            const streamData = await this.dbConnection.collection('streamData').findOne({ status: 'online' });
            const query = { status: 'online' };
            const update = {
                $set: {
                    status: 'offline',
                }
            };
            const options = { upsert: true };
            await this.dbConnection.collection('streamData').updateOne(query, update, options);
            await this.dbConnection.collection('streams').insertOne(streamData);
            this.cache.del('stream');
            return true;
        }
        catch (error) {
            writeToLogFile('error', `Error in endStream: ${error}`);
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
            this.cache.set('stream', stream);
        }
        catch (error) {
            writeToLogFile('error', `Error in setLatestEvent: ${error}`);
        }
    }

    // Method to get the latest event from the database in one query
    async getLatestEvent() {
        try {
            let events = [];
            const latestFollower = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_follower' });
            const latestSub = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_sub' });
            const latestCheer = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_cheer' });
            const latestDonation = await this.dbConnection.collection('streamData').findOne({ eventType: 'latest_donation' });

            events.push(latestFollower);
            events.push(latestSub);
            events.push(latestCheer);
            events.push(latestDonation);
            this.cache.set('events', events);
            return events;
        }
        catch (error) {
            writeToLogFile('error', `Error in getStreamData: ${error}`);
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