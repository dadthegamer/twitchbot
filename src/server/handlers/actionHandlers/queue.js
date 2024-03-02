import { chatClient, interactionsDB } from '../../config/initializers.js';
import logger from '../../utilities/logger.js';

let queueOpen = true;

// Function to add a user to the queue
export async function addToQueue(displayName) {
    // Add user to queue if they are not already in it
    try {
        if (!queueOpen) {
            chatClient.say('The queue is currently closed.');
            return;
        } else {
            const res = await interactionsDB.addToQueue(displayName);
            if (!res) {
                chatClient.say(`${displayName} is already in the queue!`);
            } else {
                chatClient.say(`${displayName} has been added to the queue at position ${res}!`);
            }
        }
    }
    catch (err) {
        logger.error(`Error in addToQueue: ${err}`);
    }
}

// Function to remove a user from the queue
export async function removeFromQueue(displayName) {
    try {
        const res = await interactionsDB.removeFromQueue(displayName);
        if (!res) {
            chatClient.say(`${displayName} is not in the queue!`);
        } else {
            chatClient.say(`${displayName} has been removed from the queue!`);
        }
    }
    catch (err) {
        logger.error(`Error in removeFromQueue: ${err}`);
    }
}

// Function to get the queue
export async function getQueue() {
    try {
        const queue = await interactionsDB.getQueue();
        if (queue.length > 0) {
            chatClient.say(`The queue is currently: ${queue.join(', ')}`);
        } else {
            chatClient.say('The queue is currently empty!');
        }
    }
    catch (err) {
        logger.error(`Error in getQueue: ${err}`);
    }
}

// Function to clear the queue
export async function clearQueue() {
    try {
        const res = await interactionsDB.clearQueue();
        if (res) {
            chatClient.say('The queue has been cleared!');
        }
    }
    catch (err) {
        logger.error(`Error in clearQueue: ${err}`);
    }
}

// Function to toggle the queue open/closed
export function toggleQueue() {
    queueOpen = !queueOpen;
    if (queueOpen) {
        chatClient.say('The queue is now open!');
    } else {
        chatClient.say('The queue is now closed!');
    }
}