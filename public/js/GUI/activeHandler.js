const title = document.querySelector('title');

if (title.textContent === 'User Management') {
    // Set the left nav bar item to active
    const users = document.getElementById('users');
    users.classList.add('active');
} else if (title.textContent === 'Commands') {
    // Set the left nav bar item to active
    const quotes = document.getElementById('commands-link');
    quotes.classList.add('active');
}