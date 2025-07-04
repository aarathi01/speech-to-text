/// <reference types="vitest/globals" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";
import * as authService from "../../services/authService";
import * as errorHandler from "../../utils/errorHandler";
import * as authContext from "../../context/useAuth";

// Mock services and utilities
vi.mock("../../services/authService");
// Mocking errorHandler
vi.mock("../../utils/errorHandler");
// Mock useAuth
vi.mock("../../context/useAuth", async () => {
  const actual = await vi.importActual("../../context/useAuth");
  return {
    ...actual,
    useAuth: () => ({ setUser: vi.fn() }),
  };
});

const renderWithRouter = () =>
  render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders email and password input fields", () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("shows error if fields are empty", async () => {
    renderWithRouter();
    fireEvent.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      expect(errorHandler.showError).toHaveBeenCalledWith("Email and password are required.");
    });
  });

  it("shows error for invalid email format", async () => {
    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      expect(errorHandler.showError).toHaveBeenCalledWith("Invalid email format");
    });
  });

  it("handles successful login and stores user data", async () => {
    const mockUser = { id: "1", email: "a@b.com", role: "user", username: "testUser" };
    const setUser = vi.fn();
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      setUser,
      user: null,
      loading: false
    });
    (authService.login as vi.Mock).mockResolvedValue(mockUser);

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        email: "a@b.com",
        password: "password123",
      });
      expect(setUser).toHaveBeenCalledWith(mockUser);
      expect(localStorage.getItem("isAuthenticated")).toBe("true");
      expect(localStorage.getItem("user")).toContain("a@b.com");
      expect(errorHandler.showSuccess).toHaveBeenCalledWith("Login successful");
    });
  });

  it("does not log in if no role is returned", async () => {
    (authService.login as vi.mock).mockResolvedValue({ email: "a@b.com" });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      expect(errorHandler.showError).toHaveBeenCalledWith("Invalid user role.");
    });
  });

  it("handles server error", async () => {
    (authService.login as vi.mock).mockRejectedValue(new Error("Login failed"));

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-in/i }));

    await waitFor(() => {
      // console.error is invoked inside the component, no UI error shown
      expect(authService.login).toHaveBeenCalled();
    });
  });

  it("navigates to /register when clicking toggle text", async () => {
    renderWithRouter();
    fireEvent.click(screen.getByText(/don’t have an account/i));

    await waitFor(() => {
      expect(window.location.pathname).toBe("/register");
    });
  });
});
