import { serverip, serverWSport, serverPort } from '../config.js';

const quotesLink = document.getElementById('quotes-link');
const commandsLink = document.getElementById('commands-link');


const baseURL = `http://${serverip}:${serverPort}`;

quotesLink.addEventListener('click', function (event) {
    console.log('quotesLink clicked');
    event.preventDefault();
    // Got to the quotes endpoint
    window.location.href = `${baseURL}/quotes`;
});

commandsLink.addEventListener('click', function (event) {
    console.log('commandsLink clicked');
    event.preventDefault();
    // Got to the commands endpoint
    window.location.href = `${baseURL}/commands`;
});
