import { serverip, serverWSport, serverPort } from './config.js';
import { showAlert } from './alert.js';
let connected = false;
let connections = 0;
let socket;


const connectingDiv = document.getElementById('connecting');

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
        messageHandler(data);
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


// onMessage event handler
export async function messageHandler(event) {
    console.log(event);
    const type = event.type;
    if (type === 'welcome') {
        welcomeQueue.push(event.payload);
    } else if (type === 'alert') {
        showAlert(event.payload);
    } else if (type === 'subscription') {
        updateSubsProgress(event.payload);
    } else if (type === 'tts') {
        addToTTSQueue(event.payload);
    }
};


addEventListener('DOMContentLoaded', () => {
    connectToWebSocketServer();
    reconnect();
});