import { renderHook, act } from "@testing-library/react";
import { useSearchHistory } from "../../hooks/useSearchHistory";
import * as historyService from "../../services/historyService";
import { HistoryEntry } from "../../types/types";

vi.mock("../../services/historyService");

describe("useSearchHistory", () => {
  const mockGetHistory = vi.mocked(historyService.getSearchHistory);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and sets history data successfully", async () => {
    const mockHistory: HistoryEntry[] = [
      { query: "apple", timestamp: "2024-06-10T12:00:00Z", response: "" },
      { query: "banana", timestamp: "2024-06-11T13:00:00Z", response: ""},
    ];
    mockGetHistory.mockResolvedValueOnce(mockHistory);

    const { result } = renderHook(() => useSearchHistory());

    await act(() => Promise.resolve()); // wait for effect

    expect(mockGetHistory).toHaveBeenCalledTimes(1);
    expect(result.current.history).toEqual(mockHistory);
  });

  it("handles error and sets history to empty array", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockGetHistory.mockRejectedValueOnce(new Error("Fetch failed"));

    const { result } = renderHook(() => useSearchHistory());

    await act(() => Promise.resolve());

    expect(mockGetHistory).toHaveBeenCalled();
    expect(result.current.history).toEqual([]);
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching history",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
