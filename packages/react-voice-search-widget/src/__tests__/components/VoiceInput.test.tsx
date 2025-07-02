/// <reference types="vitest/globals" />

import { render, screen, fireEvent } from "@testing-library/react";
import VoiceInput from "../../components/VoiceInput";
import { BrowserRouter } from "react-router-dom";
import { HistoryEntry } from "../../types/types";

// Mocks & spies
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockLogout = vi.fn();
vi.mock("../../services/authService", () => ({
  logout: () => mockLogout(),
}));

const mockShowSuccess = vi.fn();
vi.mock("../../utils/errorHandler", () => ({
  showSuccess: (msg: string) => mockShowSuccess(msg),
}));

const mockUseVoiceRecorder = {
  fullTranscript: "hello",
  listening: false,
  handleMicClick: vi.fn(),
  handleInputChange: vi.fn(),
  handleClear: vi.fn(),
};
vi.mock("../../hooks/useVoiceRecorder", () => ({
  useVoiceRecorder: () => mockUseVoiceRecorder,
}));

const mockUseSearch = {
  searchResults: [{}],
  loading: false,
  error: "",
};
vi.mock("../../hooks/useSearch", () => ({
  useSearch: () => mockUseSearch,
}));

const mockSaveSearch = vi.fn();
vi.mock("../../hooks/useSaveSearch", () => ({
  useSaveSearch: () => ({ saveSearch: mockSaveSearch }),
}));

const mockHistory: HistoryEntry[] = [
  {
    query: "iphone",
    response: "iphone",
    timestamp: Date.now().toString(),
    _id: "01234567890",
  },
];

vi.mock("../../hooks/useSearchHistory", () => ({
  useSearchHistory: () => ({ history: mockHistory }),
}));

describe("VoiceInput component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("navigator", { mediaDevices: { getUserMedia: vi.fn() } });
    vi.stubGlobal("AudioContext", class {});
  });

  it("renders history items correctly", () => {
    render(<VoiceInput />, { wrapper: BrowserRouter });
    expect(screen.getByText("Past Searches")).toBeInTheDocument();
  });

  it("calls logout and navigates on logout click", () => {
    render(<VoiceInput />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByAltText("Logout"));
    expect(mockLogout).toHaveBeenCalled();
  });

  it("disables save if no results exist", () => {
    mockUseVoiceRecorder.fullTranscript = "hello";
    mockUseSearch.searchResults = [];
    render(<VoiceInput />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByAltText("Save"));
    expect(mockSaveSearch).not.toHaveBeenCalled();
  });

  it("saves search when transcript and results exist", () => {
    mockUseVoiceRecorder.fullTranscript = "query";
    mockUseSearch.searchResults = [{ name: "A", category: "B" }];
    render(<VoiceInput />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByAltText("Save"));
    expect(mockSaveSearch).toHaveBeenCalledWith(
      "query",
      mockUseSearch.searchResults
    );
  });

  it("handles mic click", () => {
    render(<VoiceInput />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByAltText("Mic"));
    expect(mockUseVoiceRecorder.handleMicClick).toHaveBeenCalled();
  });

  it("handles clear click", () => {
    render(<VoiceInput />, { wrapper: BrowserRouter });
    fireEvent.click(screen.getByAltText("Clear"));
    expect(mockUseVoiceRecorder.handleClear).toHaveBeenCalled();
  });

  it("shows loading state", () => {
    mockUseSearch.loading = true;
    render(<VoiceInput />, { wrapper: BrowserRouter });
    expect(screen.getByText("Loading results...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    mockUseSearch.loading = false;
    mockUseSearch.error = "Err";
    render(<VoiceInput />, { wrapper: BrowserRouter });
    expect(screen.getByText("Err")).toBeInTheDocument();
  });

  it("shows hint when no results and no error", () => {
    mockUseSearch.loading = false;
    mockUseSearch.error = "";
    mockUseSearch.searchResults = [];
    render(<VoiceInput />, { wrapper: BrowserRouter });
    expect(
      screen.getByText("Start speaking or typing to see results...")
    ).toBeInTheDocument();
  });
});
