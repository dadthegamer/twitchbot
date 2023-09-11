import { serverip, serverWSport, serverPort } from '../config.js'

const usersContainer = document.querySelector('.users-container');
const searchBar = document.querySelector('.search-bar input');
const closeButton = document.getElementById('close-button');
const userInfoContainer = document.querySelector('.user-info-container');
const mainContainer = document.querySelector('.main-container');
const editableCells = document.querySelectorAll('.editable');
const username = document.getElementById('username');
const userimg = document.getElementById('userimg');
const table = document.getElementById("user-table");
const submitButton = document.getElementById('submit-changes');
let users = [];
let batchedUpdates = {};

// Submit button event listener
submitButton.addEventListener('click', async () => {
    // Get the user id that was clicked on and get the user data from the server then remove the class of blur from the main container and hide the user info container
    const userId = userInfoContainer.dataset.id;
    console.log(`Updating user ${userId} with batched updates: ${JSON.stringify(batchedUpdates)}`)
    mainContainer.classList.remove('blur');
    userInfoContainer.classList.remove('show');
    await updateUserData(userId, batchedUpdates);
});


// Close button event listener
closeButton.addEventListener('click', () => {
    // Get the user id that was clicked on and get the user data from the server then remove the class of blur from the main container and hide the user info container
    mainContainer.classList.remove('blur');
    userInfoContainer.classList.remove('show');
    batchedUpdates = {};
});

searchBar.addEventListener('keyup', (e) => {
    const searchString = e.target.value.toLowerCase();

    const filteredUsers = users.filter((user) => {
        return (
            user.display_name.toLowerCase().includes(searchString) ||
            user.display_name.toLowerCase().includes(searchString)
        );
    });
    displayUsers(filteredUsers);
});

// Function to display the filtered users and add event listeners to each user div
const displayUsers = (users) => {
    const htmlString = users
        .map((user) => {
            return `
        <div class="user-container" data-id=${user.id}>
            <img src=${user.profile_image_url} alt="User Image" />
            <span class="username">${user.display_name}</span>
        </div>
        `;
        })
        .join('');
    usersContainer.innerHTML = htmlString;

    // Add event listeners to each user div
    const userDivs = document.querySelectorAll('.user-container');
    userDivs.forEach((userDiv) => {
        userDiv.addEventListener('click', async () => {
            // Get the user id that was clicked on and get the user data from the server
            const userId = userDiv.dataset.id;
            const user = await getUser(userId);
            console.log(user);
            updateUserInfo(user);
            // Add the class of blur to the main container
            mainContainer.classList.add('blur');
            // Show the user info container
            userInfoContainer.classList.add('show');
        });
    });
};

// Function to create a new user div
function createUserDiv(user) {
    const userDiv = document.createElement('div');
    userDiv.classList.add('user-container');
    userDiv.dataset.id = user.id;

    const userImage = document.createElement('img');
    userImage.src = user.profile_image_url;
    userImage.alt = 'User Image';

    const userName = document.createElement('span');
    userName.classList.add('username');
    userName.textContent = user.display_name;

    userDiv.appendChild(userImage);
    userDiv.appendChild(userName);

    userDiv.addEventListener('click', async () => {
        // Get the user id that was clicked on and get the user data from the server
        const userId = userDiv.dataset.id;
        const user = await getUser(userId);
        console.log(user);
        updateUserInfo(user);
        // Add the class of blur to the main container
        mainContainer.classList.add('blur');
        // Show the user info container
        userInfoContainer.classList.add('show');
    });

    usersContainer.appendChild(userDiv);
}

// Function to get all the users from the server
async function getAllUsers() {
    const response = await fetch(`http://${serverip}:${serverPort}/api/users`);
    const data = await response.json();
    // Sort the data alphabetically
    data.sort((a, b) => {
        return a.display_name.localeCompare(b.display_name);
    });
    users = data;

    // For each user, create a new div
    data.forEach((user) => {
        createUserDiv(user);
    });
}

// Function to get a single user from the server
async function getUser(id) {
    const response = await fetch(`http://${serverip}:${serverPort}/api/users/${id}`);
    const data = await response.json();
    return data;
}


