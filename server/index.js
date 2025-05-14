import express from 'express';
import fuzzysort from 'fuzzysort';
import sampleData from './sampleData.js'; // make sure extension is included

const app = express();
const PORT = 5000;

app.get('/search', (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  const results = fuzzysort.go(query, sampleData, {
    key: 'name',
    threshold: -10000
  });

  const formattedResults = results.map(result => result.obj);
  res.json({ results: formattedResults });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
