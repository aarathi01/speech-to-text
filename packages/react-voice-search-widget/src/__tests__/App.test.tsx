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

  it("renders ToastContainer globally", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    // Check toast container by its role
    expect(document.querySelector(".Toastify")).toBeInTheDocument();
  });
});
