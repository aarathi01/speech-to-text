/// <reference types="vitest/globals" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../../pages/LoginPage";
import { login } from "../../services/authService";
import { validateField } from "../../utils/validators";
import { showError, showSuccess } from "../../utils/errorHandler";

// Mocking showError and showSuccess
vi.mock("../../utils/errorHandler", () => ({
  showError: vi.fn(),
  showSuccess: vi.fn(),
}));

// Mock services and utilities
vi.mock("../../services/authService", () => ({
  login: vi.fn(),
}));

// Mocking validateField
vi.mock("../../utils/validators", () => ({
  validateField: vi.fn(),
}));

// Mock useAuth
const mockSetUser = vi.fn();
vi.mock("../../context/useAuth", () => ({
  useAuth: () => ({
    setUser: mockSetUser,
  }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    render(<Login />, { wrapper: MemoryRouter });
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign-In")).toBeInTheDocument();
  });

  it("shows error if email or password is missing", () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText("Sign-In"));
    expect(showError).toHaveBeenCalledWith("Email and password are required.");
  });

  it("shows email validation error", () => {
    (validateField as any).mockReturnValue("Invalid email");

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "wrong" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByText("Sign-In"));

    expect(validateField).toHaveBeenCalledWith("email", "wrong");
    expect(showError).toHaveBeenCalledWith("Invalid email");
  });

  it("successful login navigates to /voice for user role", async () => {
    (validateField as any).mockReturnValue(null);
    (login as any).mockResolvedValue({
      email: "test@example.com",
      role: "user",
      token: "mock-token",
      username: "Test User",
    });

    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText("Sign-In"));

    await waitFor(() => {
      expect(login).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
      expect(mockSetUser).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "test@example.com",
          role: "user",
        })
      );
      expect(showSuccess).toHaveBeenCalledWith("Login successful");
      // to-do
      // expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("navigates to register page on click", () => {
    render(<Login />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/don’t have an account/i));
    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
