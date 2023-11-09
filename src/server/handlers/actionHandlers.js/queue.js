import { variableHandler } from '../variablesHandler.js';
import { cache } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

// Function to add a user to the queue
export async function addToQueue(displayName){
    // Add user to queue if they are not already in it
    try {
        const queue = cache.get('queue');
        if (!queue.includes(displayName)) {
            queue.push(displayName);
            cache.set('queue', queue);
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        logger.error(`Error in addToQueue: ${err}`);
    }
}

// Function to remove a user from the queue
export async function removeFromQueue(displayName){
    try {
        const queue = cache.get('queue');
        if (queue.includes(displayName)) {
            queue.splice(queue.indexOf(displayName), 1);
            cache.set('queue', queue);
            return true;
        } else {
            return false;
        }
    }
    catch (err) {
        logger.error(`Error in removeFromQueue: ${err}`);
    }
}

// Function to get the queue
export async function getQueue(){
    try {
        const queue = cache.get('queue');
        return queue;
    }
    catch (err) {
        logger.error(`Error in getQueue: ${err}`);
    }
}