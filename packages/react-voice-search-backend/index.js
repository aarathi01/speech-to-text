import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import http from "http";
import path from "path";
import vosk from "vosk";
import { WebSocketServer } from "ws";

import { errorHandler } from "./middlewares/errorHandler.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import { initializeWebSocket } from "./services/transcriptionService.js";
import { BASE_URL,MONGODB_URI, PORT } from "./utils/config.js";
import connectToDB from "./utils/db.js";
import { initSuperAdmin } from "./utils/initSuperAdmin.js";

// Setup and Middleware
dotenv.config(); //Loads .env values
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;

// Creates an Express app and an HTTP server (used for both REST + WebSocket)
// We need the raw HTTP server to attach a WebSocket server (wss) to it. Express alone doesn’t expose the underlying HTTP server needed for ws.
const app = express();
const server = http.createServer(app);

// WebSocket server listening for /api/ws/transcribe
// WebSockets allow real-time streaming of microphone audio data to the backend, which is essential for low-latency speech recognition. HTTP isn't suitable for continuous bi-directional data.
const wss = new WebSocketServer({ server, path: "/api/ws/transcribe" });

// Allows cross-origin requests from the frontend (with credentials like cookies)
const corsOptions = {
  origin: CLIENT_ORIGIN,
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json()); //Parses JSON bodies
app.use(cookieParser()); //Parses cookies

// Routing (REST) - Mounts all API routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/history", historyRoutes);
app.use(errorHandler); // Centralized error handling middleware


//  Loads the VOSK model from disk
const MODEL_PATH = path.resolve(process.cwd(), "models/vosk");

if (!fs.existsSync(MODEL_PATH)) {
  console.error("Model not found at ", MODEL_PATH);
  console.error(
    'Please download the model from https://alphacephei.com/vosk/models and unpack it as "vosk" inside the "models" directory.'
  );
  process.exit(1); // If not present, exits with error 
  // The server logs an error and exits early using process.exit(1). This prevents the server from running in a broken state.
}

const model = new vosk.Model(MODEL_PATH);

// Sets up live audio transcription logic using the VOSK model and WebSocket connection.
// Receiving audio, Running transcription, Sending back results to the client
initializeWebSocket(wss, model);

if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

// Connects to DB
connectToDB(MONGODB_URI)
  .then(async () => {
    await initSuperAdmin(); // Seeds a superadmin (if not present)
    // Starts listening for HTTP + WebSocket connections
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
