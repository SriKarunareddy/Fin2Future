import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Start':
        return '#4CAF50';
      case 'Continue':
        return '#2196F3';
      case 'Review':
        return '#FFC107';
      case 'Locked':
        return '#9E9E9E';
      default:
        return '#757575';
    }
  };

  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '12px',
        backgroundColor: getStatusColor(),
        color: 'white',
        fontSize: '12px',
        fontWeight: '600'
      }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
