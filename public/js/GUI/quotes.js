import { serverip, serverWSport, serverPort } from '../config.js';

const searchBar = document.querySelector(".search-bar input");
const quoteTable = document.querySelector('.quotes-main-container table');
const editQuote = document.querySelector('.edit-quote-container');
const mainContainer = document.querySelector('.main-container');
const closeButton = document.getElementById('close-button');
const saveButton = document.getElementById('quote-save');
const deleteButton = document.getElementById('quote-delete');

searchBar.addEventListener("keyup", (e) => {
    const term = e.target.value.toLowerCase();
    const quotes = document.querySelectorAll(".quote-container");
    quotes.forEach(quote => {
        const quoteText = quote.children[1].textContent.toLowerCase();
        const quoteCreator = quote.querySelector("th:nth-child(4)").textContent.toLowerCase();
        if (quoteText.includes(term) || quoteCreator.includes(term)) {
            quote.style.display = "table-row";
        } else {
            quote.style.display = "none";
        }
    });
});

// Save button event listener
saveButton.addEventListener('click', async () => {
    // Get the quote id, text, date, and creator
    const quoteId = document.getElementById('quote-id').placeholder;
    const quoteText = document.getElementById('quote-text').value;
    const quoteDate = document.getElementById('quote-date').placeholder;
    const quoteCreator = document.getElementById('quote-creator').value;
    updateQuote(quoteId, quoteText, quoteCreator);
});

// Delete button event listener
deleteButton.addEventListener('click', async () => {
    // Get the quote id
    const quoteId = document.getElementById('quote-id').placeholder;
    deleteQuote(quoteId);
});

// Function to update a quote on the server
async function updateQuote(id, text, creator) {
    try {
        const response = await fetch(`http://${serverip}:${serverPort}/api/quotes/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: text, creator: creator })
        });
        const quote = await response.json();
        return quote;
    }
    catch (err) {
        console.error('Error in updateQuote:', err);
    }
}

// Function to delete a quote from the server
async function deleteQuote(id) {
    try {
        const response = await fetch(`http://${serverip}:${serverPort}/api/quotes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const quote = await response.json();
        if (quote.success === true) {
            const quoteContainer = document.querySelector(`[data-id="${id}"]`);
            quoteContainer.remove();
            editQuote.classList.remove('show');
            mainContainer.classList.remove('blur');
        }
        return quote;
    }
    catch (err) {
        console.error('Error in deleteQuote:', err);
    }
}


// Function to convert a date to a string
function dateToString(date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${month}-${day}`;
}


// Close button event listener
closeButton.addEventListener('click', () => {
    // Get the user id that was clicked on and get the user data from the server then remove the class of blur from the main container and hide the user info container
    mainContainer.classList.remove('blur');
    editQuote.classList.remove('show');
});


// Function to get all the quotes from the server
async function getQuotes() {
    try {
        const response = await fetch(`http://${serverip}:${serverPort}/api/quotes`);
        const quotes = await response.json();
        console.log(quotes);
        // For each quote, create a quote container and append it to the quote table
        quotes.forEach(quote => {
            const quoteContainer = createQuote(quote);
            quoteTable.appendChild(quoteContainer);
        });
    }
    catch (err) {
        console.error('Error in getQuotes:', err);
    }
}

// Function to create a quote using DOM
function createQuote(quote) {
    let quoteContainer = document.createElement("tr");
    quoteContainer.classList.add("quote-container");
    quoteContainer.dataset.id = quote.id;

    let quoteID = document.createElement("th");
    quoteID.innerHTML = quote.id;

    let quoteText = document.createElement("th");
    quoteText.classList.add("quote");
    quoteText.innerHTML = quote.text;

    let quoteDate = document.createElement("th");
    quoteDate.innerHTML = dateToString(new Date(quote.createdAt));

    let quoteCreator = document.createElement("th");
    quoteCreator.innerHTML = quote.creator;

    let quoteOptions = document.createElement("th");
    quoteOptions.innerHTML = "<i class='fa-solid fa-chevron-right'></i>";

    quoteContainer.appendChild(quoteID);
    quoteContainer.appendChild(quoteText);
    quoteContainer.appendChild(quoteDate);
    quoteContainer.appendChild(quoteCreator);
    quoteContainer.appendChild(quoteOptions);

    quoteContainer.addEventListener("click", () => {

        const quoteId = document.getElementById('quote-id');
        const quoteText = document.getElementById('quote-text');
        const quoteDate = document.getElementById('quote-date');
        const quoteCreator = document.getElementById('quote-creator');

        // Get the quote ID
        const containerQuoteID = quoteContainer.dataset.id;
        quoteId.placeholder = containerQuoteID;

        // Get the quote text
        const containerQuoteText = quoteContainer.querySelector('.quote').textContent;
        quoteText.value = containerQuoteText;

        // Get the quote date
        const containerQuoteDate = quoteContainer.querySelector('th:nth-child(3)').textContent;
        quoteDate.placeholder = containerQuoteDate;

        // Get the quote creator
        const containerQuoteCreator = quoteContainer.querySelector('th:nth-child(4)').textContent;
        quoteCreator.value = containerQuoteCreator;

        editQuote.classList.add('show');
        mainContainer.classList.add('blur');

    });

    return quoteContainer;
}


getQuotes();