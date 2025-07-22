import {
  createRecognizer, // creates a VOSK recognizer instance (per user)
  handleAudioMessage, // feeds audio data to VOSK and sends back transcription
} from "../services/voskService.js";
import { verifyWebSocketToken } from "../utils/authSocket.js"; // checks user auth for the WebSocket connection

// This function sets up logic for handling WebSocket connections, verifying the token, receiving audio, passing it to the VOSK speech recognition engine, and sending back transcripts.
export const initializeWebSocket = (wss, model) => {
  // This sets up a handler for each new WebSocket client that connects.
  wss.on("connection", (ws, req) => {
    const decoded = verifyWebSocketToken(req, ws); // The request header (likely from cookies or query params) contains a JWT. and verifyWebSocketToken() validates it.
    if (!decoded) return; // If invalid, the socket is not allowed to proceed (silently dropped).

    const recognizer = createRecognizer(model); // createRecognizer(model) returns a new VOSK recognizer for this socket connection.
    const transcriptRef = { current: "" }; // transcriptRef acts like a mutable object to accumulate the final transcript.

    // Handling Audio Messages, WebSocket sends data chunks of binary audio
    ws.on("message", (data, isBinary) => {
      if (!isBinary) return; // If it's not binary, it's ignored
      try {
        handleAudioMessage(recognizer, data, ws, transcriptRef); // handleAudioMessage() processes this audio, runs recognition, and sends back partial/final results
      } catch (error) {
        // Error-resilient — bad audio chunks don’t crash the server
        console.error("Error processing audio:", error);
        ws.send(JSON.stringify({ error: "Error processing audio data" }));
      }
    });

    // Session Cleanup
    ws.on("close", () => {
      // final transcript stored
      // It's accumulated in transcriptRef.current as the recognizer receives final segments.
      const finalText = transcriptRef.current.trim();
      if (!finalText) {
        console.warn("Session ended. No speech detected.");
      } else {
        console.log(`Final transcript: ${finalText}`); // When the socket disconnects, we log the final transcript
      }
      recognizer.free(); // to clean up memory (important in C++/VOSK)
    });

    //Error Handling
    ws.on("error", (err) => {
      console.error("WebSocket error:", err.message); // Logs unexpected WebSocket errors
      recognizer.free(); // Always frees recognizer memory to prevent leaks
    });
  });
};
