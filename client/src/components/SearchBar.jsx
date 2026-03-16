import React, { useState, useEffect } from 'react';

const SearchBar = ({ searchTerm, onSearchChange }) => {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search lessons..."
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '12px 16px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '14px',
          outline: 'none'
        }}
      />
    </div>
  );
};

export default SearchBar;
