import React, { useState, useEffect } from 'react';
import '../../../styles/overlay/bottomLeft.css';


function RandomQuote() {
    const [quote, setQuote] = useState('');
    const [creator, setCreator] = useState('');
    const [showCard, setShowCard] = useState(true);
    const [createdDate, setCreatedDate] = useState('');
    const [quoteId, setQuoteId] = useState('');

    useEffect(() => {
        fetch('/api/quotes')
            .then((res) => res.json())
            .then((data) => {
                // Get a random quote from the list of quotes
                const randomQuote = data[Math.floor(Math.random() * data.length)];
                console.log(randomQuote);
                setQuote(randomQuote.text);
                setCreator(randomQuote.creator);
                setCreatedDate(formatDate(new Date(randomQuote.createdAt)));
                setQuoteId(randomQuote.id);
            });
    }, []);

    // Function to format a date to a string
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    return (
        <div className='bottom-left-card'>
            {showCard && (
                <>
                    <span className='bottom-left-label'>Random Quote</span>
                    <div className='random-quote-bottom-left-container'>
                        <span>"{quote}"</span>
                        <span>-{creator}</span>
                    </div>
                    <span className='bottom-left-quote-created'>{createdDate}</span>
                    <span className='bottom-left-quote-id'>Quote: {quoteId}</span>
                </>
            )}
        </div>
    );
}

export default RandomQuote;