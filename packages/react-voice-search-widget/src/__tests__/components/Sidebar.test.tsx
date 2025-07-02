/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from "@testing-library/react";
import Sidebar from "../../components/Sidebar";
import { MemoryRouter } from "react-router-dom";

const mockNavigate = vi.fn();

// Mock useNavigate first
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockUser = {
  _id: "1",
  role: "admin",
  email: "admin@example.com",
  username: "AdminUser",
};

vi.mock("../../context/useAuth", async () => {
  const actual = await vi.importActual("../../context/useAuth");
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
    }),
  };
});

describe("Sidebar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user's username and email", () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    expect(screen.getByText("AdminUser")).toBeInTheDocument();
    expect(screen.getByText("admin@example.com")).toBeInTheDocument();
  });

  it("navigates to /dashboard on Dashboard click", () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Dashboard"));
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("navigates to /admin-voice for admin", () => {
    mockUser.role = "admin";
    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Voice Search"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-voice");
  });

  it("navigates to /admin-voice for superadmin", () => {
    mockUser.role = "superadmin";
    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Voice Search"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin-voice");
  });

  it("navigates to /voice for user", () => {
    mockUser.role = "user";
    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("Voice Search"));
    expect(mockNavigate).toHaveBeenCalledWith("/voice");
  });

  it("navigates to /admin on User Management click", () => {
    render(<Sidebar />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByText("User Management"));
    expect(mockNavigate).toHaveBeenCalledWith("/admin");
  });
});
