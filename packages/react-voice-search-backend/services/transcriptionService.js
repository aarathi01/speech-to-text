import { createRequire } from "module";
const require = createRequire(import.meta.url);
const vosk = require("vosk");

import jwt from "jsonwebtoken";
import { SAMPLE_RATE, JWT_SECRET } from "../utils/config.js";

export const initializeWebSocket = (wss, model) => {
  wss.on("connection", (ws, req) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const token = url.searchParams.get("token");

    if (!token) {
      console.warn("WebSocket rejected: Missing token.");
      ws.close(4001, "Missing authentication token");
      return;
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
      ws.user = decoded.id; //req.user = decoded full JWT payload , for future use
      console.log(`WebSocket connected for user: ${decoded.email || "Unknown"}`);
    } catch (err) {
      console.warn("WebSocket rejected: Invalid or expired token.");
      ws.close(4002, "Invalid or expired token");
      return;
    }

    const recognizer = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });
    let transcript = "";

    ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        console.warn("Received non-binary data. Ignoring.");
        return;
      }
      try {
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
      } catch (error) {
        console.error("Error processing audio data:", error);
        ws.send(JSON.stringify({ error: "Error processing audio data" }));
      }
    });

    ws.on("close", () => {
      if (!transcript.trim()) {
        console.warn("Session ended. No speech detected.");
      } else {
        console.log(`Final transcript for user ${ws.user?.email || "Unknown"}: ${transcript}`);
      }
      recognizer.free();
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err.message);
      recognizer.free();
    });
  });
};
