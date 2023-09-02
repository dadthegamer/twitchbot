import { serverip, serverWSport, serverPort } from './config.js';

const progress = document.getElementById('myBar');
const goal_count = document.getElementById('goal_count');
const completed = document.querySelector('.completed');
const progress_text = document.querySelector('.progress-text');
const container = document.querySelector('.progress-container');
const query = new URLSearchParams(window.location.search);
const connectingDiv = document.getElementById('connecting');
let connected = false;
let socket;
let currentSubs = 0;
let currentGoal = 0;
let goalCompleted = false;
const type = query.get('type');

if (type === 'cam') {
    container.style.height = '150px';
    container.style.borderRadius = '10px';
    progress.style.height = '100%';
    progress.style.borderRadius = '10px';
    progress_text.style.top = '-150px';
    progress_text.style.fontSize = '64px';
    completed.style.top = '-300px';
    completed.style.fontSize = '64px';
}

async function getProgress() {
    try {
        const response = await fetch(`http://${serverip}:${serverPort}/api/streamstats/subs`);
        const data = await response.json();
        updateSubsProgress(data);
        return data;
    }
    catch (err) {
        console.error('Error in getProgress:', err);
    }
}


export async function updateSubsProgress(data) {
    if (data === undefined) return;
    if (data.currentSubs < currentSubs) return;
    if (data.dailyGoal < currentGoal) return;
    try {
        const current = data.currentSubs;
        const goal = data.dailyGoal;
        currentGoal = goal;
        goal_count.innerText = goal;
        if (currentSubs === current) {
            return;
        };
        currentSubs = current;
        const percentage = Math.floor((current / goal) * 100);
        progress.style.width = `${percentage}%`;
        animateValue('current_count', current, 1000)
        animateValue('pct', percentage, 1000)
        if (current >= goal && !goalCompleted) {
            goalCompleted = true;
            completed.style.display = 'block';
            setTimeout(() => {
                completed.style.display = 'none';
            }, 5000);
        }
    }
    catch (err) {
        console.error('Error in updateSubsProgress:', err);
    }
}

// Function to get the current value of the counter
function getCurrentValue(id) {
    return parseInt(document.getElementById(id).innerHTML);
}

// Function to animate the counter to a certain final value
function animateValue(id, end, duration) {
    try {
        let start = getCurrentValue(id);
        if (start === end || end <= 0) return;
        let range = end - start;
        let current = start;
        let increment = end > start ? 1 : -1;
        let stepTime = Math.abs(Math.floor(duration / range));
        let obj = document.getElementById(id);
        let timer = setInterval(function () {
            current += increment;
            obj.innerHTML = current;
            if (current == end) {
                clearInterval(timer);
            }
        }, stepTime);
    }
    catch (err) {
        console.error('Error in animateValue:', err);
    }
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
        console.log('Connected to WebSocket server');
        connectingDiv.style.display = 'none';
    };

    // Message received event
    socket.onmessage = function (event) {
        try {
            const data = JSON.parse(event.data);
            if (data.type === 'subscription') {
                updateSubsProgress(data.payload);
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
            connectingDiv.style.display = 'flex';
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

addEventListener('DOMContentLoaded', () => {
    connectToWebSocketServer();
    getProgress();
    reconnect();
});