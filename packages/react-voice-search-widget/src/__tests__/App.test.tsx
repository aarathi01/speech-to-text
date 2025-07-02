/// <reference types="vitest/globals" />

import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Mocks
vi.mock("../components/PrivateRoute", () => ({
  default: (props: { children: React.ReactNode }) => <>{props.children}</>,
}));

vi.mock("../components/PublicRoute", () => ({
  default: (props: { children: React.ReactNode }) => <>{props.children}</>,
}));


vi.mock("../components/VoiceInput", () => ({
  default: () => <div>Mocked VoiceInput</div>,
}));

vi.mock("../pages/LoginPage", () => ({
  default: () => <div>Login</div>,
}));

vi.mock("../pages/RegisterPage", () => ({
  default: () => <div>Register</div>,
}));
vi.mock("../pages/AdminDashboard", () => ({
  default: () => <div>Admin Dashboard</div>,
}));
vi.mock("../pages/UserManagementPanel", () => ({
  default: () => <div>User Management</div>,
}));
vi.mock("../components/userManagement/RedirectDashboard", () => ({
  default: () => <div>Redirecting based on role</div>,
}));

describe("App Routing", () => {
  it("renders VoiceInput on '/voice' route", () => {
    render(
      <MemoryRouter initialEntries={["/voice"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Mocked VoiceInput")).toBeInTheDocument();
  });

  it("renders Login on '/login' route", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });

  it("renders Register on '/register' route", () => {
    render(
      <MemoryRouter initialEntries={["/register"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  it("renders Admin Dashboard on '/dashboard' route", () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Admin Dashboard")).toBeInTheDocument();
  });

  it("renders User Management Panel on '/admin' route", () => {
    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("User Management")).toBeInTheDocument();
  });

  it("renders VoiceInput on '/admin-voice' route", () => {
    render(
      <MemoryRouter initialEntries={["/admin-voice"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Mocked VoiceInput")).toBeInTheDocument();
  });

  it("renders RedirectDashboard on root '/' route", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByText("Redirecting based on role")).toBeInTheDocument();
  });

  it("renders ToastContainer globally", () => {
    render(
      <MemoryRouter initialEntries={["/login"]}>
        <App />
      </MemoryRouter>
    );
    expect(document.querySelector(".Toastify")).toBeInTheDocument();
  });
});
