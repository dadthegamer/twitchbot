const totalTime = 60 * 5;
const timer = document.getElementById('timer');
let timeLeft = totalTime;
const firstContainer = document.getElementById('first-container');

const serverip = '192.168.1.31';
const serverWSport = 3505;

const countDown = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    timer.innerText = `${minutes}:${seconds}`;
    timeLeft--;
    if (timeLeft < 0) {
        clearInterval(countDown);
        timer.innerText = 'STARTING';
        timer.classList.add('starting');
    }

}, 1000);

function connectToWebSocketServer() {
    const socket = new WebSocket(`ws://${serverip}:${serverWSport}`);

    // Connection opened event
    socket.onopen = function () {
        console.log('Connected to WebSocket server');
    };

    // Message received event
    socket.onmessage = function (event) {
        const newAlert = JSON.parse(event.data);
        const type = newAlert.type;
        if (type === 'first') {
            console.log('Received test message:', newAlert.payload);
            createFirstMessage(newAlert.payload.user, newAlert.payload.profilePicture);
        }
    };

    // Connection closed event
    socket.onclose = function (event) {
        console.log('Disconnected from WebSocket server');
        // You can handle reconnection logic here if needed
    };

    // Connection error event
    socket.onerror = function (error) {
        console.error('WebSocket error:', error);
    };
}

function createFirstMessage(user, image) {
    const div = document.createElement('div');
    div.classList.add('first-inner');

    const img = document.createElement('img');
    img.src = image;

    const span = document.createElement('span');
    span.innerText = user;

    div.appendChild(img);
    div.appendChild(span);

    firstContainer.appendChild(div);
}

// Call the function to initiate the WebSocket connection
connectToWebSocketServer();

