import React from "react";
import type { Result } from "../types/types";

interface Props {
  results: Result[];
  transcript: string;
}

const highlight = (text: string, words: string[]) => {
  if (!words || words.length === 0) return text;

  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, i) =>
    words.some((word) => part.toLowerCase() === word.toLowerCase()) ? (
      <mark key={i}>{part}</mark>
    ) : (
      part
    )
  );
};

const SearchResults: React.FC<Props> = ({ results }) => {
  if (!results.length) return null;
  return (
    <div>
      <h3>Search Results:</h3>
      {results.map((result) => (
        <div className="search-result" key={result.id}>
          <div>
            <strong>Name:</strong> {highlight(result.name, result.matchedWords)}
          </div>
          <div>
            <strong>Category:</strong>{" "}
            {highlight(result.category, result.matchedWords)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SearchResults);
