import { writeToLogFile } from '../utilities/logging.js';
import { environment } from '../config/environmentVars.js';

// User class 
export class NotificationService {
    constructor(dbConnection, cache) {
        this.dbConnection = dbConnection;
        this.cache = cache;
        this.collectionName = 'notifications';
    }

    // Method to create a new notification
    async createNotification(notification, classification) {
        try {
            const data = {
                notification,
                createdAt: new Date(),
                classification,
                read: false
            }
            const result = await this.dbConnection.collection(this.collectionName).insertOne(data);
            return result;
        } catch (error) {
            writeToLogFile('error', `Error creating notification: ${error}`);
            throw error;
        }
    }

    // Method to get all notifications
    async getNotifications() {
        try {
            const result = await this.dbConnection.collection(this.collectionName).find({}).toArray();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error getting notifications: ${error}`);
            throw error;
        }
    }

    // Method to get all unread notifications
    async getUnreadNotifications() {
        try {
            const result = await this.dbConnection.collection(this.collectionName).find({ read: false }).toArray();
            return result;
        } catch (error) {
            writeToLogFile('error', `Error getting unread notifications: ${error}`);
            throw error;
        }
    }

    // Method to mark a notification as read
    async markNotificationAsRead(notificationId) {
        try {
            const result = await this.dbConnection.collection(this.collectionName).updateOne({ _id: notificationId }, { $set: { read: true } });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error marking notification as read: ${error}`);
            throw error;
        }
    }

    // Method to delete a notification
    async deleteNotification(notificationId) {
        try {
            const result = await this.dbConnection.collection(this.collectionName).deleteOne({ _id: notificationId });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error deleting notification: ${error}`);
            throw error;
        }
    }

    // Method to delete all notifications
    async deleteAllNotifications() {
        try {
            const result = await this.dbConnection.collection(this.collectionName).deleteMany({});
            return result;
        } catch (error) {
            writeToLogFile('error', `Error deleting all notifications: ${error}`);
            throw error;
        }
    }

    // Method to delete all read notifications
    async deleteReadNotifications() {
        try {
            const result = await this.dbConnection.collection(this.collectionName).deleteMany({ read: true });
            return result;
        } catch (error) {
            writeToLogFile('error', `Error deleting all read notifications: ${error}`);
            throw error;
        }
    }

}

