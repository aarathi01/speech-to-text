import React, { useCallback, useEffect, useState, useRef } from "react";
import microphoneIcon from "../assets/microphone-icon.webp";
import SearchResults from "./SearchResults";
import type { Result } from "../types/types";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:5000/ws";
const SEARCH_API_URL =
  import.meta.env.REACT_APP_SEARCH_API_URL || "http://localhost:5000/search";

const VoiceInput: React.FC = () => {
  const [fullTranscript, setFullTranscript] = useState("");
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = async () => {
    setError(null);
    setListening(true);
    setLoading(true);
    setFullTranscript("");
    setSearchResults([]);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
        wsRef.current = new WebSocket(WS_URL);
        wsRef.current.binaryType = "arraybuffer";
      }

      // AudioContext with 16000Hz for Vosk
      audioContextRef.current = new AudioContext({ sampleRate: 16000 });

      sourceRef.current =
        audioContextRef.current.createMediaStreamSource(stream);
      processorRef.current = audioContextRef.current.createScriptProcessor(
        4096,
        1,
        1
      );

      wsRef.current.onopen = () => {
        setLoading(false);
        sourceRef.current?.connect(processorRef.current!);
        processorRef.current?.connect(audioContextRef.current!.destination);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          if (message.error) {
            setError(message.error);
            stopListening();
          } else if (message.final) {
            setFullTranscript((prev) =>
              prev ? prev + " " + message.final : message.final
            );
          }
        } catch {
          setError("Invalid response from server");
        }
      };

      wsRef.current.onerror = (err) => {
        console.error("WebSocket error", err);
        setError("WebSocket error");
        stopListening();
      };

      wsRef.current.onclose = () => {
        stopListening();
      };

      processorRef.current.onaudioprocess = (event) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)
          return;

        const inputBuffer = event.inputBuffer.getChannelData(0);
        const pcmData = downsampleBuffer(
          inputBuffer,
          audioContextRef.current!.sampleRate,
          16000
        );
        if (pcmData) {
          wsRef.current.send(pcmData);
        }
      };
    } catch (err: unknown) {
      console.error("Microphone access error", err);
      setError("Microphone access denied or not supported");
      setListening(false);
      setLoading(false);
    }
  };

  const stopListening = () => {
    setListening(false);
    setLoading(false);
    processorRef.current?.disconnect();
    sourceRef.current?.disconnect();
    audioContextRef.current?.close();
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current?.close();
      if (!fullTranscript.trim() && fullTranscript !== null) {
        setError("No speech detected during session");
      }
    }

    processorRef.current = null;
    sourceRef.current = null;
    audioContextRef.current = null;
    wsRef.current = null;
  };

  // Downsample Float32Array audio buffer to target sampleRate and convert to Int16 ArrayBuffer
  const downsampleBuffer = (
    buffer: Float32Array,
    sampleRate: number,
    outSampleRate: number
  ): ArrayBuffer | null => {
    if (outSampleRate === sampleRate) {
      return convertFloat32ToInt16(buffer);
    }
    if (outSampleRate > sampleRate) {
      console.warn(
        "Downsampling rate should be smaller than original sample rate"
      );
      return null;
    }
    const sampleRateRatio = sampleRate / outSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < newLength) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0,
        count = 0;
      for (
        let i = offsetBuffer;
        i < nextOffsetBuffer && i < buffer.length;
        i++
      ) {
        accum += buffer[i];
        count++;
      }
      const avg = accum / count;
      const s = Math.max(-1, Math.min(1, avg));
      result[offsetResult] = s < 0 ? s * 0x8000 : s * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result.buffer;
  };

  // Convert Float32Array [-1..1] to Int16 ArrayBuffer
  const convertFloat32ToInt16 = (buffer: Float32Array): ArrayBuffer => {
    const l = buffer.length;
    const buf = new ArrayBuffer(l * 2);
    const view = new DataView(buf);
    for (let i = 0; i < l; i++) {
      const s = Math.max(-1, Math.min(1, buffer[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }
    return buf;
  };

  const handleClear = useCallback(() => {
    setFullTranscript("");
    setSearchResults([]);
    setError(null);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setFullTranscript(e.target.value);
    },
    []
  );

  useEffect(() => {
    const fetchSearchResults = async () => {
      const query = fullTranscript.trim();
      if (!query) {
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `${SEARCH_API_URL}?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch");
        }

        const data = await response.json();
        if (data.results.length === 0) {
          setSearchResults([]);
          setError("No results found");
        }
        setSearchResults(data.results);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(delayDebounce);
  }, [fullTranscript]);

  if (!navigator.mediaDevices || !window.AudioContext) {
    return <UnsupportedBrowserFallback />;
  }

  return (
    <div className="split-layout">
      <div className="voice-panel">
        <h1>Voice Search</h1>
        <div className="click-cursor" onClick={handleMicClick}>
          <img
            className="microphone-icon"
            src={microphoneIcon}
            alt="Mic"
            style={{ filter: listening ? "drop-shadow(0 0 10px red)" : "none" }}
          />
          <div className="click-to-speak-text">
            {listening ? "Listening..." : "Click to speak"}
          </div>
        </div>
        <div className="display-area">
          <textarea
            className="transcript-text-area"
            placeholder="Type or speak here..."
            value={fullTranscript}
            onChange={handleInputChange}
            rows={4}
          />
        </div>
        <button className="clear-button" onClick={handleClear}>
          Clear
        </button>
      </div>
      <div className="results-panel">
        {loading ? (
          <p>Loading results...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : searchResults.length > 0 ? (
          <SearchResults results={searchResults} transcript={fullTranscript} />
        ) : (
          <p style={{ color: "#7777" }}>
            Start speaking or typing to see results...
          </p>
        )}
      </div>
    </div>
  );
};

export default VoiceInput;
