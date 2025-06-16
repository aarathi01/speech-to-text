import React from "react";
import microphoneIcon from "../assets/microphone-icon.webp";
import SearchResults from "./SearchResults";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useSearch } from "../hooks/useSearch";

const VoiceInput: React.FC = () => {
  const {
    fullTranscript,
    listening,
    handleMicClick,
    handleInputChange,
    handleClear,
  } = useVoiceRecorder();

  const { searchResults, error, loading } = useSearch(fullTranscript);

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
