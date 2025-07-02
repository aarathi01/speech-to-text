/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from "@testing-library/react";
import ConfirmActionModal from "../../components/ConfirmActionModal";

describe("ConfirmActionModal", () => {
  const mockOnCancel = vi.fn();
  const mockOnConfirm = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default props", () => {
    render(
      <ConfirmActionModal
        message="Are you sure?"
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
      />
    );

    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("renders with custom labels and primary style", () => {
    render(
      <ConfirmActionModal
        message="Confirm changes?"
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
        confirmLabel="Apply"
        cancelLabel="Back"
        confirmStyle="primary"
      />
    );

    expect(screen.getByText("Confirm changes?")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("calls onCancel when Cancel button is clicked", () => {
    render(
      <ConfirmActionModal
        message="Delete item?"
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("calls onConfirm when Confirm button is clicked", () => {
    render(
      <ConfirmActionModal
        message="Delete item?"
        onCancel={mockOnCancel}
        onConfirm={mockOnConfirm}
      />
    );

    fireEvent.click(screen.getByText("Delete"));
    expect(mockOnConfirm).toHaveBeenCalled();
  });
});
