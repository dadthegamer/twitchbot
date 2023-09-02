import { serverip, serverWSport, serverPort } from './config.js';

const container = document.querySelector('.container');
const alertType = document.querySelector('#alert-type');
const alertInfo = document.querySelector('#alert-info');
const userImg = document.querySelector('#user-img');
const alertIcon = document.querySelector('.alert-icon');
const connectingDiv = document.getElementById('connecting');

let connected = false;
let connections = 0;
let socket;

// Define icons
const giftedSubIcon = '<i class="fas fa-gift"></i>';
const subIcon = '<i class="fa-solid fa-star"></i>';
const resubIcon = '<i class="fa-solid fa-star"></i>';
const raidIcon = '<i class="fa-solid fa-bolt"></i>';
const followIcon = '<i class="fa-solid fa-heart"></i>';
const cheerIcon = '<i class="fa-solid fa-gem"></i>'
const donationIcon = '<i class="fa-solid fa-dollar-sign"></i>';


// Function to play sound
function playSound(audio) {
    try {
        const sound = new Audio(audio);
        sound.play();
    }
    catch (err) {
        console.log(err.name);
        if (err.name === 'DOMException') {
            console.error('Error in playSound: Audio is disabled');
            return;
        } else {
            console.error('Error in playSound:', err);
        }
    }
}

// Function to show icon based on alert type
async function showIcon(type) {
    switch (type) {
        case 'sub':
            alertIcon.innerHTML = subIcon;
            break;
        case 'resub':
            alertIcon.innerHTML = resubIcon;
            break;
        case 'giftedsub':
            alertIcon.innerHTML = giftedSubIcon;
            break;
        case 'raid':
            alertIcon.innerHTML = raidIcon;
            break;
        case 'follow':
            alertIcon.innerHTML = followIcon;
            break;
        case 'cheer':
            alertIcon.innerHTML = cheerIcon;
            break;
        case 'donation':
            alertIcon.innerHTML = donationIcon;
            break;
        default:
            break;
    }
}

// Function to show alert
export async function showAlert(data) {
    alertType.innerText = data.alertType;
    alertInfo.innerText = data.alertMessage;
    userImg.src = data.userImg;
    await showIcon(data.alertType);
    container.classList.add('show');
    if (data.sound) {
        playSound(data.sound);
    }
    setTimeout(() => {
        container.classList.remove('show');
    }, (data.alertTime - 500));
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
        if (data.type === 'alert') {
            showAlert(data.payload);
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