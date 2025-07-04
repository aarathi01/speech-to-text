/// <reference types="vitest/globals" />

import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RegisterPage from "../../pages/RegisterPage";
import { BrowserRouter } from "react-router-dom";
// Mocks
import * as authService from "../../services/authService";
import * as authContext from "../../context/useAuth";
import * as errorHandler from "../../utils/errorHandler";

vi.mock("../../services/authService");
vi.mock("../../utils/errorHandler");
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
      <RegisterPage />
    </BrowserRouter>
  );

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renders all input fields and button", () => {
    renderWithRouter();
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(4); // name, email, country, phone
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    renderWithRouter();
    const button = screen.getByRole("button", { name: /sign-up/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(errorHandler.showError).toHaveBeenCalledWith("All fields are required.");
    });
  });

  it("handles successful registration and navigates to /voice", async () => {
    const mockUser = { id: "123", username: "testUser", role: "user", email: "a@b.com" };
    const setUser = vi.fn();
    vi.spyOn(authContext, "useAuth").mockReturnValue({
      setUser,
      user: null,
      loading: false
    });

    (authService.register as any).mockResolvedValue(mockUser);

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "India" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "securepass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-up/i }));

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(mockUser);
      expect(localStorage.getItem("isAuthenticated")).toBe("true");
      expect(localStorage.getItem("user")).toContain("testUser");
      expect(errorHandler.showSuccess).toHaveBeenCalledWith("Registration successful! You are now logged in.");
    });
  });

  it("shows registration error if backend fails", async () => {
    (authService.register as any).mockRejectedValue({
      response: { data: { error: "Email already exists" } },
    });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "testUser" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "a@b.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Country"), {
      target: { value: "India" },
    });
    fireEvent.change(screen.getByPlaceholderText("Phone"), {
      target: { value: "1234567890" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "securepass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign-up/i }));

    await waitFor(() => {
      expect(errorHandler.showError).toHaveBeenCalledWith("Email already exists");
    });
  });

  it("navigates to login page on text click", async () => {
    renderWithRouter();
    fireEvent.click(screen.getByText(/Already have an account/i));
    await waitFor(() => {
      expect(window.location.pathname).toBe("/login");
    });
  });
});
