import React from 'react';

interface Result {
  id: number;
  name: string;
  category: string;
  score: number;
}

interface Props {
  results: Result[];
  transcript: string;
}

const highlight = (text: string, keyword: string) => {
  const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === keyword.toLowerCase() ? <mark key={i}>{part}</mark> : part
  );
};

const SearchResults: React.FC<Props> = ({ results, transcript }) => {
  if (!results.length) return null;

  return (
    <div style={{ textAlign: 'left', marginTop: '2rem' }}>
      <h3>Search Results:</h3>
      {results.map(result => (
        <div key={result.id} style={{ padding: '0.5rem', borderBottom: '1px solid #ddd' }}>
          <div><strong>Name:</strong> {highlight(result.name, transcript)}</div>
          <div><strong>Category:</strong> {highlight(result.category, transcript)}</div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;