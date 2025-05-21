import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDB, searchInDB } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

function highlightMatch(text, query) {
  const index = text.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return text;
  return (
    text.slice(0, index) +
    "<b>" + text.slice(index, index + query.length) + "</b>" +
    text.slice(index + query.length)
  );
}

app.get("/search", async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) return res.status(400).json({ error: "Query 'q' is required" });

  try {
    const results = await searchInDB(query);
    res.json({
      results: results.map((doc) => ({
        id: doc.id,
        name: doc.name,
        category: doc.category,
        highlights: { name: highlightMatch(doc.name, query) },
      })),
    });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const MONGODB_URI = process.env.MONGODB_URI;
connectToDB(MONGODB_URI);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
