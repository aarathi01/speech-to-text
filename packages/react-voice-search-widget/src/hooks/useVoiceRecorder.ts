import { useState, useRef } from "react";
import { BASE_URL } from "../config/apiConfig";
import { showError } from "../utils/errorHandler";

export const useVoiceRecorder = () => {
  const [fullTranscript, setFullTranscript] = useState(""); // stores combined final results from the speech-to-text backend
  const [listening, setListening] = useState(false); // boolean to toggle mic state (ON/OFF)

  // useRef holds persistent audio and WebSocket objects without triggering re-renders
  // These references are essential for audio streaming lifecycle control
  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  // Downsamples 44.1kHz audio (mic default) to 16kHz — VOSK backend requires 16kHz for accurate transcription.
  const downsampleBuffer = (
    buffer: Float32Array,
    sampleRate: number,
    outRate: number
  ): ArrayBuffer | null => {
    const ratio = sampleRate / outRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Int16Array(newLength); // Converts float audio data into 16-bit PCM (required by most speech engines)

    for (let i = 0; i < newLength; i++) {
      const idx = Math.floor(i * ratio);
      const sample = Math.max(-1, Math.min(1, buffer[idx]));
      result[i] = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    }

    return result.buffer;
  };

  const handleMicClick = () => (listening ? stopListening() : startListening());

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullTranscript(e.target.value);
  };

  const handleClear = () => {
    if (fullTranscript) setFullTranscript("");
    else {
      showError("Nothing to clear.");
    }
  };

  const startListening = async () => {
    setListening(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); // Activates the mic

    const wsUrl = `${BASE_URL.replace("/api", "").replace(
      /^http/,
      "ws"
    )}/api/ws/transcribe`;

    wsRef.current = new WebSocket(wsUrl);
    wsRef.current.binaryType = "arraybuffer";

    // AudioContext to manage audio processing
    audioContextRef.current = new AudioContext();
    const sampleRate = audioContextRef.current.sampleRate;

    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    // ScriptProcessorNode to stream audio chunks
    processorRef.current = audioContextRef.current.createScriptProcessor(
      4096,
      1,
      1
    );

    // WebSocket to stream audio to the backend
    wsRef.current.onopen = () => {
      sourceRef.current?.connect(processorRef.current!);
      processorRef.current?.connect(audioContextRef.current!.destination);
    };

    // Appends final transcription results into fullTranscript
    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.final) {
        setFullTranscript((prev) =>
          prev ? `${prev} ${message.final}` : message.final
        );
      }
    };

    // Listens to audio input, processes and streams to backend in real time
    processorRef.current.onaudioprocess = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const buffer = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(buffer, sampleRate, 16000);
        if (downsampled) wsRef.current.send(downsampled);
      }
    };
  };

  // Disconnects audio pipeline, Closes the WebSocket
  const stopListening = () => {
    setListening(false);
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
      if (!fullTranscript.trim()) {
        showError("No speech detected during session");
      }
    }

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    wsRef.current = null;
  };

  return {
    fullTranscript,
    setFullTranscript,
    listening,
    handleMicClick,
    handleInputChange,
    handleClear,
  };
};
