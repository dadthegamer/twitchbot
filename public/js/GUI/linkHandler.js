export const quotesLink = document.getElementById('quotes-link');


quotesLink.addEventListener('click', function (event) {
    console.log('quotesLink clicked');
    event.preventDefault(); // Prevent the default link behavior
    // Navigate to the desired page (e.g., 'quotes.html')
    // window.location.href = 'quotes.html';
});
