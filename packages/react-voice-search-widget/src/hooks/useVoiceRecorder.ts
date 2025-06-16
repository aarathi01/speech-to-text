import { useState, useRef } from "react";
import { BASE_URL } from "../config/apiConfig";
import { showError } from "../utils/errorHandler";

export const useVoiceRecorder = () => {
  const [fullTranscript, setFullTranscript] = useState("");
  const [listening, setListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const token = localStorage.getItem("token");

  const downsampleBuffer = (buffer: Float32Array, sampleRate: number, outRate: number): ArrayBuffer | null => {
    const ratio = sampleRate / outRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Int16Array(newLength);

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
    setFullTranscript("");
  };

  const startListening = async () => {
    setListening(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const wsUrl = `${BASE_URL.replace("/api", "").replace(/^http/, "ws")}/api/ws/transcribe?token=${encodeURIComponent(token || "")}`;
    wsRef.current = new WebSocket(wsUrl);
    wsRef.current.binaryType = "arraybuffer";

    audioContextRef.current = new AudioContext();
    const sampleRate = audioContextRef.current.sampleRate;

    sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
    processorRef.current = audioContextRef.current.createScriptProcessor(4096, 1, 1);

    wsRef.current.onopen = () => {
      sourceRef.current?.connect(processorRef.current!);
      processorRef.current?.connect(audioContextRef.current!.destination);
    };

    wsRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.final) {
        setFullTranscript((prev) => (prev ? `${prev} ${message.final}` : message.final));
      }
    };

    processorRef.current.onaudioprocess = (e) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        const buffer = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(buffer, sampleRate, 16000);
        if (downsampled) wsRef.current.send(downsampled);
      }
    };
  };

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
