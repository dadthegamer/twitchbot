import { serverip, serverWSport, serverPort } from './config.js';

const message = document.getElementById('message');
const userImg = document.getElementById('img');
const container = document.querySelector('.container');
const connectingDiv = document.getElementById('connecting');

let connected = false;
let connections = 0;
let socket;
let audioQueue = [];
let isPlaying = false;
// Function to add a message to the queue
export function addToTTSQueue(data) {
    audioQueue.push(data);
}

// Function to play the audio
async function playAudio() {
    try {
        if (audioQueue.length > 0 && !isPlaying) {
            const data = audioQueue.shift();
            const audio = await textToSpeech(data.message);
            audio.play();
            showMessage(data.img, data.message);
            audio.onended = () => {
                console.log('Audio ended');
                setTimeout(() => {
                    container.style.display = 'none';
                    setTimeout(() => {
                        isPlaying = false;
                        message.innerHTML = '';
                    }, 1000);
                }, 2500);
        };
    }}
    catch (err) {
        console.error('Error in playAudio:', err);
    }
}

// Queue handler
async function queueHandler() {
    setInterval(() => {
        playAudio();
    }, 1000);
}

// Function to add one word at a time to the message with a delay of 100ms per word
function addMessage(word) {
    try {
        const words = word.split(' ');
        let i = 0;
        container.style.display = 'flex';
        const interval = setInterval(() => {
            message.innerHTML += words[i] + ' ';
            i++;
            if (i >= words.length) {
                clearInterval(interval);
            }
        }, 200);  
    }
    catch (err) {
        console.error('Error in addMessage:', err);
    }
}

// Function to show the message
function showMessage(img, message) {
    try {
        userImg.src = img;
        userImg.addEventListener('error', () => {
            console.log('Error loading image');
            userImg.src = 'https://static-cdn.jtvnw.net/jtv_user_pictures/074e7c92-b08a-4e6b-a1c2-4e28eade69c0-profile_image-70x70.png';
        });
        addMessage(message);
    }
    catch (err) {
        console.error('Error in showMessage:', err);
    }
}

function autoScroll() {
    const duration = 8000;

    message.scrollTo({
        top: message.scrollHeight - message.clientHeight,
        behavior: 'smooth',
        duration: duration
    });
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
        if (data.type === 'tts') {
            addToTTSQueue(data.payload);
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


// Function to convert text to speech by making a post request to the server
async function textToSpeech(message) {
    try {
        const res = await fetch(`http://${serverip}:${serverPort}/api/tts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const audio = await res.blob();
        return new Audio(URL.createObjectURL(audio));
    }
    catch (err) {
        console.error('Error in textToSpeech:', err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    connectToWebSocketServer();
    reconnect();
    autoScroll();
    queueHandler();
    addToTTSQueue({ img: 'https://static-cdn.jtvnw.net/jtv_user_pictures/6b06e8e0-1ef8-4ee0-8dc0-f7d3190045b3-profile_image-70x70.png', message: 'Hello, welcome to the stream' })
});