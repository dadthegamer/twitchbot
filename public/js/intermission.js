import { initializeLeaderboard } from './intermission/leaderboard.js';
import { initializeCarousel } from './intermission/carousel.js';


console.log('DOM fully loaded and parsed');
startTimer();
initializeLeaderboard();
initializeCarousel();


// Function to start the timer
function startTimer() {
    const uptimeElement = document.getElementById('uptime');
    let totalSeconds = 0;

    function formatTime(time) {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor((time % 3600) / 60);
        const seconds = time % 60;

        const formattedHours = hours > 0 ? hours.toString().padStart(2, '0') + ':' : '';
        const formattedMinutes = minutes > 0 ? minutes.toString().padStart(2, '0') + ':' : '';
        const formattedSeconds = seconds.toString().padStart(2, '0');

        return formattedHours + formattedMinutes + formattedSeconds;
    }


    function updateTimer() {
        uptimeElement.textContent = formatTime(totalSeconds);
        totalSeconds++;
    }
    updateTimer();
    setInterval(updateTimer, 1000);
}
