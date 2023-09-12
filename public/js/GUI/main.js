import { serverip, serverWSport, serverPort } from '../config.js';

const notifications = document.getElementById('notifications');
const notificationsItems = document.getElementById('notifications-items');
const notificationsContainer = document.querySelector('.notification-items-container');
const notificationCount = document.querySelector('.notification-count');

let connected = false;
let socket;


// Add event listener to notifications
notifications.addEventListener('click', () => {
    // Toggle notifications
    notificationsItems.classList.toggle('show');
});


export async function connectToWebSocketServer() {
    if (connected) {
        return;
    }
    try {
        socket = new WebSocket(`ws://${serverip}:${serverWSport}`);
    }
    catch (err) {
        console.error('Error in connectToWebSocketServer:', err);
    }

    // Connection opened event
    socket.onopen = function () {
        connected = true;
        console.log('Connected to WebSocket server');
    };

    // Message received event
    socket.onmessage = function (event) {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'notification') {
                createNotificationItem(data.payload);
            }
        }
        catch (err) {
            console.error('Error in onmessage:', err);
        }
    };

    // Connection closed event
    socket.onclose = function (event) {
        try {
            console.log('Disconnected from WebSocket server');
            connected = false;
        }
        catch (err) {
            console.error('Error in onclose:', err);
        }
    };

    // Connection error event
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
}

// Function to reconnect to WebSocket server
async function reconnect() {
    setInterval(() => {
        if (!connected) {
            connectToWebSocketServer();
            if (connected) {
                clearInterval();
            }
        }
    }, 5000);
}

// Function to convert a date to a local time string in am/pm format
function convertDateToLocalTime(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    const localHours = hours % 12;
    const localMinutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = localHours + ':' + localMinutes + ' ' + ampm;
    return strTime;
}

// Function to add a notification to the notifications list
function createNotificationItem(notification) {
    console.log(`Notification received: ${notification.notification}`);
    // Create the outer div with the "notification-item" class
    const notificationItem = document.createElement('div');
    notificationItem.classList.add('notification-item');

    // Create the inner div
    const innerDiv = document.createElement('div');

    // Create and append the text span
    const textSpan = document.createElement('span');
    textSpan.textContent = notification.notification;
    innerDiv.appendChild(textSpan);

    // Create and append the close icon
    const closeIcon = document.createElement('i');
    closeIcon.classList.add('fa-solid', 'fa-times');
    innerDiv.appendChild(closeIcon);

    // Append the inner div to the outer div
    notificationItem.appendChild(innerDiv);

    // Create and append the time span
    const timeSpan = document.createElement('span');
    timeSpan.classList.add('noti-time');
    timeSpan.textContent = convertDateToLocalTime(new Date(notification.createdAt));
    notificationItem.appendChild(timeSpan);

    // Return the created notification item
    notificationsContainer.appendChild(notificationItem);
    increaseNotificationCount();
}

// Function to increase the notification count
function increaseNotificationCount() {
    const count = Number(notificationCount.textContent);
    notificationCount.textContent = count + 1;
}

// Function to get all the notifications from the server
async function getNotifications() {
    const response = await fetch(`http://${serverip}:${serverPort}/api/notifications`);
    const data = await response.json();
    return data;
}

addEventListener('DOMContentLoaded', async () => {
    connectToWebSocketServer();
    reconnect();
    await getNotifications();
});