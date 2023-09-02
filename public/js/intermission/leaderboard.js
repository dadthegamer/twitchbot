const serverip = '192.168.1.31';
const serverPort = 3500;

const leaderboardTime = 10000;
const leaderboard = document.getElementById('leaderboard');
const leaderboardTitle = document.getElementById('leaderboard-title');
const leaderboardDesc = document.getElementById('leaderboard-desc');

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

// Function to return a promise that resolves after a specified amount of time
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


// Function to update the leaderboard title and description
async function updateLeaderboardTitle(title, description) {
    leaderboardTitle.textContent = title;
    leaderboardDesc.textContent = description;
}


// Function to get the viewtime leaderboard from the server
async function getLeaderboard(leaderboardItem, period) {
    const response = await fetch(`http://${serverip}:${serverPort}/api/leaderboard/`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                leaderboard: leaderboardItem,
                period: period,
                count: 10
            })
        });
    const data = await response.json();
    console.log(data);
    return data;
}

// Function to display the leaderboard
async function displayLeaderboard(leaderboardData, viewtime = false) {
    if (viewtime) {
        for (let i = 0; i < leaderboardData.length; i++) {
            const user = leaderboardData[i];
            const leaderboardItem = createLeaderboardItem(user.display_name, user.profile_image_url, formatMinutes(user.amount));
            if (i === 0) {
                leaderboardItem.classList.add('first');
            }
            await wait(250);
            leaderboard.appendChild(leaderboardItem);
        }
    } else {
        for (let i = 0; i < leaderboardData.length; i++) {
            const user = leaderboardData[i];
            const leaderboardItem = createLeaderboardItem(user.display_name, user.profile_image_url, user.amount);
            if (i === 0) {
                leaderboardItem.classList.add('first');
            }
            await wait(250);
            leaderboard.appendChild(leaderboardItem);
        }
    }
}


// Function to create a leaderboard item
function createLeaderboardItem(user, profileImage, amount) {
    const alternateImageSrc = `http://${serverip}:${serverPort}/images/default-profile.png`;
    const leaderboardItem = document.createElement('div');
    leaderboardItem.classList.add('leaderboard-item');

    const leaderInfo = document.createElement('div');
    leaderInfo.classList.add('leader-info');

    const userImage = document.createElement('img');
    userImage.src = profileImage;
    userImage.addEventListener('error', function () {
        userImage.src = alternateImageSrc;
        userImage.alt = user;
    });

    const userName = document.createElement('span');
    userName.textContent = user;

    leaderInfo.appendChild(userImage);
    leaderInfo.appendChild(userName);

    const userPoints = document.createElement('span');
    userPoints.textContent = numberWithCommas(amount);

    leaderboardItem.appendChild(leaderInfo);
    leaderboardItem.appendChild(userPoints);

    return leaderboardItem;
}


// Function to remove all leaderboard items
async function clearLeaderboard() {
    const leaderboardItems = document.getElementsByClassName('leaderboard-item');
    updateLeaderboardTitle('', '');
    while (leaderboardItems.length > 0) {
        leaderboardItems[0].parentNode.removeChild(leaderboardItems[0]);
    }
}


