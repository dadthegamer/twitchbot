import { Router } from 'express';
import { writeToLogFile } from '../../utilities/logging.js';
import { cache, usersDB, interactionsDB } from '../../config/initializers.js';

const router = Router();

// Get all the quotes
router.get('/', async (req, res) => {
    try {
        const quotes = await interactionsDB.getAllQuotes();
        res.json(quotes);
    }
    catch (err) {
        console.error('Error in GET /quotes:', err);
        writeToLogFile(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get a quote by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await interactionsDB.getQuoteById(id);
        res.json(quote);
    }
    catch (err) {
        console.error('Error in GET /quotes/:id:', err);
        writeToLogFile(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Create a quote
router.post('/', async (req, res) => {
    try {
        const { text, creator } = req.body;
        const quote = await interactionsDB.createQuote(text, creator);
        res.json(quote);
    }
    catch (err) {
        console.error('Error in POST /quotes:', err);
        writeToLogFile(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a quote
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { text, creator } = req.body;
        const quote = await interactionsDB.updateQuote(id, text, creator);
        res.json(quote);
    }
    catch (err) {
        writeToLogFile(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a quote
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const quote = await interactionsDB.deleteQuote(id);
        if (quote.acknowledged === true && quote.deletedCount === 1) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    }
    catch (err) {
        console.error('Error in DELETE /quotes/:id:', err);
        writeToLogFile(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

export default router;