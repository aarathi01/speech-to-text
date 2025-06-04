import { render, screen } from "@testing-library/react";
import SearchResults from "../SearchResults";
import type { Result } from "../../types/types";

describe("SearchResults", () => {
  const mockResults: Result[] = [
    {
        id: 1,
        name: "Apple iPhone",
        category: "Electronics",
        matchedWords: ["Apple", "Electronics"],
        score: 0
    },
    {
        id: 2,
        name: "Orange Juice",
        category: "Groceries",
        matchedWords: ["Orange"],
        score: 0
    },
  ];

  it("renders nothing when results are empty", () => {
    const { container } = render(<SearchResults results={[]} transcript="" />);
    expect(container).toBeEmptyDOMElement();
  });

 it("renders header and results correctly", () => {
  render(<SearchResults results={mockResults} transcript="" />);

  expect(screen.getByText("Search Results:")).toBeInTheDocument();

  const nameLabels = screen.getAllByText("Name:");
  const categoryLabels = screen.getAllByText("Category:");
  
  expect(nameLabels.length).toBe(mockResults.length);
  expect(categoryLabels.length).toBe(mockResults.length);
});


  it("highlights matched words with <mark>", () => {
    const { container } = render(
      <SearchResults results={mockResults} transcript="" />
    );
    const marks = container.querySelectorAll("mark");

    const markedText = Array.from(marks).map((el) =>
      el.textContent?.toLowerCase()
    );

    expect(markedText).toContain("apple");
    expect(markedText).toContain("electronics");
    expect(markedText).toContain("orange");
  });
});
