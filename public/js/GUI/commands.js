const searchBar = document.querySelector(".search-bar input");
const cancelBtn = document.getElementById("cancel-button");
const mainContainer = document.querySelector('.main-container');
const newCommandContainer = document.querySelector('.new-command-main-container');
const newCommandbtn = document.getElementById('new-command-button');

// Add an event listener for the search bar to filter the commands
searchBar.addEventListener("keyup", (e) => {
    // Get the search query
    const query = e.target.value.toLowerCase();

    // Get all the commands
    const commands = document.querySelectorAll(".command-container");

    // Loop through all the commands
    commands.forEach((command) => {
        // Get the command name
        const commandName = command.querySelector(".command-name").textContent.toLowerCase();

        // Check if the command name contains the search query
        if (commandName.includes(query)) {
            // If it does, show the command
            command.style.display = "flex";
        } else {
            // If it doesn't, hide the command
            command.style.display = "none";
        }
    });
});

// Add an event listener for the cancel button
cancelBtn.addEventListener("click", () => {
    // Hide the edit command container
    newCommandContainer.classList.remove("show");
    mainContainer.classList.remove("blur");
});

// Add an event listener for the new command button
newCommandbtn.addEventListener("click", () => {
    // Show the edit command container
    newCommandContainer.classList.add("show");
    mainContainer.classList.add("blur");
});