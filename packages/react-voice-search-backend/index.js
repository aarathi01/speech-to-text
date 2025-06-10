import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import http from "http";
import { WebSocketServer } from "ws";
import { createRequire } from "module";
import connectToDB from "./utils/db.js";
import searchRoutes from "./routes/searchRoutes.js";
import { initializeWebSocket } from "./services/transcriptionService.js";
import errorHandler from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import { MONGODB_URI, PORT, BASE_URL } from "./utils/config.js";

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/ws/transcribe" });

app.use(cors());
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/search", searchRoutes);
app.use(errorHandler);

let vosk;
try {
  const require = createRequire(import.meta.url);
  vosk = require("vosk");
} catch (err) {
  console.error("Failed to load Vosk:", err);
  process.exit(1);
}
const MODEL_PATH = path.resolve(process.cwd(), "models/vosk");

if (!fs.existsSync(MODEL_PATH)) {
  console.error("Model not found at ", MODEL_PATH);
  console.error(
    'Please download the model from https://alphacephei.com/vosk/models and unpack it as "vosk" inside the "models" directory.'
  );
  process.exit(1);
}

const model = new vosk.Model(MODEL_PATH);
initializeWebSocket(wss, model);
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set.");
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
