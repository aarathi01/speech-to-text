import React from 'react';
import type { Result } from '../types/types';

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
    <div>
      <h3>Search Results:</h3>
      {results.map(result => (
        <div className='search-result' key={result.id}>
          <div><strong>Name:</strong> {highlight(result.name, transcript)}</div>
          <div><strong>Category:</strong> {highlight(result.category, transcript)}</div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(SearchResults);