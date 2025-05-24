import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { connectToDB, searchInDB } from "./db.js";
import { extractWords, highlightText } from "./highlightUtils.js";

const env = process.env.NODE_ENV || "dev";
const envFile = `${env}.env`;

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
  console.log(`Loaded config from ${envFile}`);
} else {
  console.warn(`Env file ${envFile} not found. Defaulting to process.env`);
}

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

app.get("/search", async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) return res.status(400).json({ error: "Query 'q' is required" });

  const queryWords = extractWords(query);
  if (!queryWords.length) return res.json({ results: [] });

  try {
    const results = await searchInDB(queryWords);
    const matchedWords = extractWords(query);
    const highlighted = results.map((doc) => ({
      id: doc.id,
      name: highlightText(doc.name, queryWords),
      category: highlightText(doc.category, queryWords),
      matchedWords,
    }));
    res.json({ results: highlighted });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const MONGODB_URI = process.env.MONGODB_URI;

connectToDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
