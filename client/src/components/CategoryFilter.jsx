import React from 'react';

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  const categories = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'];

  return (
    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category === 'All' ? '' : category)}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '20px',
            backgroundColor: selectedCategory === (category === 'All' ? '' : category) ? '#2196F3' : 'white',
            color: selectedCategory === (category === 'All' ? '' : category) ? 'white' : '#333',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
