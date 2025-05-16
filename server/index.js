import express from "express";
import cors from "cors";
import fuzzysort from "fuzzysort";
import sampleData from "./sampleData.js";

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

function highlightMatch(text, indexes) {
  if (!indexes || indexes.length === 0) return text;

  let result = "";
  let lastIndex = 0;

  indexes.forEach((index) => {
    result += text.substring(lastIndex, index);
    result += "<b>" + text.charAt(index) + "</b>";
    lastIndex = index + 1;
  });

  result += text.substring(lastIndex);
  return result;
}

app.get("/search", (req, res) => {
  try {
    const query = req.query.q?.toString().trim();

    if (!query) {
      return res
        .status(400)
        .json({ error: 'Query parameter "q" is required and cannot be empty' });
    }

    // Perform fuzzy search
    const results = fuzzysort.go(query, sampleData, {
      keys: ["name", "category"],
      threshold: -10000,
      limit: 20,
      all: true,
    });

    if (!results.length) {
      return res.json({ results: [], message: "No results found" });
    }

    const formattedResults = results
      .filter((r) => r.score !== null)
      .map((r) => ({
        id: r.obj.id,
        name: r.obj.name,
        category: r.obj.category,
        score: -r.score,
        highlights: {
          name: highlightMatch(r.obj.name, r.indexes),
        },
      }));

    res.json({ results: formattedResults });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
