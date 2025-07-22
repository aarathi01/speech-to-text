// contains the core integration with the VOSK speech recognition engine.
// It's where raw binary audio becomes text.
import vosk from "vosk"; //The actual C++ speech-to-text engine exposed via Node bindings

import { SAMPLE_RATE } from "../utils/config.js"; // Usually set to 16000, matching model’s required sample rate

// Each client gets its own recognizer instance so transcription is isolated
// createRecognizer initializes a new VOSK recognizer instance using the given model and sample rate. Each connection needs a separate instance to ensure transcription isolation.
export const createRecognizer = (model) => {
  return new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE }); // params : a preloaded VOSK model, must match your audio input (typically 16 kHz)
};

// data: binary audio chunk (usually from browser microphone)
// acceptWaveform(...): feeds this chunk to VOSK. Returns true if a final result is ready. Else continues accumulating
// transcriptRef : It acts as an accumulator to build the full transcript across multiple result() calls. It allows final output to be stored between function calls.
export const handleAudioMessage = (recognizer, data, ws, transcriptRef) => {
  const isFinal = recognizer.acceptWaveform(data); // acceptWaveform(data) feeds raw audio data into VOSK for processing. If the data completes a recognizable sentence or segment, it returns true — indicating a final result is ready.

  if (isFinal) {
    const result = recognizer.result(); // recognizer.result() gives a JSON like { text: "this is final" }, result() gives the finalized, confident transcription of a complete phrase or sentence
    // It's appended to transcriptRef.current, which accumulates the full result
    if (result.text && result.text.trim()) {
      transcriptRef.current +=
        (transcriptRef.current ? " " : "") + result.text.trim();
    }
    ws.send(JSON.stringify({ final: result.text })); // The final text is sent to client via WebSocket
  } else {
    // If only partial result is available else is executed
    const partial = recognizer.partialResult(); // recognizer.partialResult() gives temporary feedback as the user is still speaking
    if (partial.partial) {
      ws.send(JSON.stringify({ partial: partial.partial })); // Sent to client for real-time feedback during speaking
    }
  }
};
