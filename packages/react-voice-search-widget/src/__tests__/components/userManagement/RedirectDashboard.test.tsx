/// <reference types="vitest/globals" />
import { render } from "@testing-library/react";
import { vi } from "vitest";

// Mock useNavigate globally
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe("RedirectDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules(); // reset modules between dynamic imports
  });

  it("redirects to /dashboard for admin", async () => {
    vi.doMock("../../../context/useAuth", () => ({
      useAuth: () => ({
        user: { role: "admin" },
        loading: false,
      }),
    }));

    const { default: RedirectDashboard } = await import(
      "../../../components/userManagement/RedirectDashboard"
    );
    render(<RedirectDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to /dashboard for superadmin", async () => {
    vi.doMock("../../../context/useAuth", () => ({
      useAuth: () => ({
        user: { role: "superadmin" },
        loading: false,
      }),
    }));

    const { default: RedirectDashboard } = await import(
      "../../../components/userManagement/RedirectDashboard"
    );
    render(<RedirectDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });

  it("redirects to /voice for user", async () => {
    vi.doMock("../../../context/useAuth", () => ({
      useAuth: () => ({
        user: { role: "user" },
        loading: false,
      }),
    }));

    const { default: RedirectDashboard } = await import(
      "../../../components/userManagement/RedirectDashboard"
    );
    render(<RedirectDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/voice");
  });

  it("redirects to /login if no user", async () => {
    vi.doMock("../../../context/useAuth", () => ({
      useAuth: () => ({
        user: null,
        loading: false,
      }),
    }));

    const { default: RedirectDashboard } = await import(
      "../../../components/userManagement/RedirectDashboard"
    );
    render(<RedirectDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("redirects to /login for unknown role", async () => {
    vi.doMock("../../../context/useAuth", () => ({
      useAuth: () => ({
        user: { role: "guest" },
        loading: false,
      }),
    }));

    const { default: RedirectDashboard } = await import(
      "../../../components/userManagement/RedirectDashboard"
    );
    render(<RedirectDashboard />);
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
