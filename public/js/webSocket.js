import { welcomeQueue } from "./welcome.js";
import { showAlert } from "./alert.js";
import { updateSubsProgress } from "./progressbar.js";
import { addToTTSQueue } from "./tts.js";

let connected = false;
const connectingDiv = document.getElementById('connecting');
export const serverip = '192.168.1.31';
export const serverPort = '3500';
export const serverWSport = '3505';


export async function connectToWebSocketServer() {
    const socket = new WebSocket(`ws://${serverip}:${serverWSport}`);

    // Connection opened event
    socket.onopen = function () {
        console.log('Connected to WebSocket server');
        connectingDiv.style.display = 'none';
        connected = true;
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
        reconnect();
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


// onMessage event handler
export async function messageHandler (event) {
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