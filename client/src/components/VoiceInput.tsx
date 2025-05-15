import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import microphoneIcon from "../assets/microphone-icon.webp";
import SearchResults from "./SearchResults";

const VoiceInput: React.FC = () => {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();
  const [fullTranscript, setFullTranscript] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
  };

  const handleSearch = async () => {
    if (fullTranscript.trim()) {
      const response = await fetch(
        `http://localhost:5000/search?q=${encodeURIComponent(fullTranscript)}`
      );
      const data = await response.json();
      setSearchResults(data.results || []);
    }
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

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition.</p>;
  }

  return (
    <div
      style={{
        padding: "1rem",
        maxWidth: "600px",
        margin: "auto",
        textAlign: "center",
      }}
    >
      <h1>Voice Search</h1>
      <div
        onClick={handleMicClick}
        style={{ cursor: "pointer", marginBottom: "1rem" }}
      >
        <img
          src={microphoneIcon}
          alt="Mic"
          style={{
            width: "100px",
            height: "100px",
            filter: listening ? "drop-shadow(0 0 10px red)" : "none",
          }}
        />
        <div style={{ fontWeight: "bold", marginTop: "0.5rem" }}>
          {listening ? "Listening..." : "Click to speak"}
        </div>
      </div>

      <textarea
        placeholder="Type or speak to search"
        value={fullTranscript}
        onChange={handleInputChange}
        rows={4}
        style={{
          width: "100%",
          padding: "1rem",
          border: "1px solid #ccc",
          borderRadius: "6px",
          backgroundColor: "#f9f9f9",
          resize: "none",
        }}
      />

      <div style={{ marginTop: "1rem" }}>
        <button
          onClick={handleSearch}
          style={{
            marginRight: "1rem",
            padding: "0.5rem 1.5rem",
            backgroundColor: "#2196f3",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Search
        </button>

        <button
          onClick={handleClear}
          style={{
            padding: "0.5rem 1.5rem",
            backgroundColor: "#f44336",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          Clear
        </button>
      </div>
      <SearchResults results={searchResults} transcript={fullTranscript} />
    </div>
  );
};

export default VoiceInput;
