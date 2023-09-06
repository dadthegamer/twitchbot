import { serverip, serverWSport, serverPort } from './config.js';


const predictionContainer = document.getElementById('prediction-container');
const outcomesContainer = document.querySelector('.outcomes-container');
const predictionTitle = document.getElementById('prediction-title');
const totalVotes = document.getElementById('total-votes');
const totalPoints = document.getElementById('total-points');
let outcomeStarted = false;
let totalPointsValue = 0;


// function to get the prediction data from the server
async function getPredictionData() {
    const response = await fetch(`http://${serverip}:${serverPort}/api/prediction`);
    const data = await response.json();
    return data.prediction;
}

// Function to create an outcome
function createOutcome(outcomeData) {
    let color = 'white'
    if (outcomeData.color === 'blue') {
        color = '#387ae1';
    } else if (outcomeData.color === 'pink') {
        color = '#f5009b';
    }
    const outcome = document.createElement('div');
    outcome.classList.add('outcome');
    outcome.dataset.outcomeId = outcomeData.id;
    const innerOutcome = document.createElement('div');
    innerOutcome.classList.add('inner-outcome');
    innerOutcome.style.color = color;
    const outcomeTitle = document.createElement('span');
    outcomeTitle.classList.add('outcome-title');
    outcomeTitle.innerText = outcomeData.title;
    const pctContainer = document.createElement('div');
    pctContainer.classList.add('pct-container');
    const pctSpan = document.createElement('span');
    pctSpan.classList.add('pct');
    pctSpan.innerText = 0;
    pctSpan.style.color = color;
    const pctSign = document.createElement('span');
    pctSign.innerText = '%';
    pctContainer.appendChild(pctSpan);
    pctContainer.appendChild(pctSign);
    innerOutcome.appendChild(outcomeTitle);
    innerOutcome.appendChild(pctContainer);
    const progressBarContainer = document.createElement('div');
    progressBarContainer.classList.add('progress-bar-container');
    const progressBar = document.createElement('div');
    progressBar.classList.add('progress-bar');
    if (color !== 'white') {
        progressBar.style.backgroundColor = color;
    }
    progressBarContainer.appendChild(progressBar);
    outcome.appendChild(innerOutcome);
    outcome.appendChild(progressBarContainer);

    predictionContainer.style.display = 'flex';
    outcomesContainer.appendChild(outcome);
}

// Function to start a timer for the prediction based on argument of ms. Convert it to minutes and seconds
function startTimer(ms) {
    const timer = document.getElementById('timer');
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    timer.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    let intervalId = setInterval(() => {
        seconds--;
        if (seconds < 0) {
            seconds = 59;
            minutes--;
        }

        timer.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        if (minutes === 0 && seconds === 0) {
            clearInterval(intervalId); // Stop the timer when it reaches 0
            // Optionally, you can call another function or perform some action here
        }
    }, 1000);
}

function playSound() {
    // Add your sound-playing logic here
    // For example, you can create an audio element and play it
    // Make sure to handle cross-browser compatibility and audio file formats
    // Example using an HTML5 audio element:
    const audio = new Audio('path/to/your/sound.mp3');
    audio.play();
}

// Function to create the prediction
function createPrediction(title, outcomes, predictionWindow) {
    predictionTitle.innerText = title;
    outcomes.forEach(outcome => {
        createOutcome(outcome);
    });
    startTimer(predictionWindow);
    predictionContainer.style.display = 'flex';
}

// Function to update the outcomes
function updateOutcomes(outcomes, totalPoints) {
    outcomes.forEach(outcome => {
        const outcomeElement = document.querySelector(`.outcome[data-outcome-id="${outcome.id}"]`);
        const pct = (outcome.channelPoints / totalPoints) * 100;
        const pctSpan = outcomeElement.querySelector('.pct');
        if (outcome.channelPoints === 0) {
            pctSpan.innerText = 0;
        } else {
            pctSpan.innerText = pct.toFixed(0);
            const progressBar = outcomeElement.querySelector('.progress-bar');
            progressBar.style.width = `${pct}%`;
        }
    });
}

// Function to get the current value of the counter
function getCurrentValue(id) {
    return parseInt(document.getElementById(id).innerHTML);
}

// Function to get the current 

// Function to animate the counter to a certain final value
function animateValue(id, end, duration) {
    let start = getCurrentValue(id);
    let range = end - start;
    let current = start;
    let increment = end > start ? 1 : -1;
    let stepTime = Math.abs(Math.floor(duration / range));
    let obj = document.getElementById(id);
    let timer = setInterval(function() {
        current += increment;
        obj.innerHTML = current;
        if (current == end) {
            clearInterval(timer);
        }
    }, stepTime);
}

// Function to update the total votes
function updateTotalVotes(votes) {
    totalVotes.innerText = votes;
}

// Function to update the total points
function updateTotalPoints(points) {
    if (points === totalPointsValue) {
        return;
    }
    totalPointsValue = points;
    animateValue('total-points', points, 250);
}

// Function to clear the prediction
function clearPrediction() {
    outcomesContainer.innerHTML = '';
    predictionTitle.innerText = '';
    totalVotes.innerText = 0;
    totalPoints.innerText = 0;
    predictionContainer.style.display = 'none';
}

setInterval(async () => {
    const data = await getPredictionData();
    if (data === null) {
        return;
    }
    console.log(data);
    if (data.locked === false) {
        if (!outcomeStarted) {
            outcomeStarted = true;
            createPrediction(data.title, data.outcomes, data.predictionWindow);
        } else {
            const uniqueVotes = data.outcomes.reduce((acc, outcome) => acc + outcome.users, 0);
            const totalPoints = data.outcomes.reduce((acc, outcome) => acc + outcome.channelPoints, 0);
            updateOutcomes(data.outcomes, totalPoints);
            updateTotalVotes(uniqueVotes);
            updateTotalPoints(totalPoints);
        }
    } else if (data.locked === true) {
        if (outcomeStarted) {
            clearPrediction();
            outcomeStarted = false;
            totalPointsValue = 0;
        }
    }
}, 2000);
