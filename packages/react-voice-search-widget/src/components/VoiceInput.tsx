import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MicrophoneIcon from "../assets/microphone.svg";
import ClearIcon from "../assets/clear.svg";
import SaveIcon from "../assets/save.svg";
import LogoutIcon from "../assets/logout.svg";
import MoreIcon from "../assets/more.svg";
import SearchResults from "./SearchResults";
import UnsupportedBrowserFallback from "./UnsupportedBrowserFallback";
import { useVoiceRecorder } from "../hooks/useVoiceRecorder";
import { useSearch } from "../hooks/useSearch";
import { logout } from "../services/authService";
import { showSuccess } from "../utils/errorHandler";
import { useSaveSearch } from "../hooks/useSaveSearch";
import {
  getSearchHistory,
  deleteOwnSearchEntry,
} from "../services/historyService";
import { HistoryEntry } from "../types/types";
import ConfirmDeleteModal from "./ConfirmActionModal";

const VoiceInput: React.FC = () => {
  const navigate = useNavigate();
  const { saveSearch } = useSaveSearch();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const {
    fullTranscript,
    listening,
    handleMicClick,
    handleInputChange,
    handleClear,
  } = useVoiceRecorder();

  const { searchResults, error, loading } = useSearch(fullTranscript);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (err) {
        console.error("Failed to fetch history", err);
      }
    };
    fetchHistory();
  }, []);

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

  const confirmDelete = (id: string) => {
    setSelectedId(id);
    setShowModal(true);
    setActiveMenuIndex(null);
  };

  const performDelete = async () => {
    if (!selectedId) return;
    try {
      await deleteOwnSearchEntry(selectedId);
      setHistory((prev) => prev.filter((entry) => entry._id !== selectedId));
      setShowModal(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="app-container">
      <div className="main-layout">
        <div className="sidebar">
          <h3>Recent Searches</h3>

          <ul className="history-list">
            {history.length > 0 ? (
              history.map((item, index) => (
                <li key={item._id} className="history-item">
                  <div className="query-header">
                    <div className="query-text">{item.query}</div>
                    <div className="menu-wrapper">
                      <img
                        src={MoreIcon}
                        alt="Menu"
                        className="menu-icon"
                        onClick={() =>
                          setActiveMenuIndex(
                            activeMenuIndex === index ? null : index
                          )
                        }
                      />
                      {activeMenuIndex === index && (
                        <div className="dropdown-menu">
                          <button onClick={() => confirmDelete(item._id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <ul className="response-list">
                    {Array.isArray(item.response) &&
                      item.response.map((r, idx: number) => (
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

      {/* Confirmation Modal */}
      {showModal && (
        <ConfirmDeleteModal
          onCancel={() => setShowModal(false)}
          onConfirm={performDelete}
          message="Are you sure you want to delete this search entry?"
        />
      )}
    </div>
  );
};

export default VoiceInput;
