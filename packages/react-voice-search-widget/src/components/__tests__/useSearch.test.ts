import { renderHook, act } from "@testing-library/react";
import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { useSearch } from "../../hooks/useSearch";
import * as searchService from "../../services/searchService";

vi.mock("../../services/searchService");

describe("useSearch hook", () => {
  const mockSearchText = vi.mocked(searchService.searchText);

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("should return empty results for empty query", () => {
    const { result } = renderHook(() => useSearch("   "));
    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe(null);
    expect(result.current.loading).toBe(false);
  });

  it("should fetch and return results for valid query", async () => {
    const fakeResults = [{ name: "MacBook", category: "Laptop" }];
    mockSearchText.mockResolvedValueOnce({
        data: { results: fakeResults },
        status: 0,
        statusText: "",
        headers: {},
        config: undefined
    });

    const { result } = renderHook(() => useSearch("mac"));

    // Fast-forward debounce timeout
    await act(() => {
      vi.advanceTimersByTime(500);
      return Promise.resolve();
    });

    expect(mockSearchText).toHaveBeenCalledWith("mac");

    // Wait for async fetch
    await act(() => Promise.resolve());

    expect(result.current.loading).toBe(false);
    expect(result.current.searchResults).toEqual(fakeResults);
    expect(result.current.error).toBe(null);
  });

  it("should show error when no results found", async () => {
    mockSearchText.mockResolvedValueOnce({ data: { results: [] } });

    const { result } = renderHook(() => useSearch("xyz"));

    await act(() => {
      vi.advanceTimersByTime(500);
      return Promise.resolve();
    });

    await act(() => Promise.resolve());

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe("No results found");
    expect(result.current.loading).toBe(false);
  });

  it("should handle fetch error with server error message", async () => {
    mockSearchText.mockRejectedValueOnce({
      response: { data: { error: "Server error" } }
    });

    const { result } = renderHook(() => useSearch("mac"));

    await act(() => {
      vi.advanceTimersByTime(500);
      return Promise.resolve();
    });

    await act(() => Promise.resolve());

    expect(result.current.searchResults).toEqual([]);
    expect(result.current.error).toBe("Server error");
    expect(result.current.loading).toBe(false);
  });

  it("should handle fetch error without server response", async () => {
    mockSearchText.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useSearch("mac"));

    await act(() => {
      vi.advanceTimersByTime(500);
      return Promise.resolve();
    });

    await act(() => Promise.resolve());

    expect(result.current.error).toBe("Network error");
    expect(result.current.searchResults).toEqual([]);
  });

  it("should cancel previous fetch on query change", async () => {
    const firstMock = vi.fn().mockResolvedValue({ data: { results: [] } });
    mockSearchText.mockImplementation(firstMock);

    const { rerender } = renderHook(({ q }) => useSearch(q), {
      initialProps: { q: "abc" }
    });

    vi.advanceTimersByTime(300); // first query hasn't fired yet
    rerender({ q: "macbook" }); // simulate user changing query

    vi.advanceTimersByTime(500); // now the second call fires

    expect(mockSearchText).toHaveBeenCalledTimes(1); // Only latest one is called
  });
});
