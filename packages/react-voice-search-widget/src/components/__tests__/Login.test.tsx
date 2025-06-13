import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "../Login";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";

// Mock axios
vi.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Login Component", () => {
  const renderWithRouter = () =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders login form", () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText("email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Sign-In")).toBeInTheDocument();
  });

  it("toggles to registration form", async () => {
    renderWithRouter();
    fireEvent.click(screen.getByText("Don't have an account? Register"));
    expect(screen.getByText("Sign-Up")).toBeInTheDocument();
    expect(
      screen.getByText("Already have an account? Login")
    ).toBeInTheDocument();
  });

  it("shows registration error", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    mockedAxios.post.mockRejectedValueOnce({
      response: {
        data: { error: "email already exists" },
      },
    });

    renderWithRouter();

    fireEvent.click(screen.getByText("Don't have an account? Register"));

    await userEvent.clear(screen.getByPlaceholderText("email"));
    await userEvent.clear(screen.getByPlaceholderText("Password"));
    await userEvent.type(screen.getByPlaceholderText("email"), "newuser");
    await userEvent.type(screen.getByPlaceholderText("Password"), "newpass");

    fireEvent.click(screen.getByText("Sign-Up"));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        "Registration Failed: email already exists"
      );
    });
  });

  it("logs in successfully", async () => {
    const token = "mocked-jwt-token";
    const user = userEvent.setup();

    mockedAxios.post.mockResolvedValueOnce({ data: { token } });

    renderWithRouter();

    await user.type(screen.getByPlaceholderText("email"), "newuser");
    await user.type(screen.getByPlaceholderText("Password"), "newpass");
    await user.click(screen.getByRole("button", { name: /Sign-In/i }));


    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        "http://localhost:5000/auth/login",
        { email: "newuser", password: "newpass" }
      );

      expect(localStorage.getItem("token")).toBe(token);
    });
  });

  it("shows login error on failure", async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { data: { error: "Invalid credentials" } },
    });
    vi.spyOn(window, "alert").mockImplementation(() => {});

    renderWithRouter();
    await userEvent.type(screen.getByPlaceholderText("email"), "wronguser");
    await userEvent.type(screen.getByPlaceholderText("Password"), "wrongpass");
    fireEvent.click(screen.getByText("Sign-In"));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Login Failed: Invalid credentials"
      );
    });
  });
});
