import React, { useEffect, useState } from 'react';
import '../styles/GUI/quotes.css';

const Quotes = () => {
    const [quotes, setQuotes] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetch('/api/quotes')
            .then((res) => res.json())
            .then((data) => 
            setQuotes(data)); 
    }, []);

    // Function to convert a date to a string
    const dateToString = (date) => {
        const dateObj = new Date(date);
        const dateString = dateObj.toLocaleDateString();
        return dateString;
    };

    const handleQuoteClick = (quoteId) => {
        console.log('Quote clicked:', quoteId);
        // You can perform additional actions based on the clicked quote's ID
    };

    // Add an event listener to the search bar to filter quotes based off the quote text or creator
    useEffect(() => {
        const filteredQuotes = quotes.filter((quote) => {
            return quote.text.toLowerCase().includes(search.toLowerCase()) || quote.creator.toLowerCase().includes(search.toLowerCase());
        });
        setQuotes(filteredQuotes);
    }, [search]);


    return (
        <div className="content">
            <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                    type="text"
                    placeholder="Search for quotes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <div className="quotes-main-container">
                <table>
                    <thead>
                        <tr className="quote-table-head">
                            <th>ID</th>
                            <th>Quote</th>
                            <th>Added On</th>
                            <th>Creator</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quotes.map((quote) => (
                            <tr key={quote.id} className='quote-container' onClick={() => handleQuoteClick(quote._id)}>
                                <td>{quote.id}</td>
                                <td className='quote'>{quote.text}</td>
                                <td>{dateToString(quote.createdAt)}</td>
                                <td>{quote.creator}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Quotes;
