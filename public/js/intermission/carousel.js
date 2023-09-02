const serverip = '192.168.1.31';
const serverPort = 3500;

const carouselTime = 5000;
const items = document.getElementsByClassName('carousel-item')
const carousel = document.getElementById('ads');
const latest_follower = document.getElementById('latest_follower');
const latest_follower_img = document.getElementById('latest_follower_img');
const latest_subscriber = document.getElementById('latest_subscriber');
const latest_subscriber_img = document.getElementById('latest_subscriber_img');
const latest_donation = document.getElementById('latest_donation');
const latest_donation_img = document.getElementById('latest_donation_img');
const latest_cheer = document.getElementById('latest_cheer');
const latest_cheer_img = document.getElementById('latest_cheer_img');

items[0].classList.add('active');

let activeIndex = 0;
let nextStream = null;

// Function to format a number with commas  
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Function to convert minutes to a formatted string
function formatMinutes(minutes) {
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
function convertTime(time) {
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
function convertDay(time) {
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
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Function to rotate the carousel
function rotateCarousel() {
    items[activeIndex].classList.remove('active');
    items[activeIndex].classList.add('outgoing');

    if (activeIndex === items.length - 1) {
        // Execute your function when it's the last item
        onLastItem();
    }

    activeIndex = (activeIndex + 1) % items.length;
    items[activeIndex].classList.remove('outgoing');
    items[activeIndex].classList.add('active');
}


// Function to execute when it's the last item
async function onLastItem() {
    // Your custom logic to be executed when it's the last item
    await updateStreamInfo();
    const calendar = await getCalendar();
    if (calendar.length > 0) {
        if (nextStream === null) {
            const nextEvent = calendar[0];
            createCalendarItem(nextEvent);
        }
    }
    return;
}


// Function to create a calendar carasel item
function createCalendarItem(event) {
    const calendarItem = document.createElement('div');
    calendarItem.classList.add('carousel-item');

    const calendarTitle = document.createElement('span');
    calendarTitle.textContent = 'Next Stream';

    const calendarTime = document.createElement('span');
    calendarTime.textContent = convertTime(event.startDate);

    const calendarDay = document.createElement('span');
    calendarDay.textContent = convertDay(event.startDate);

    calendarItem.appendChild(calendarTitle);
    calendarItem.appendChild(calendarTime);
    calendarItem.appendChild(calendarDay);
    carousel.appendChild(calendarItem);
    nextStream = event;
    return;
}


// Function to get the calendar from the server
async function getCalendar() {
    const response = await fetch(`http://${serverip}:${serverPort}/api/calendar/`);
    const data = await response.json();
    if (data.length > 0) {
        const nextEvent = data[0]; // Use 'data' instead of 'calendar'
        createCalendarItem(nextEvent);
    }
    return data;
}


// Function to update the stream info
async function updateStreamInfo() {
    const data = await getStreamInfo();
    const gameCategoryImg = document.getElementById('game-category-img');
    gameCategoryImg.src = data.game.boxArtURL;
    const events = data.latestEvents;
    for (const event of events) {
        const eventType = event.eventType;
        console.log(event);
        switch (eventType) {
            case 'latest_follower':
                const displayName = event.latest_follower.display_name;
                const profilePic = event.latest_follower.profile_image_url;
                latest_follower.textContent = displayName;
                latest_follower_img.src = profilePic;
                break;
            case 'latest_subscriber':
                const subDisplayName = event.latest_subscriber.display_name;
                const subProfilePic = event.latest_subscriber.profile_image_url;
                latest_subscriber.textContent = subDisplayName;
                latest_subscriber_img.src = subProfilePic;
                break;
            case 'latest_donation':
                const donationDisplayName = event.latest_donation.display_name;
                const donationProfilePic = event.latest_donation.profile_image_url;
                latest_donation.textContent = `${donationDisplayName}`;
                latest_donation_img.src = donationProfilePic;
                break;
            case 'latest_cheer':
                const cheerDisplayName = event.latest_cheer.display_name;
                const cheerProfilePic = event.latest_cheer.profile_image_url;

                latest_cheer.textContent = `${cheerDisplayName}`;
                latest_cheer_img.src = cheerProfilePic;
                break;
        }
    }
    return;
}


// Function to get the stream info from the server
async function getStreamInfo() {
    const response = await fetch(`http://${serverip}:${serverPort}/api/streamstats`);
    const data = await response.json();
    return data;
}

// Function to initialize the carousel
export function initializeCarousel() {
    console.log('Initializing carousel');
    updateStreamInfo();
    setInterval(rotateCarousel, carouselTime);
    return;
}