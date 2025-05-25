import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import { connectToDB, searchInDB } from "./db.js";
import { extractWords, highlightText } from "./highlightUtils.js";
import multer from "multer";
import ffmpegPath from "ffmpeg-static";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url); // Use CommonJS require
const vosk = require("vosk"); // Load native Vosk bindings using require

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

ffmpeg.setFfmpegPath(ffmpegPath);

const SAMPLE_RATE = 16000;
const MODEL_PATH = path.resolve(process.cwd(), "models/vosk");
const upload = multer({ dest: "uploads/" });

if (!fs.existsSync(MODEL_PATH)) {
  console.error(
    'Please download the model from https://alphacephei.com/vosk/models and unpack as "vosk" inside the "models" directory.'
  );
  process.exit(1);
}

const model = new vosk.Model(MODEL_PATH);

app.post("/api/transcribe", upload.single("audio"), (req, res) => {
  const audioPath = req.file.path;
  const wavPath = audioPath + ".wav";

  ffmpeg(audioPath)
    .audioCodec("pcm_s16le")
    .audioChannels(1)
    .audioFrequency(SAMPLE_RATE)
    .format("wav")
    .on("end", () => {
      const wfStream = fs.createReadStream(wavPath);
      const rec = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });

      wfStream.on("data", (data) => {
        rec.acceptWaveform(data);
      });

      wfStream.on("end", () => {
        const result = rec.finalResult();
        rec.free();
        fs.unlinkSync(audioPath);
        fs.unlinkSync(wavPath);
        res.json(result);
      });
    })
    .on("error", (err) => {
      console.error("FFmpeg error:", err);
      res.status(500).send("Audio processing error");
    })
    .save(wavPath);
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

connectToDB(MONGODB_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
  });
