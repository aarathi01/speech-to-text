/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from "@testing-library/react";
import UserActionDropdown from "../../../components/ui/UserActionDropdown";

// Mock CSS module
vi.mock("../../components/UserActionDropdown.module.css", () => {
  return {
    dropdown: "dropdown",
    dropbtn: "dropbtn",
    dropdownContent: "dropdownContent",
    openUp: "openUp",
  };
});

describe("UserActionDropdown", () => {
  const baseProps = {
    onPromote: vi.fn(),
    onHistory: vi.fn(),
    onBlockToggle: vi.fn(),
    onDelete: vi.fn(),
    role: "admin",
    targetUserRole: "user",
    isBlocked: false,
    isCurrentUser: false,
    canPromote: true,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders dropdown and shows all buttons", () => {
    render(<UserActionDropdown {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    
    expect(screen.getByText("View History")).toBeInTheDocument();
    expect(screen.getByText("Block")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
    expect(screen.getByText("Promote to Admin")).toBeInTheDocument();
  });

  it("calls correct handlers on button click", () => {
    render(<UserActionDropdown {...baseProps} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));

    fireEvent.click(screen.getByText("View History"));
    expect(baseProps.onHistory).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Block"));
    expect(baseProps.onBlockToggle).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Delete"));
    expect(baseProps.onDelete).toHaveBeenCalled();

    fireEvent.click(screen.getByText("Promote to Admin"));
    expect(baseProps.onPromote).toHaveBeenCalled();
  });

  it("disables block and delete if current user or target is superadmin", () => {
    render(
      <UserActionDropdown
        {...baseProps}
        targetUserRole="superadmin"
        isCurrentUser={false}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    expect(screen.getByText("Block")).toBeDisabled();
    expect(screen.getByText("Delete")).toBeDisabled();
  });

  it("disables block and delete for current user", () => {
    render(
      <UserActionDropdown
        {...baseProps}
        isCurrentUser={true}
        targetUserRole="user"
      />
    );
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    expect(screen.getByText("Block")).toBeDisabled();
    expect(screen.getByText("Delete")).toBeDisabled();
  });

  it("does not render promote button if canPromote is false", () => {
    render(<UserActionDropdown {...baseProps} canPromote={false} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    expect(screen.queryByText("Promote to Admin")).not.toBeInTheDocument();
  });

  it("shows 'Unblock' when user is blocked", () => {
    render(<UserActionDropdown {...baseProps} isBlocked={true} />);
    fireEvent.click(screen.getByRole("button", { name: "⋮" }));
    expect(screen.getByText("Unblock")).toBeInTheDocument();
  });
});
