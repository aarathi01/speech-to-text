import React, { useCallback, useEffect, useState, useRef } from "react";
import microphoneIcon from "../assets/microphone-icon.webp";
import SearchResults from "./SearchResults";
import type { Result } from "../types/types";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";

const VoiceInput: React.FC = () => {
  const [fullTranscript, setFullTranscript] = useState("");
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<BlobPart[]>([]);

  const handleMicClick = () => {
    if (listening) {
      // Stop recording
      mediaRecorder.current?.stop();
      setListening(false);
    } else {
      // Start recording
      setError(null);
      audioChunks.current = [];
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          mediaRecorder.current = new MediaRecorder(stream);
          mediaRecorder.current.ondataavailable = (e) => {
            audioChunks.current.push(e.data);
          };
          mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks.current, {
              type: "audio/wav",
            });
            sendAudioToBackend(audioBlob);
            stream.getTracks().forEach((track) => track.stop());
          };
          mediaRecorder.current.start();
          setListening(true);
        })
        .catch(() => setError("Microphone access denied or not supported"));
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");

      const response = await fetch("http://localhost:5000/api/transcribe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to transcribe audio");
      }

      const data = await response.json();
      const text = data.text || "";

      if (text.trim() === "") {
        setError("No speech detected");
        setSearchResults([]);
        setLoading(false);
        return;
      }

      setFullTranscript((prev) => (prev ? prev + " " + text : text));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("An error occurred");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
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
        setSearchResults([]);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5000/search?q=${encodeURIComponent(query)}`
        );
        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || "Failed to fetch");
        }

        const data = await response.json();
        if (data.results.length === 0) {
          setError("No results found");
        }
        setSearchResults(data.results || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounce = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(delayDebounce);
  }, [fullTranscript]);

  if (!navigator.mediaDevices || !window.MediaRecorder) {
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
        {loading && <p>Loading results...</p>}
        {error && <p className="error-text">{error}</p>}
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
