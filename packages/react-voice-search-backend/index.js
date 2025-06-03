import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { createRequire } from "module";
import { connectToDB, searchInDB } from "./db.js";
import { extractWords, highlightText } from "./highlightUtils.js";

const require = createRequire(import.meta.url);
const vosk = require("vosk");

const env = process.env.NODE_ENV || "dev";
const envFile = `${env}.env`;
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
const SAMPLE_RATE = process.env.SAMPLE_RATE
  ? Number(process.env.SAMPLE_RATE)
  : 16000;

const BASE_URL = process.env.BASE_URL || "localhost";

if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.warn(`Env file ${envFile} not found. Defaulting to process.env`);
}

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/transcribe" });

app.use(cors());

const MODEL_PATH = path.resolve(process.cwd(), "models/vosk");

if (!fs.existsSync(MODEL_PATH)) {
  console.error(
    'Please download the model from https://alphacephei.com/vosk/models and unpack it as "vosk" inside the "models" directory.'
  );
  process.exit(1);
}

const model = new vosk.Model(MODEL_PATH);

wss.on("connection", (ws) => {
  const recognizer = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });
  let transcript = "";

  ws.on("message", (data, isBinary) => {
    if (!isBinary) {
      console.warn("Received non-binary data. Ignored.");
      return;
    }

    const isFinal = recognizer.acceptWaveform(data);

    if (isFinal) {
      const result = recognizer.result();
      if (result.text && result.text.trim()) {
        transcript += (transcript ? " " : "") + result.text.trim();
      }

      ws.send(JSON.stringify({ final: result.text }));
    } else {
      const partial = recognizer.partialResult();

      if (partial.partial) {
        ws.send(JSON.stringify({ partial: partial.partial }));
      }
    }
  });

  ws.on("close", () => {
    if (!transcript.trim()) {
      console.warn("No speech detected during session");
    }
    recognizer.free();
  });
});

app.get("/search", async (req, res) => {
  const query = req.query.q?.trim();
  if (!query) return res.status(400).json({ error: "Query 'q' is required" });

  const queryWords = extractWords(query);
  if (!queryWords.length) return res.json({ results: [] });

  try {
    const results = await searchInDB(queryWords);
    const highlighted = results.map((doc) => ({
      id: doc.id,
      name: highlightText(doc.name, queryWords),
      category: highlightText(doc.category, queryWords),
      matchedWords: queryWords,
    }));
    res.json({ results: highlighted });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}

connectToDB(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://${BASE_URL}:${PORT}`);
      console.log(
        `WebSocket endpoint at ws://${BASE_URL}:${PORT}/ws/transcribe`
      );
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
