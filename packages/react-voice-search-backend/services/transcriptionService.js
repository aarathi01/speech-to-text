import {
  createRecognizer,
  handleAudioMessage,
} from "../services/voskService.js";
import { verifyWebSocketToken } from "../utils/authSocket.js";

export const initializeWebSocket = (wss, model) => {
  wss.on("connection", (ws, req) => {
    const decoded = verifyWebSocketToken(req, ws);
    if (!decoded) return;

    const recognizer = createRecognizer(model);
    const transcriptRef = { current: "" };

    ws.on("message", (data, isBinary) => {
      if (!isBinary) return;
      try {
        handleAudioMessage(recognizer, data, ws, transcriptRef);
      } catch (error) {
        console.error("Error processing audio:", error);
        ws.send(JSON.stringify({ error: "Error processing audio data" }));
      }
    });

    ws.on("close", () => {
      const finalText = transcriptRef.current.trim();
      if (!finalText) {
        console.warn("Session ended. No speech detected.");
      } else {
        console.log(`Final transcript: ${finalText}`);
      }
      recognizer.free();
    });

    ws.on("error", (err) => {
      console.error("WebSocket error:", err.message);
      recognizer.free();
    });
  });
};
