import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import RegisterPage from "../../pages/RegisterPage";
import { MemoryRouter } from "react-router-dom";

// Mocks
vi.mock("../../services/authService", () => ({
  register: vi.fn()
}));

vi.mock("../../utils/validators", () => ({
  validateField: vi.fn()
}));

vi.mock("../../utils/errorHandler", () => ({
  showError: vi.fn(),
  showSuccess: vi.fn()
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

import { register } from "../../services/authService";
import { validateField } from "../../utils/validators";
import { showError, showSuccess } from "../../utils/errorHandler";

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all input fields and button", () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });

    ["Name", "Email", "Country", "Phone", "Password"].forEach((label) => {
      expect(screen.getByPlaceholderText(label)).toBeInTheDocument();
    });
    expect(screen.getByText("Sign-Up")).toBeInTheDocument();
  });

  it("shows error if fields are empty on submit", () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText("Sign-Up"));
    expect(showError).toHaveBeenCalledWith("All fields are required.");
  });

  it("shows validation errors when typing", () => {
    (validateField as any).mockReturnValue("Invalid name");

    render(<RegisterPage />, { wrapper: MemoryRouter });
    const nameInput = screen.getByPlaceholderText("Name");
    fireEvent.change(nameInput, { target: { value: "a" } });

    expect(validateField).toHaveBeenCalledWith("name", "a");
  });

  it("handles successful registration with token", async () => {
    (validateField as any).mockReturnValue(null);
    (register as any).mockResolvedValue({
      data: { token: "test-token" }
    });

    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" }
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "India" }
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" }
    });

    fireEvent.click(screen.getByText("Sign-Up"));

    await waitFor(() => {
      expect(register).toHaveBeenCalled();
      expect(localStorage.getItem("token")).toBe("test-token");
      expect(showSuccess).toHaveBeenCalledWith("Registration successful! You are now logged in.");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  it("handles registration without token", async () => {
    (validateField as any).mockReturnValue(null);
    (register as any).mockResolvedValue({
      data: {}
    });

    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "John" }
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "john@example.com" }
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "India" }
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" }
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "password123" }
    });

    fireEvent.click(screen.getByText("Sign-Up"));

    await waitFor(() => {
      expect(showSuccess).toHaveBeenCalledWith("Registered successfully! Please login manually.");
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  it("navigates to login when toggle is clicked", () => {
    render(<RegisterPage />, { wrapper: MemoryRouter });

    fireEvent.click(screen.getByText(/already have an account/i));
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
