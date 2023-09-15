// Function to format time from minutes to a string
export function formatTimeFromMinutes(minToFormat) {
    const seconds = Math.floor(minToFormat * 60);
    const hours = Math.floor(minToFormat / 60);
    const days = Math.floor(hours / 24);
    const minutes = Math.floor(minToFormat % 60);
    const time = [];
    if (days > 0) {
        time.push(`${days} days`);
    }
    if (hours > 0) {
        time.push(`${hours % 24} hours`);
    }
    if (minutes > 0) {
        time.push(`${minutes % 60} minutes`);
    }
    return time.join(', ');
}

// Function to format time from milliseconds to a string
export function formatTimeFromMilliseconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const time = [];
    if (days > 0) {
        time.push(`${days} days`);
    }
    if (hours > 0) {
        time.push(`${hours % 24} hours`);
    }
    if (minutes > 0) {
        time.push(`${minutes % 60} minutes`);
    }
    if (seconds > 0) {
        time.push(`${seconds % 60} seconds`);
    }
    return time.join(', ');
}

// Function to format the last digit of a number to a rank
export function formatRank(number) {
    const lastDigit = number % 10;
    if (lastDigit === 1) {
        return `${number}st`;
    } else if (lastDigit === 2) {
        return `${number}nd`;
    } else if (lastDigit === 3) {
        return `${number}rd`;
    } else {
        return `${number}th`;
    }
}

// Function to format a number with commas
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function that returns a whole number between two numbers
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to calculate the uptime of a stream
export function calculateUptime(startDate) {
    const currentDate = new Date();
    const uptime = currentDate - startDate;
    return uptime;
}

// Function to convert ms to minutes
export function msToMinutes(ms) {
    return ms / 1000 / 60;
}