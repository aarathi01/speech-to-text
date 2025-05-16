import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import microphoneIcon from "../assets/microphone-icon.webp";
import SearchResults from "./SearchResults";
import type { Result } from "../types/types";

const VoiceInput: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [fullTranscript, setFullTranscript] = useState("");
  const [searchResults, setSearchResults] = useState<Result[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMicClick = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
    }
  };

  const handleClear = () => {
    resetTranscript();
    setFullTranscript("");
    setSearchResults([]);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFullTranscript(e.target.value);
  };

  useEffect(() => {
    if (transcript.trim()) {
      setFullTranscript((prev) =>
        prev.endsWith(transcript) ? prev : prev + " " + transcript
      );
    }
  }, [transcript]);

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
        if (query) {
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
        }
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

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div className="split-layout">
      <div className="voice-panel">
        <h1>Voice Search</h1>
        <div
          onClick={handleMicClick}
          style={{ cursor: "pointer", marginBottom: "1rem" }}
        >
          <img
            className="microphone-icon"
            src={microphoneIcon}
            alt="Mic"
            style={{
              width: "100px",
              height: "100px",
              filter: listening ? "drop-shadow(0 0 10px red)" : "none",
            }}
          />
          <div className="click-to-speak-text">
            {listening ? "Listening..." : "Click to speak"}
          </div>
        </div>
        <div>
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
