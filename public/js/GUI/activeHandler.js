const title = document.querySelector('title');

if (title.textContent === 'Quotes') {
    // Set the left nav bar item to active
    const quotes = document.getElementById('quotes-link');
    quotes.classList.add('active');
} else if (title.textContent === 'Commands') {
    // Set the left nav bar item to active
    const quotes = document.getElementById('commands-link');
    quotes.classList.add('active');
}