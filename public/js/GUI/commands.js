const mainContainer = document.querySelector('.main-container');
const commandButtons = document.querySelectorAll('.command-options');
const newCommandButton = document.getElementById('new-command-btn');
const newCommandWindow = document.getElementById('new-command-window');
const cancelNewCommand = document.getElementById('close-new-command');
const saveBtn = document.getElementById('save-new-command');
const errorMessage = document.getElementById('error-message');
const searchCommandsInput = document.getElementById('search-commands');

let idCounter = 0;
let editingCommand = false;

// Get form data
const nameInput = document.getElementById('command-name');
const responseInput = document.getElementById('command-response');
const permissionsSelect = document.getElementById('command-permissions');
const userCooldownInput = document.getElementById('command-user-cooldown');
const globalCooldownInput = document.getElementById('command-global-cooldown');
const descriptionInput = document.getElementById('command-description');

function showError(msg) {
    console.log(msg);
    errorMessage.innerText = msg;
    errorMessage.style.display = 'block';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 3000);
}

function createCommand(name, enabled) {
    // Create main div
    const div = document.createElement('div');
    div.classList.add('command');

    // Create command-name
    const commandName = document.createElement('div');
    commandName.classList.add('command-name');
    const iconPlay = document.createElement('i');
    iconPlay.classList.add('fa-solid', 'fa-play');
    const span = document.createElement('span');
    span.textContent = name;
    commandName.appendChild(iconPlay);
    commandName.appendChild(span);

    // Create command-right
    const commandRight = document.createElement('div');
    commandRight.classList.add('command-right');

    // Create toggle-switch
    const toggleSwitch = document.createElement('div');
    toggleSwitch.classList.add('toggle-switch');
    const toggleInput = document.createElement('input');
    toggleInput.classList.add('toggle-input');
    toggleInput.type = 'checkbox';
    toggleInput.id = 'toggle'; // Consider creating a unique id if you have multiple commands
    toggleInput.checked = enabled; // Set the checked property based on the enabled flag
    const toggleLabel = document.createElement('label');
    toggleLabel.classList.add('toggle-label');
    toggleLabel.htmlFor = 'toggle'; // Matches the id of toggleInput
    toggleSwitch.appendChild(toggleInput);
    toggleSwitch.appendChild(toggleLabel);

    const uniqueToggleId = `toggle-${idCounter++}`;
    toggleInput.id = uniqueToggleId;
    toggleLabel.htmlFor = uniqueToggleId;

    toggleInput.addEventListener('change', function () {
        const isEnabled = this.checked;  // 'this' refers to the toggleInput element
        // Data you might want to send to the server
        const dataToSend = {
            enabled: isEnabled  // The new state of the command
        };

        // Send data to the server
        fetch(`http://localhost:3001/api/commands/${name}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);  // Handle the response, if needed
            })
            .catch(error => {
                console.error("There was an error sending the data", error);
            });
    });

    // Create command-options button
    const commandOptions = document.createElement('button');
    commandOptions.classList.add('command-options');
    const iconEllipsis = document.createElement('i');
    iconEllipsis.classList.add('fa-solid', 'fa-ellipsis-vertical');
    commandOptions.appendChild(iconEllipsis);

    // Create command-menu
    const commandMenu = document.createElement('div');
    commandMenu.classList.add('command-menu');
    // Edit option
    const editDiv = document.createElement('div');
    const iconEdit = document.createElement('i');
    iconEdit.classList.add('fa-solid', 'fa-pen-to-square');
    const editLink = document.createElement('a');
    editLink.href = '#';
    editLink.textContent = 'Edit';
    editDiv.appendChild(iconEdit);
    editDiv.appendChild(editLink);
    editDiv.addEventListener('click', function () {
        // Get the command from the server
        fetch(`http://localhost:3001/api/commands/${name}`)
            .then(response => response.json())
            .then(command => {
                // Populate the form with the command data
                nameInput.value = command.name;
                responseInput.value = command.handlers[0].response;
                permissionsSelect.value = command.permissions;
                userCooldownInput.value = command.userCooldown;
                globalCooldownInput.value = command.globalCooldown;
                descriptionInput.value = command.description;
                // Show the new command window
                newCommandWindow.classList.toggle('new-command-window-active');
                mainContainer.classList.toggle('main-container-blur');
                // Hide the command menu
                commandMenu.classList.remove('command-menu-active');
                editingCommand = true;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    commandMenu.appendChild(editDiv);
    // Delete option
    const deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete-command');
    const iconDelete = document.createElement('i');
    iconDelete.classList.add('fa-solid', 'fa-trash');
    const deleteLink = document.createElement('a');
    deleteLink.href = '#';
    deleteLink.textContent = 'Delete';
    deleteDiv.appendChild(iconDelete);
    deleteDiv.appendChild(deleteLink);
    deleteDiv.addEventListener('click', function () {
        // Delete the command from the server
        fetch(`http://localhost:3001/api/commands/${name}`, {
            method: 'DELETE'
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data.deleted === true) {
                    div.remove();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
    commandMenu.appendChild(deleteDiv);

    // Add event listener to the command-options button
    commandOptions.addEventListener('click', function () {
        commandMenu.classList.toggle('command-menu-active');
    });

    // Append to command-right
    commandRight.appendChild(toggleSwitch);
    commandRight.appendChild(commandOptions);
    commandRight.appendChild(commandMenu);

    // Append to main div
    div.appendChild(commandName);
    div.appendChild(commandRight);

    // Append to container (assuming container already exists in the DOM)
    const container = document.querySelector('.commands-container');
    container.appendChild(div);
}

// Function to get all the commands from the server
async function getAllCommands() {
    fetch('/api/commands')
        .then(response => response.json())
        .then(commands => {
            commands.forEach(command => {
                createCommand(command.name, command.enabled);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}



document.addEventListener('DOMContentLoaded', async function () {
    await getAllCommands();

    searchCommandsInput.addEventListener('input', function () {
        const searchValue = searchCommandsInput.value.toLowerCase();
        const commands = document.querySelectorAll('.command');
        commands.forEach(command => {
            const commandName = command.querySelector('.command-name span').textContent.toLowerCase();
            if (commandName.includes(searchValue)) {
                command.style.display = 'flex';
            } else {
                command.style.display = 'none';
            }
        });
    });

    commandButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Toggle the command-menu for the current command
            const menu = button.nextElementSibling;
            menu.classList.toggle('command-menu-active');

            // Optionally: Hide other open menus
            commandButtons.forEach(otherButton => {
                if (otherButton !== button) {
                    const otherMenu = otherButton.nextElementSibling;
                    otherMenu.classList.remove('command-menu-active');
                }
            });
        });
    });

    // Close the menu if clicked outside
    document.addEventListener('click', function (event) {
        if (!event.target.closest('.command-options') && !event.target.closest('.command-menu')) {
            document.querySelectorAll('.command-menu').forEach(menu => {
                menu.classList.remove('command-menu-active');
            });
        }
    });

    // Add event listener to the new command button
    newCommandButton.addEventListener('click', function () {
        editingCommand = false;
        newCommandWindow.classList.toggle('new-command-window-active');
        mainContainer.classList.toggle('main-container-blur');
    });

    // Add event listener to the cancel button
    cancelNewCommand.addEventListener('click', function () {
        newCommandWindow.classList.toggle('new-command-window-active');
        mainContainer.classList.toggle('main-container-blur');
        if (editingCommand) {
            // Clear the form
            nameInput.value = '';
            responseInput.value = '';
            permissionsSelect.value = 'everyone';
            userCooldownInput.value = 0;
            globalCooldownInput.value = 0;
            descriptionInput.value = '';
            editingCommand = false;
        } else {
            // Clear the form
            nameInput.value = '';
            responseInput.value = '';
            permissionsSelect.value = 'everyone';
            userCooldownInput.value = 0;
            globalCooldownInput.value = 0;
            descriptionInput.value = '';
        }
    });

    saveBtn.addEventListener('click', () => {
        // Get form data
        const name = nameInput.value;
        const response = responseInput.value;
        const permissions = permissionsSelect.value;
        const userCooldown = userCooldownInput.value;
        const globalCooldown = globalCooldownInput.value;
        const description = descriptionInput.value;

        let isValid = true;

        if (!name) {
            isValid = false;
            showError('Name is required');
        }

        if (!response) {
            isValid = false;
            showError('Response is required');
        }
        // And so on for other fields
        if (!isValid) {
            return; // Stop submission
        }

        // Create data object
        const data = {
            name,
            handlers: [
                {
                    type: 'chat',
                    response
                }
            ],
            permissions,
            userCooldown,
            globalCooldown,
            description,
        };
        // Submit to API
        if (editingCommand) {
            // Update the command
            fetch(`/api/commands/${name}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        console.log('Command updated successfully!');
                        newCommandWindow.classList.toggle('new-command-window-active');
                        mainContainer.classList.toggle('main-container-blur');
                        // Clear the form
                        nameInput.value = '';
                        responseInput.value = '';
                        permissionsSelect.value = 'everyone';
                        userCooldownInput.value = 0;
                        globalCooldownInput.value = 0;
                        descriptionInput.value = '';
                        editingCommand = false;
                    } else {
                        console.error('Error updating command');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            return;
        } else {
            fetch('/api/commands', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    if (response.ok) {
                        createCommand(name, true);
                        console.log('Command created successfully!');
                        newCommandWindow.classList.toggle('new-command-window-active');
                        mainContainer.classList.toggle('main-container-blur');
                        // Clear the form
                        nameInput.value = '';
                        responseInput.value = '';
                        permissionsSelect.value = 'everyone';
                        userCooldownInput.value = 0;
                        globalCooldownInput.value = 0;
                        descriptionInput.value = '';
                    } else {
                        console.error('Error creating command');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    });
});
