import React from "react";
import { useNavigate } from "react-router-dom";
import MicrophoneIcon from "../assets/microphone.svg";
import ClearIcon from "../assets/clear.svg";
import LogoutIcon from "../assets/logout.svg";
import SearchResults from "./SearchResults";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useSearch } from "../hooks/useSearch";
import { logout } from "../services/authService";
import { showSuccess } from "../utils/errorHandler";

const VoiceInput: React.FC = () => {
  const navigate = useNavigate();
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

  const handleLogout = () => {
    logout();
    showSuccess("Logged out successfully");
    navigate("/login");
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="sidebar">
          <h4>Recent Searches</h4>
          <ul>
            <li>search1 </li>
          </ul>
          <ul>
            <li>search 2</li>
          </ul>
          <ul>
            <li>search 3</li>
          </ul>
        </div>

        <div className="content">
          <div className="header-row">
            <h2 className="header-title">Voice Search</h2>
            <div className="icon-with-tooltip">
            <img
              className="logout-icon"
              src={LogoutIcon}
              alt="Logout"
              onClick={handleLogout}
            />
              <span className="tooltip-text-bottom">Logout</span>
            </div>
          </div>
          <div className="results-section">
            {loading ? (
              <p>Loading results...</p>
            ) : error ? (
              <p className="error-text">{error}</p>
            ) : searchResults.length > 0 ? (
              <SearchResults
                results={searchResults}
                transcript={fullTranscript}
              />
            ) : (
              <p className="hint">Start speaking or typing to see results...</p>
            )}
          </div>

          <div className="input-section">
            <div className="textarea-wrapper">
              <textarea
                className="transcript-text-area"
                placeholder="Type or speak here..."
                value={fullTranscript}
                onChange={handleInputChange}
                rows={2}
              />

              <div className="textarea-controls">
                <div className="icon-with-tooltip">
                <img
                  className="microphone-icon"
                  src={MicrophoneIcon}
                  alt="Mic"
                  onClick={handleMicClick}
                  style={{
                    filter: listening ? "drop-shadow(0 0 6px red)" : "none",
                  }}
                />
                 <span className="tooltip-text">Dictate</span>
                </div>
                <div className="icon-with-tooltip">
                <img
                  className="clear-icon"
                  src={ClearIcon}
                  alt="Clear"
                  onClick={handleClear}
                />
                  <span className="tooltip-text">Clear</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceInput;
