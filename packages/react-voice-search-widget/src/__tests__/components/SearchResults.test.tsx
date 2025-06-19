import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import SearchResults from "../../components/SearchResults";
import { Result } from "../../types/types";

describe("SearchResults Component", () => {
  const mockResults: Result[] = [
    {
      id: 1,
      name: "Iphone",
      category: "Mobile",
      text: "Iphone is a mobile",
      title: "Iphone Title",
      score: 1,
      matchedWords: ["iphone", "mobile"],
    },
    {
      id: 2,
      name: "Samsung",
      category: "Mobile",
      text: "Samsung is a mobile",
      title: "Samsung Title",
      score: 1,
      matchedWords: ["samsung", "mobile"],
    },
  ];

  it("renders nothing if results array is empty", () => {
    const { container } = render(<SearchResults results={[]} transcript="" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders heading and result content", () => {
    render(<SearchResults results={mockResults} transcript="" />);

    expect(screen.getByText("Search Results:")).toBeInTheDocument();
    expect(screen.getAllByText("Name:").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Category:").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Samsung").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mobile").length).toBeGreaterThan(0);
  });

  it("highlights matched words", () => {
    render(<SearchResults results={mockResults} transcript="" />);

    const highlighted = screen.getAllByText((content, element) => {
      return element?.tagName === "MARK";
    });

    expect(highlighted.length).toBeGreaterThan(0);
    expect(highlighted[0].textContent?.toLowerCase()).toBe("iphone");
  });

  it("does not highlight if no matched words", () => {
    const resultsNoMatch: Result[] = [
      {
        id: 3,
        name: "Dell",
        category: "Laptop",
        text: "",
        title: "",
        score: 0.8,
        matchedWords: [],
      },
    ];

    render(<SearchResults results={resultsNoMatch} transcript="" />);
    expect(screen.getByText("Dell")).toBeInTheDocument();
    expect(screen.getByText("Laptop")).toBeInTheDocument();
  });
});
