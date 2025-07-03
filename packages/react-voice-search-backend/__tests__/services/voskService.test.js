
import { createRecognizer, handleAudioMessage } from "../../services/voskService.js";

// Mock vosk before import
jest.mock("vosk");
import vosk from "vosk";

describe("voskService", () => {
  describe("createRecognizer", () => {
    it("should initialize recognizer with model and sample rate", () => {
      const mockRecognizer = { mock: true };
      vosk.Recognizer.mockImplementation((config) => {
        expect(config).toEqual({ model: "test-model", sampleRate: "16000" }); // default SAMPLE_RATE
        return mockRecognizer;
      });

      const recognizer = createRecognizer("test-model");
      expect(recognizer).toBe(mockRecognizer);
    });
  });

  describe("handleAudioMessage", () => {
    let recognizer, ws, transcriptRef;

    beforeEach(() => {
      ws = { send: jest.fn() };
      transcriptRef = { current: "" };
    });

    it("should append final result to transcript and send it", () => {
      recognizer = {
        acceptWaveform: jest.fn().mockReturnValue(true),
        result: jest.fn().mockReturnValue({ text: "hello world" }),
      };

      handleAudioMessage(recognizer, Buffer.from([]), ws, transcriptRef);

      expect(transcriptRef.current).toBe("hello world");
      expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ final: "hello world" }));
    });

    it("should send partial result when waveform not final", () => {
      recognizer = {
        acceptWaveform: jest.fn().mockReturnValue(false),
        partialResult: jest.fn().mockReturnValue({ partial: "typing" }),
      };

      handleAudioMessage(recognizer, Buffer.from([]), ws, transcriptRef);

      expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ partial: "typing" }));
    });

    it("should not update transcript if result text is empty", () => {
      recognizer = {
        acceptWaveform: jest.fn().mockReturnValue(true),
        result: jest.fn().mockReturnValue({ text: "   " }),
      };

      handleAudioMessage(recognizer, Buffer.from([]), ws, transcriptRef);

      expect(transcriptRef.current).toBe("");
      expect(ws.send).toHaveBeenCalledWith(JSON.stringify({ final: "   " }));
    });

    it("should not send empty partials", () => {
      recognizer = {
        acceptWaveform: jest.fn().mockReturnValue(false),
        partialResult: jest.fn().mockReturnValue({ partial: "" }),
      };

      handleAudioMessage(recognizer, Buffer.from([]), ws, transcriptRef);

      expect(ws.send).not.toHaveBeenCalled();
    });
  });
});