// Add click event listeners to each editable cell
editableCells.forEach(cell => {
    cell.addEventListener('click', function () {
        // Create an input element
        const input = document.createElement('input');
        input.value = this.textContent;
        const cellId = this.id;
        const userId = userInfoContainer.dataset.id;

        // Replace the cell's content with the input
        this.innerHTML = '';
        this.appendChild(input);

        // Focus on the input
        input.focus();

        // Add an event listener to save changes when the input loses focus
        input.addEventListener('blur', function () {
            // Update the cell's content with the new value
            const newValue = this.value;
            this.parentElement.textContent = newValue;
            // Get the cell's id
            // Update the user data on the server
            batchedUpdates[cellId] = newValue;

            // Check if the submit button has a class of showing and if it doesn't add it
            if (!submitButton.classList.contains('showing')) {
                submitButton.classList.add('showing');
            }
        });
    });
});

// Function to update the user info container
async function updateUserInfo(user) {
    userInfoContainer.dataset.id = user.id;
    username.textContent = user.display_name;
    userimg.src = user.profile_image_url;
    await updateViewTimeData(user);
    await updateSubsData(user);
    await updateBitsData(user);
    await updateDonationsData(user);
}


// Function to update the view time table data
async function updateViewTimeData(data) {
    // Update the 2nd row of the view view time row
    const row = table.rows[1];
    row.cells[5].textContent = data.view_time;
    // if yearly_view_time is not null update the row
    if (data.yearly_view_time) {
        row.cells[4].textContent = data.yearly_view_time;
    }

    // if monthy_view_time is not null update the row
    if (data.monthly_view_time) {
        row.cells[3].textContent = data.monthly_view_time;
    }

    // if weekly_view_time is not null update the row
    if (data.weekly_view_time) {
        row.cells[2].textContent = data.weekly_view_time;
    }

    // if stream_view_time is not null update the row
    if (data.stream_view_time) {
        row.cells[1].textContent = data.stream_view_time;
    }
}

// Function to update the subs table data
async function updateSubsData(data) {
    // Update the 2nd row of the view view time row
    const row = table.rows[2];
    if (data.all_time_subs) {
        row.cells[5].textContent = data.all_time_subs;
    }
    
    // if yearly_view_time is not null update the row
    if (data.yearly_subs) {
        row.cells[4].textContent = data.yearly_subs;
    }

    // if monthy_view_time is not null update the row
    if (data.monthly_subs) {
        row.cells[3].textContent = data.monthly_subs;
    }

    // if weekly_view_time is not null update the row
    if (data.weekly_subs) {
        row.cells[2].textContent = data.weekly_subs;
    }

    // if stream_view_time is not null update the row
    if (data.stream_subs) {
        row.cells[1].textContent = data.stream_subs;
    }
}

// Function to update the bits table data
async function updateBitsData(data) {
    // Update the 2nd row of the view view time row
    const row = table.rows[3];

    if (data.all_time_bits) {
        row.cells[5].textContent = data.all_time_bits;
    }

    // if yearly_view_time is not null update the row
    if (data.yearly_bits) {
        row.cells[4].textContent = data.yearly_bits;
    }

    // if monthy_view_time is not null update the row
    if (data.monthly_bits) {
        row.cells[3].textContent = data.monthly_bits;
    }

    // if weekly_view_time is not null update the row
    if (data.weekly_bits) {
        row.cells[2].textContent = data.weekly_bits;
    }

    // if stream_view_time is not null update the row
    if (data.stream_bits) {
        row.cells[1].textContent = data.stream_bits;
    }
}

// Function to update the donations table data
async function updateDonationsData(data) {
    // Update the 2nd row of the view view time row
    const row = table.rows[4];
    if (data.all_time_donations) {
        row.cells[5].textContent = data.all_time_donations;
    }
    // if yearly_view_time is not null update the row
    if (data.yearly_donations) {
        row.cells[4].textContent = data.yearly_donations;
    }

    // if monthy_view_time is not null update the row
    if (data.monthly_donations) {
        row.cells[3].textContent = data.monthly_donations;
    }

    // if weekly_view_time is not null update the row
    if (data.weekly_donations) {
        row.cells[2].textContent = data.weekly_donations;
    }

    // if stream_view_time is not null update the row
    if (data.stream_donations) {
        row.cells[1].textContent = data.stream_donations;
    }
}


// Function to update the user data on the server with batched updates
async function updateUserData(userId, batchedUpdates) {
    // Send the batched updates to the server
    await sendBatchedUpdates(userId, batchedUpdates);
    
    // Clear the batchedUpdates object for the next batch
    batchedUpdates = {};
}

// Function to send batched updates to the server
async function sendBatchedUpdates(userId, updates) {
    const response = await fetch(`http://${serverip}:${serverPort}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates),
    });
    const resData = await response.json();
    // Hide the submit button
    submitButton.classList.remove('showing');
}

getAllUsers();