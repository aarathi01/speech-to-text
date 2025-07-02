/// <reference types="vitest/globals" />
import { render, screen, fireEvent } from "@testing-library/react";
import DashboardCard from "../../components/DashboardCard";

describe("DashboardCard", () => {
  it("renders title and value correctly", () => {
    render(<DashboardCard title="Users" value={42} />);
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("shows tooltip with default text on click", () => {
    render(<DashboardCard title="Searches" value={100} />);
    fireEvent.click(screen.getByText(/More info/i));
    expect(screen.getByText("No additional information available.")).toBeInTheDocument();
  });

  it("shows tooltip with provided infoText", () => {
    render(
      <DashboardCard
        title="Searches"
        value={123}
        infoText="This shows the total number of voice searches."
      />
    );
    fireEvent.click(screen.getByText(/More info/i));
    expect(screen.getByText("This shows the total number of voice searches.")).toBeInTheDocument();
  });

  it("hides tooltip when clicking outside", () => {
    render(<DashboardCard title="Users" value={50} infoText="User stats" />);
    fireEvent.click(screen.getByText(/More info/i));
    expect(screen.getByText("User stats")).toBeInTheDocument();

    // Simulate outside click
    fireEvent.mouseDown(document.body);
    expect(screen.queryByText("User stats")).not.toBeInTheDocument();
  });

  it("toggles tooltip visibility on repeated clicks", () => {
    render(<DashboardCard title="Sessions" value={10} infoText="Session stats" />);
    const toggle = screen.getByText(/More info/i);

    // First click shows
    fireEvent.click(toggle);
    expect(screen.getByText("Session stats")).toBeInTheDocument();

    // Second click hides
    fireEvent.click(toggle);
    expect(screen.queryByText("Session stats")).not.toBeInTheDocument();
  });
});
