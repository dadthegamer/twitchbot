// Function to format a number with commas  
export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to convert minutes to a formatted string
export function formatMinutes(minutes) {
    const days = Math.floor(minutes / 1440); // 1440 mins per day
    minutes = minutes % 1440;
    const hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    let str = '';
    if (days > 0) {
        str += `${days}d `;
    }
    if (hours > 0) {
        str += `${hours}h `;
    }
    if (minutes > 0) {
        str += `${minutes}m`;
    }
    return str.trim();
}

// Function to convert a timestamp to a time of day
export function convertTime(time) {
    const date = new Date(time);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${formattedMinutes} ${ampm}`;
}

// Function to convert a timestamp to a day of the week
export function convertDay(time) {
    const date = new Date(time);
    const day = date.getDay();
    switch (day) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        default:
            return 'Saturday';
    }
}

// Function to return a promise that resolves after a specified amount of time
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


export async function fetchWithTimeout(url, options, timeout = 5000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
        ...options,
        signal: controller.signal
    });

    clearTimeout(id);
    return response;
}