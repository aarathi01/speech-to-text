import { createRequire } from "module";
const require = createRequire(import.meta.url);
const vosk = require("vosk");

const SAMPLE_RATE = process.env.SAMPLE_RATE
  ? Number(process.env.SAMPLE_RATE)
  : 16000;

export const initializeWebSocket = (wss,model )=> {
  wss.on("connection", (ws) => {
    const recognizer = new vosk.Recognizer({ model, sampleRate: SAMPLE_RATE });
    let transcript = "";

    ws.on("message", (data, isBinary) => {
      if (!isBinary) {
        console.warn("Received non-binary data. Ignored.");
        return;
      }

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
    });

    ws.on("close", () => {
      if (!transcript.trim()) {
        console.warn("No speech detected during session");
      }
      recognizer.free();
    });
  });
};
