import { cache } from "../config/initializers.js";

// Function to get the queue
function getQueue() {
    const queue = cache.get('queue');
    // If the queue is empty, return an empty array
    if (!queue) {
        return [];
    } else {
        return queue;
    };
};

// Function to add a user to the queue
function addUserToQueue(userId) {
    // Check if the user is already in the queue
    const queue = getQueue();
    if (queue.includes(userId)) {
        return;
    } else {
        queue.push(userId);
        cache.set('queue', queue);
    };
};

// Function to remove a user from the queue
function removeUserFromQueue(userId) {
    const queue = getQueue();
    const index = queue.indexOf(userId);
    queue.splice(index, 1);
    cache.set('queue', queue);
};

// Function to get the next user in the queue
function getNextUser() {
    const queue = getQueue();
    const user = queue[0];
    return user;
};

// Function to clear the queue
function clearQueue() {
    cache.del('queue');
};