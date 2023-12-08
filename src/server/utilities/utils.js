import crypto from 'crypto';

// Function to format time from minutes to a string
export async function formatTimeFromMinutes(minToFormat) {
    const years = Math.floor(minToFormat / 525600);
    // Calculate the months by subtracting the years from the minutes and dividing by 43800
    const months = Math.floor((minToFormat - (years * 525600)) / 43800);
    // Calculate the days by subtracting the years and months from the minutes and dividing by 1440
    const days = Math.floor((minToFormat - (years * 525600) - (months * 43800)) / 1440);
    // Calculate the hours by subtracting the years, months, and days from the minutes and dividing by 60
    const hours = Math.floor((minToFormat - (years * 525600) - (months * 43800) - (days * 1440)) / 60);
    // Calculate the minutes by subtracting the years, months, days, and hours from the minutes
    const minutes = Math.floor(minToFormat - (years * 525600) - (months * 43800) - (days * 1440) - (hours * 60));
    const time = [];
    if (years > 0) {
        time.push(`${years} years`);
    }
    if (months > 0) {
        time.push(`${months} months`);
    }
    if (days > 0) {
        time.push(`${days} days`);
    }
    if (hours > 0) {
        time.push(`${hours} hours`);
    }
    if (minutes > 0) {
        time.push(`${minutes} minutes`);
    }
    return time.join(', ');
}

// Function to format time from milliseconds to a string
export async function formatTimeFromMilliseconds(milliseconds) {
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
export async function formatRank(number) {
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
export async function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function that returns a whole number between two numbers
export async function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to calculate the uptime of a stream
export async function calculateUptime(startDate) {
    const currentDate = new Date();
    const uptime = currentDate - startDate;
    return uptime;
}

// Function to convert ms to minutes
export async function msToMinutes(ms) {
    return ms / 1000 / 60;
}

// Function to generate a random API key
export async function generateApiKey(length = 32) {
    return crypto.randomBytes(length).toString('hex');
}