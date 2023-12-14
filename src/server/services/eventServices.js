import { twitchApi } from '../config/initializers.js';
import logger from '../utilities/logger.js';
import { actionEvalulate } from '../handlers/evaluator.js';
import NodeCache from 'node-cache';

// Class to connect to Twitch chat
class EventServices {
    constructor(dbConnection) {
        this.cache = new NodeCache();
        this.dbConnection = dbConnection;
        this.collectionName = 'events';
        this.getAllEvents();
    }

    // Method to get all the events from the database and cache them
    async getAllEvents() {
        try {
            // Get all the events from the database
            const events = await this.dbConnection.collection(this.collectionName).find().toArray();

            // Cache all the events
            this.cache.set('events', events);
            return events;
        } catch (error) {
            logger.error(error);
        }
    }

    // Method to get all the events from the cache
    async getAllEventsFromCache() {
        try {
            // Get all the events from the cache
            const events = this.cache.get('events');

            // If the events are not in the cache, get them from the database
            if (!events) {
                return await this.getAllEvents();
            }

            // Return the events from the cache
            return events;
        } catch (error) {
            logger.error(error);
        }
    }

    // Method to create a new event
    async createEvent(eventType, enabled, handlers) {
        try {
            // Create the event
            const event = {
                type: eventType,
                enabled: enabled,
                handlers: handlers
            };

            // Insert the event into the database
            await this.dbConnection.collection(this.collectionName).insertOne(event);

            // Cache the event
            this.cache.set(eventType, event);

            return event;
        } catch (error) {
            logger.error(error);
        }
    }

    // Method to handle events
    async handleEvent(eventType, { userId, displayName, input }) {
        try {
            console.log(eventType, userId, displayName, input);
            // Find all the event types that match the event in the cache
            const events = await this.getAllEventsFromCache();

            // Filter the events that match the event type
            const event = events.filter(event => event.type === eventType);

            // If there are no events, return
            if (!event) {
                return;
            } else {
                // For each event, evaluate the handler
                event.forEach(async event => {
                    const { handlers, enabled } = event;
                    if (enabled) {
                        handlers.forEach(async handler => {
                            await actionEvalulate(handler, { userId, displayName, input });
                        });
                    }
                });
            }
        } catch (error) {
            console.log(error);
            logger.error(error);
        }
    }
}


export default EventServices;