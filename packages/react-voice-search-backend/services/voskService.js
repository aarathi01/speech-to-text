import vosk from "vosk";
import { SAMPLE_RATE } from "../utils/config.js";

export const createRecognizer = (model) => {
  return new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });
};

export const handleAudioMessage = (recognizer, data, ws, transcriptRef) => {
  const isFinal = recognizer.acceptWaveform(data);

  if (isFinal) {
    const result = recognizer.result();
    if (result.text && result.text.trim()) {
      transcriptRef.current +=
        (transcriptRef.current ? " " : "") + result.text.trim();
    }
    ws.send(JSON.stringify({ final: result.text }));
  } else {
    const partial = recognizer.partialResult();
    if (partial.partial) {
      ws.send(JSON.stringify({ partial: partial.partial }));
    }
  }
};
