import { serverip, serverWSport, serverPort } from './config.js';

const avatar = document.getElementById('user-avatar');
const displayname = document.getElementById('displayname');
const points = document.getElementById('points');
const container = document.querySelector('.container');
const connectingDiv = document.getElementById('connecting');
let connected = false;
let connections = 0;
let socket;

let showing = false;
export let welcomeQueue = [];



async function queueHandler() {
    setInterval(async () => {
        if (welcomeQueue.length > 0) {
            console.log(welcomeQueue);
            if (!showing) {
                showContainer(welcomeQueue.shift());
            }
        }
    }, 250);
}

// Function to update the user's avatar, display name, and points
async function updateUserInfo(data) {
    avatar.src = data.img;
    displayname.innerHTML = data.displayName;
    points.innerHTML = formatPoints(data.points);
}

// Function to format the user's points with commas
function formatPoints(points) {
    return points.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to show the container for 6 seconds
async function showContainer(data) {
    await updateUserInfo(data);
    container.style.display = 'flex';
    showing = true;
    setTimeout(() => {
        container.classList.add('hide');
        setTimeout(() => {
            container.style.display = 'none';
            container.classList.remove('hide');
            showing = false;
        }, 1000);
    }, 7000);
}

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
        connections++;
        console.log('Connected to WebSocket server');
        connectingDiv.style.display = 'none';
    };

    // Message received event
    socket.onmessage = function (event) {
        const data = JSON.parse(event.data);
        if (data.type === 'welcome') {
            showContainer(data.payload);
        }
    };

    // Connection closed event
    socket.onclose = function (event) {
        console.log('Disconnected from WebSocket server');
        connectingDiv.style.display = 'flex';
        connected = false;
        connections--;
    };

    // Connection error event
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
}

// Function to reconnect to WebSocket server
async function reconnect() {
    setInterval(() => {
        if (!connected || socket.readyState === WebSocket.CLOSED) {
            connectToWebSocketServer();
            if (connected) {
                clearInterval();
            }
        }
    }, 5000);
}

addEventListener('DOMContentLoaded', () => {
    connectToWebSocketServer();
    reconnect();
});