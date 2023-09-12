const quotesLink = document.getElementById('quotes-link');
const commandsLink = document.getElementById('commands-link');


quotesLink.addEventListener('click', function (event) {
    console.log('quotesLink clicked');
    event.preventDefault();
    // Got to the quotes endpoint
    window.location.href = '/quotes';
});

commandsLink.addEventListener('click', function (event) {
    console.log('commandsLink clicked');
    event.preventDefault();
    // Got to the commands endpoint
    window.location.href = '/commands';
});
