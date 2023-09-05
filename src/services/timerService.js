import cron from 'node-cron';

// This class manages the timers
class TimerManager {
    constructor() {
        this.timers = []; // Store timers in-memory
    }

    // Initialize timers from database when the app starts
    initializeTimersFromDatabase(timerDataFromDatabase) {
        this.timers = timerDataFromDatabase.map(timer => {
            return cron.schedule(timer.schedule, () => {
                this.executeTimerAction(timer);
            });
        });
    }

    // Add a new timer dynamically
    addTimerToSchedule(timer) {
        const newTimer = cron.schedule(timer.schedule, () => {
            this.executeTimerAction(timer);
        });

        this.timers.push(newTimer);
    }

    // Execute the action associated with a timer
    executeTimerAction(timer) {
        // Perform the action, such as sending a chat message, etc.
        console.log(`Executing timer action for: ${timer.message}`);
    }

    // Remove a timer
    removeTimerFromSchedule(timerId) {
        const timerIndex = this.timers.findIndex(timer => timer.id === timerId);
        if (timerIndex !== -1) {
            this.timers[timerIndex].destroy();
            this.timers.splice(timerIndex, 1);
        }
    }
}

export default TimerManager;
