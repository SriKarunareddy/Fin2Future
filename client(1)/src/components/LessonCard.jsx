import React from 'react';
import StatusBadge from './StatusBadge';
import ProgressBar from './ProgressBar';

const LessonCard = ({ lesson, status, progress = 0, onClick }) => {
  const isLocked = status === 'Locked';

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      style={{
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.6 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: 'white'
      }}
      onMouseEnter={(e) => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', color: '#333' }}>{lesson.title}</h3>
        <StatusBadge status={status} />
      </div>
      
      <p style={{ color: '#666', fontSize: '14px', margin: '8px 0' }}>
        {lesson.description.length > 100 
          ? `${lesson.description.substring(0, 100)}...` 
          : lesson.description}
      </p>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
        <span style={{ 
          padding: '4px 8px', 
          backgroundColor: '#E3F2FD', 
          color: '#1976D2', 
          borderRadius: '4px', 
          fontSize: '12px' 
        }}>
          {lesson.category}
        </span>
        <span style={{ 
          padding: '4px 8px', 
          backgroundColor: '#F3E5F5', 
          color: '#7B1FA2', 
          borderRadius: '4px', 
          fontSize: '12px' 
        }}>
          {lesson.level}
        </span>
        <span style={{ 
          padding: '4px 8px', 
          backgroundColor: '#FFF3E0', 
          color: '#E65100', 
          borderRadius: '4px', 
          fontSize: '12px' 
        }}>
          {lesson.duration} min
        </span>
      </div>
      
      {progress > 0 && <ProgressBar progress={progress} />}
    </div>
  );
};

export default LessonCard;
