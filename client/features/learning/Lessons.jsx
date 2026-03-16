import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lessonService from '../../src/services/lessonService';
import progressService from '../../src/services/progressService';
import authService from '../../src/services/authService';
import ProgressBar from '../../src/components/ProgressBar';

export default function Lessons() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetchLesson();
  }, [id]);

  const fetchLesson = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const lessonData = await lessonService.getLessonById(id);
      setLesson(lessonData);

      try {
        const progressData = await progressService.startLesson(user.id, id);
        setProgress(progressData.progress);
        setIsCompleted(progressData.completed);
      } catch (err) {
        if (err.response?.status === 403) {
          setError('This lesson is locked. Complete the prerequisite first.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleProgressUpdate = async (newProgress) => {
    try {
      const user = authService.getCurrentUser();
      const updated = await progressService.updateProgress(user.id, id, newProgress);
      setProgress(updated.progress);
      setIsCompleted(updated.completed);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to update progress');
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (error) {
    return (
      <div style={{ maxWidth: '800px', margin: '50px auto', padding: '20px' }}>
        <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>
        <button onClick={() => navigate('/lessons')}>Back to Lessons</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button onClick={() => navigate('/lessons')} style={{ marginBottom: '20px' }}>
        ← Back to Lessons
      </button>

      <h1>{lesson.title}</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <span style={{ padding: '4px 12px', backgroundColor: '#E3F2FD', borderRadius: '4px' }}>
          {lesson.category}
        </span>
        <span style={{ padding: '4px 12px', backgroundColor: '#F3E5F5', borderRadius: '4px' }}>
          {lesson.level}
        </span>
        <span style={{ padding: '4px 12px', backgroundColor: '#FFF3E0', borderRadius: '4px' }}>
          {lesson.duration} min
        </span>
      </div>

      <p style={{ fontSize: '16px', lineHeight: '1.6', color: '#333' }}>{lesson.description}</p>

      <div style={{ marginTop: '30px' }}>
        <h3>Your Progress</h3>
        <ProgressBar progress={progress} height={12} />
      </div>

      {isCompleted && (
        <div style={{ 
          marginTop: '20px', 
          padding: '15px', 
          backgroundColor: '#E8F5E9', 
          borderRadius: '8px',
          color: '#2E7D32'
        }}>
          🎉 Congratulations! You've completed this lesson!
        </div>
      )}

      <div style={{ marginTop: '30px' }}>
        <h3>Update Progress</h3>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => handleProgressUpdate(parseInt(e.target.value))}
          style={{ width: '100%' }}
        />
        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button onClick={() => handleProgressUpdate(Math.min(progress + 25, 100))}>
            +25%
          </button>
          <button onClick={() => handleProgressUpdate(100)} style={{ marginLeft: '10px' }}>
            Mark Complete
          </button>
        </div>
      </div>
    </div>
  );
}