// Function to show a leaderboard
async function showLeaderBoard(type, data) {
    clearLeaderboard();
    switch (type) {
        // Bits Leaderboard
        case 'allTimeBits':
            await updateLeaderboardTitle('Bits Leaderboard', 'Current All Time Leaderboard For Bits');
            await displayLeaderboard(data);
            break;
        case 'monthlyBits':
            await updateLeaderboardTitle('Bits Leaderboard', 'Current Monthly Leaderboard For Bits');
            await displayLeaderboard(data);
            break;
        case 'weeklyBits':
            await updateLeaderboardTitle('Bits Leaderboard', 'Current Weekly Leaderboard For Bits');
            await displayLeaderboard(data);
            break;
        case 'streamBits':
            await updateLeaderboardTitle('Bits Leaderboard', 'Current Stream Leaderboard For Bits');
            await displayLeaderboard(data);
            break;

        // Viewtime Leaderboard
        case 'alltimeViewTime':
            await updateLeaderboardTitle('View Time Leaderboard', 'Current All Time Leaderboard For Viewtime');
            await displayLeaderboard(data, true);
            break;
        case 'monthlyViewTime':
            await updateLeaderboardTitle('View Time Leaderboard', 'Current Monthly Leaderboard For Viewtime');
            await displayLeaderboard(data, true);
            break;
        case 'weeklyViewTime':
            await updateLeaderboardTitle('View Time Leaderboard', 'Current Weekly Leaderboard For Viewtime');
            await displayLeaderboard(data, true);
            break;
        case 'streamViewTime':
            updateLeaderboardTitle('View Time Leaderboard', 'Current Stream Leaderboard For Viewtime');
            await displayLeaderboard(data, true);
            break;

        // Subs Leaderboard
        case 'allTimeSubs':
            await updateLeaderboardTitle('Subs Leaderboard', 'Current All Time Leaderboard For Gifted Subs');
            await displayLeaderboard(data);
            break;
        case 'monthlySubs':
            await updateLeaderboardTitle('Subs Leaderboard', 'Current Monthly Leaderboard For Gifted Subs');
            await displayLeaderboard(data);
            break;
        case 'weeklySubs':
            await updateLeaderboardTitle('Subs Leaderboard', 'Current Weekly Leaderboard For Gifted Subs');
            await displayLeaderboard(data);
            break;
        case 'streamSubs':
            await updateLeaderboardTitle('Subs Leaderboard', 'Current Stream Leaderboard For Gifted Subs');
            await displayLeaderboard(data);
            break;

        case 'leaderboardPoints':
            await updateLeaderboardTitle('Leaderboard Points', 'Current Monthly Leaderboard Points');
            await displayLeaderboard(data);
            break;
        default:
            break;
    }
}

const leaderboards = [
    'leaderboardPoints',

    //All time leaderboards
    'alltimeViewTime',
    'allTimeBits',
    // 'allTimeSubs',

    //Monthly leaderboards
    'monthlyViewTime',
    'monthlyBits',
    // 'monthlySubs',

    //Weekly leaderboards
    'weeklyViewTime',
    'weeklyBits',
    'weeklySubs',

    //Stream leaderboards
    'streamViewTime',
    'streamBits',
    'streamSubs',
];


// Function to return the length of a leaderboard
async function getLeaderboardData(type) {
    switch (type) {
        // Bits Leaderboard
        case 'allTimeBits':
            return await getLeaderboard('bits', 'allTime');
        case 'monthlyBits':
            return await getLeaderboard('bits', 'monthly');
        case 'weeklyBits':
            return await getLeaderboard('bits', 'weekly');
        case 'streamBits':
            return await getLeaderboard('bits', 'stream');

        // Viewtime Leaderboard
        case 'alltimeViewTime':
            return await getLeaderboard('viewtime', 'allTime');
        case 'monthlyViewTime':
            return await getLeaderboard('viewtime', 'monthly');
        case 'weeklyViewTime':
            return await getLeaderboard('viewtime', 'weekly');
        case 'streamViewTime':
            return await getLeaderboard('viewtime', 'stream');

        // Subs Leaderboard
        case 'allTimeSubs':
            return getLeaderboard('subs', 'allTime');
        case 'monthlySubs':
            return await getLeaderboard('subs', 'monthly');
        case 'weeklySubs':
            return await getLeaderboard('subs', 'weekly');
        case 'streamSubs':
            return await getLeaderboard('subs', 'stream');

        // Leaderboard Points
        case 'leaderboardPoints':
            return await getLeaderboard('leaderboardPoints', 'allTime');
    }
}


// Function to initialize the leaderboard
export async function initializeLeaderboard() {
    let currentLeaderboardIndex = 0;

    async function fetchAndShowLeaderboard() {
        if (currentLeaderboardIndex >= leaderboards.length) {
            currentLeaderboardIndex = 0;
        }

        console.log(`Showing ${currentLeaderboardIndex}`);
        const currentLeaderboard = leaderboards[currentLeaderboardIndex];
        const data = await getLeaderboardData(currentLeaderboard);
        currentLeaderboardIndex++;

        if (data.length > 0) {
            await showLeaderBoard(currentLeaderboard, data);
            setTimeout(fetchAndShowLeaderboard, leaderboardTime); // Wait 5 seconds if there is data.
        } else {
            fetchAndShowLeaderboard(); // Immediately go to the next index if there is no data.
        }
    }

    fetchAndShowLeaderboard(); // Initial call to start the process.
}
