import React from 'react';

const ProgressBar = ({ progress, height = 8, color = '#4CAF50' }) => {
  return (
    <div style={{ width: '100%', marginTop: '8px' }}>
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: '#e0e0e0',
          borderRadius: '4px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            backgroundColor: color,
            transition: 'width 0.3s ease'
          }}
        />
      </div>
      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
        {progress}% complete
      </div>
    </div>
  );
};

export default ProgressBar;
