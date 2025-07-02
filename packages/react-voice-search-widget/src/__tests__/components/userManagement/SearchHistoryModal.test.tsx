/// <reference types="vitest/globals" />
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import SearchHistoryModal from "../../../components/userManagement/SearchHistoryModal";
import { vi } from "vitest";

vi.mock("../../../services/historyService", () => {
  return {
    getUserSearchHistory: vi.fn(),
    deleteUserSearchEntry: vi.fn(),
  };
});

import {
  getUserSearchHistory,
  deleteUserSearchEntry,
} from "../../../services/historyService";

describe("SearchHistoryModal", () => {
  const mockClose = vi.fn();
  const mockUserId = "user123";

  const mockHistoryData = [
    {
      _id: "1",
      query: "iphone",
      timestamp: new Date().toISOString(),
    },
    {
      _id: "2",
      query: "samsung",
      timestamp: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders search history entries", async () => {
    (getUserSearchHistory as any).mockResolvedValue({ data: mockHistoryData });

    render(<SearchHistoryModal userId={mockUserId} onClose={mockClose} />);

    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
      expect(screen.getByText(/samsung/i)).toBeInTheDocument();
    });
  });

  it("handles delete entry", async () => {
    (getUserSearchHistory as any).mockResolvedValue({ data: mockHistoryData });
    (deleteUserSearchEntry as any).mockResolvedValue({});

    render(<SearchHistoryModal userId={mockUserId} onClose={mockClose} />);

    await waitFor(() => {
      expect(screen.getByText(/iphone/i)).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Delete");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(deleteUserSearchEntry).toHaveBeenCalledWith(mockUserId, "1");
    });
  });

  it("renders fallback message when no history", async () => {
    (getUserSearchHistory as any).mockResolvedValue({ data: [] });

    render(<SearchHistoryModal userId={mockUserId} onClose={mockClose} />);

    await waitFor(() => {
      expect(screen.getByText(/No history found/i)).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked", async () => {
    (getUserSearchHistory as any).mockResolvedValue({ data: mockHistoryData });

    render(<SearchHistoryModal userId={mockUserId} onClose={mockClose} />);

    await waitFor(() => {
      const closeBtn = screen.getByText("Close");
      fireEvent.click(closeBtn);
      expect(mockClose).toHaveBeenCalled();
    });
  });
});