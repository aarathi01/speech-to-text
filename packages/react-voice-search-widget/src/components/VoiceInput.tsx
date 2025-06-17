import React from "react";
import { useNavigate } from "react-router-dom";
import MicrophoneIcon from "../assets/microphone.svg";
import ClearIcon from "../assets/clear.svg";
import SaveIcon from "../assets/save.svg";
import LogoutIcon from "../assets/logout.svg";
import SearchResults from "./SearchResults";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useSearch } from "../hooks/useSearch";
import { logout } from "../services/authService";
import { showSuccess } from "../utils/errorHandler";
import { useSaveSearch } from "../hooks/useSaveSearch";
import { useSearchHistory } from "../hooks/useSearchHistory";

const VoiceInput: React.FC = () => {
  const navigate = useNavigate();
  const { saveSearch } = useSaveSearch();
  const { history } = useSearchHistory();

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

  const handleSaveSearch = () => {
    if (searchResults.length === 0 || !fullTranscript.trim()) return;
    saveSearch(fullTranscript.trim(), searchResults);
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="sidebar">
          <h4>Recent Searches</h4>

          <ul className="history-list">
            {history.length > 0 ? (
              history.map((item, index) => (
                <li key={index} className="history-item">
                  <div className="query-text">
                     {item.query}
                  </div>                  
                  <ul className="response-list">
                    {item.response.map((r, idx: number) => (
                      <li key={idx}>
                        {r.name} – {r.category}
                      </li>
                    ))}
                  </ul>
                  <div className="timestamp">
                    <small>{new Date(item.timestamp).toLocaleString()}</small>
                  </div>
                </li>
              ))
            ) : (
              <li>No history found</li>
            )}
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
                <div className="icon-with-tooltip">
                  <img
                    className="save-icon"
                    src={SaveIcon}
                    alt="Save"
                    onClick={handleSaveSearch}
                  />
                  <span className="tooltip-text">Save</span>
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
