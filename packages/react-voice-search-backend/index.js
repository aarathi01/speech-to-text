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

const require = createRequire(import.meta.url);
const vosk = require("vosk");

const env = process.env.NODE_ENV || "dev";
const envFile = `${env}.env`;
const PORT = process.env.PORT ? Number(process.env.PORT) : 5000;
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
app.use("/search", searchRoutes);
app.use(errorHandler);

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

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
  process.exit(1);
}

connectToDB(MONGODB_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at http://${BASE_URL}:${PORT}`);
      console.log(`WebSocket endpoint at ws://${BASE_URL}:${PORT}/ws/transcribe`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
  });
  