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

dotenv.config();
export const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN;
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/api/ws/transcribe" });
const corsOptions = {
  origin: CLIENT_ORIGIN,
  credentials: true, // allow cookies to be sent
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/history", historyRoutes);
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
if (!MONGODB_URI) {
  console.error("MONGODB_URI environment variable is not set.");
  process.exit(1);
}

connectToDB(MONGODB_URI)
  .then(async () => {
    await initSuperAdmin();
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
