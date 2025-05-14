const express = require('express');
const router = express.Router();
const Document = require('../models/document');

// POST /search
router.post('/', async (req, res) => {
  const { query } = req.body;

  if (!query || query.trim() === '') {
    return res.status(400).json({ message: 'Search query is required.' });
  }

  try {
    // Perform a text search
    const results = await Document.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    if (results.length === 0) {
      return res.status(404).json({ message: 'No matching documents found.' });
    }

    res.json(results);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'An error occurred during the search.' });
  }
});

module.exports = router;
