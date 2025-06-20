import { createRequire } from "module";
import cookie from "cookie";
import vosk from "vosk"; 
import jwt from "jsonwebtoken";
import { SAMPLE_RATE, JWT_SECRET } from "../utils/config.js";

export const initializeWebSocket = (wss, model) => {
  wss.on("connection", (ws, req) => {
    const cookies = cookie.parse(req.headers.cookie || "");
    const token = cookies.token;

    if (!token) {
      console.warn("WebSocket rejected: Missing token.");
      ws.close(401, "Missing authentication token");
      return;
    }

    try {
      jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.warn("WebSocket rejected: Invalid or expired token.");
      ws.close(401, "Invalid or expired token");
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
