import { renderHook, act } from "@testing-library/react";
import { describe, it, vi, expect, beforeEach } from "vitest";
import { useSaveSearch } from "../../hooks/useSaveSearch";
import * as historyService from "../../services/historyService";
import { Result } from "../../types/types";

vi.mock("../../services/historyService");

describe("useSaveSearch", () => {
  const mockSaveSearchHistory = vi.mocked(historyService.saveSearchHistory);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call saveSearchHistory with valid query and response", async () => {
    const { result } = renderHook(() => useSaveSearch());
    const query = "test query";
    const response: Result[] = [{
        name: "iphone", category: "Mobile",
        text: undefined,
        title: undefined,
        matchedWords: [],
        id: 0,
        score: 0
    }];

    mockSaveSearchHistory.mockResolvedValueOnce();

    await act(async () => {
      await result.current.saveSearch(query, response);
    });

    expect(mockSaveSearchHistory).toHaveBeenCalledWith({ query, response });
    expect(mockSaveSearchHistory).toHaveBeenCalledTimes(1);
  });

  it("should NOT call saveSearchHistory if query is empty", async () => {
    const { result } = renderHook(() => useSaveSearch());
    const response: Result[] = [{
        name: "iphone", category: "Mobile",
        text: undefined,
        title: undefined,
        matchedWords: [],
        id: 0,
        score: 0
    }];

    await act(async () => {
      await result.current.saveSearch("", response);
    });

    expect(mockSaveSearchHistory).not.toHaveBeenCalled();
  });

  it("should handle and log error if saveSearchHistory fails", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockSaveSearchHistory.mockRejectedValueOnce(new Error("Failed to save"));

    const { result } = renderHook(() => useSaveSearch());

    await act(async () => {
      await result.current.saveSearch("sample", []);
    });

    expect(mockSaveSearchHistory).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to save search log",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
