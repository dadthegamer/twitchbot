import { cache } from "../../../config/initializers";


const activeUsers = cache.get('activeUsers');
activeUsers.on('expired', (key, value) => {
    console.log(`Key ${key} expired`);
    activeUsers.delete(key);
});


export async function getActiveUsers() {
    try {
        return activeUsers.values();
    }
    catch (err) {
        console.error('Error in getActiveUsers:', err);
    }
}

export async function addActiveUser(userId) {
    try {
        activeUsers.set(userId, true, 60000);
    }
    catch (err) {
        console.error('Error in addActiveUser:', err);
    }
}