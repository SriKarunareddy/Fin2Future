import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import lessonService from '../services/lessonService';
import progressService from '../services/progressService';
import { GUEST_USER_ID, theme } from '../theme';

const LessonPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const lessonData = await lessonService.getLessonById(id);
        setLesson(lessonData);
        const progressData = await progressService.startLesson(GUEST_USER_ID, id);
        setProgress(progressData.progress);
        setIsCompleted(progressData.completed);
      } catch (err) {
        setError(err.response?.status === 403
          ? 'This lesson is locked. Complete the prerequisite first.'
          : 'Failed to load lesson.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleProgressUpdate = async (value) => {
    setSaving(true);
    try {
      const updated = await progressService.updateProgress(GUEST_USER_ID, id, value);
      setProgress(updated.progress);
      setIsCompleted(updated.completed);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', color: theme.textSecondary }}>Loading lesson...</div>
  );

  if (error) return (
    <div style={{ maxWidth: '600px', margin: '80px auto', padding: '20px', textAlign: 'center' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔒</div>
      <p style={{ color: '#f87171', fontSize: '16px', marginBottom: '24px' }}>{error}</p>
      <button onClick={() => navigate('/lessons')} style={btn(theme.blue)}>← Back to Lessons</button>
    </div>
  );

  const levelColor = { Beginner: theme.green, Intermediate: theme.blue, Advanced: theme.purple }[lesson.level] || theme.blue;

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '36px 24px' }}>

      {/* Breadcrumb */}
      <div style={{ marginBottom: '24px', fontSize: '13px', color: theme.textMuted, display: 'flex', gap: '6px', alignItems: 'center' }}>
        <span onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', color: theme.blue }}>Dashboard</span>
        <span>›</span>
        <span onClick={() => navigate('/lessons')} style={{ cursor: 'pointer', color: theme.blue }}>Lessons</span>
        <span>›</span>
        <span style={{ color: theme.textSecondary }}>{lesson.title}</span>
      </div>

      {/* Lesson header card */}
      <div style={{
        backgroundColor: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '16px', padding: '28px', marginBottom: '20px',
        position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '4px',
          background: `linear-gradient(90deg, ${theme.blue}, ${theme.purple})`
        }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{ padding: '4px 10px', backgroundColor: `${levelColor}22`, color: levelColor, borderRadius: '6px', fontSize: '12px', fontWeight: '600' }}>
            {lesson.level}
          </span>
          <span style={{ padding: '4px 10px', backgroundColor: theme.border, color: theme.textSecondary, borderRadius: '6px', fontSize: '12px' }}>
            {lesson.category}
          </span>
          <span style={{ padding: '4px 10px', backgroundColor: theme.border, color: theme.textSecondary, borderRadius: '6px', fontSize: '12px' }}>
            ⏱ {lesson.duration} min
          </span>
        </div>
        <h1 style={{ margin: '0 0 14px 0', color: theme.textPrimary, fontSize: '22px', fontWeight: '700' }}>
          {lesson.title}
        </h1>
        <p style={{ color: theme.textSecondary, lineHeight: '1.7', margin: 0, fontSize: '14px' }}>
          {lesson.description}
        </p>
      </div>

      {/* Progress card */}
      <div style={{
        backgroundColor: theme.surface, border: `1px solid ${theme.border}`,
        borderRadius: '16px', padding: '26px', marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ color: theme.textPrimary, fontWeight: '600', fontSize: '15px' }}>Your Progress</span>
          <span style={{
            fontWeight: '700', fontSize: '18px',
            color: isCompleted ? theme.green : theme.blue
          }}>
            {isCompleted ? '✅ Completed!' : `${progress}%`}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ height: '12px', backgroundColor: theme.border, borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
          <div style={{
            width: `${progress}%`, height: '100%', borderRadius: '8px',
            background: isCompleted
              ? `linear-gradient(90deg, ${theme.green}, #16a34a)`
              : `linear-gradient(90deg, ${theme.blue}, ${theme.blueLight})`,
            transition: 'width 0.5s ease',
            boxShadow: `0 0 12px ${isCompleted ? theme.green : theme.blue}66`
          }} />
        </div>

        {!isCompleted ? (
          <>
            <input
              type="range" min="0" max="100" step="5" value={progress}
              onChange={e => handleProgressUpdate(parseInt(e.target.value))}
              style={{ width: '100%', marginBottom: '18px', accentColor: theme.blue, cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {[25, 50, 75].map(v => (
                <button
                  key={v}
                  onClick={() => handleProgressUpdate(Math.max(progress, v))}
                  disabled={saving || progress >= v}
                  style={{
                    ...btn(theme.blue),
                    opacity: progress >= v ? 0.35 : 1,
                    fontSize: '13px', padding: '8px 16px'
                  }}
                >
                  {v}%
                </button>
              ))}
              <button
                onClick={() => handleProgressUpdate(100)}
                disabled={saving}
                style={{ ...btn(theme.green), fontSize: '13px', padding: '8px 20px', marginLeft: 'auto' }}
              >
                Mark Complete ✓
              </button>
            </div>
          </>
        ) : (
          <div style={{
            padding: '18px', borderRadius: '10px',
            background: `linear-gradient(135deg, ${theme.green}22, ${theme.blue}11)`,
            border: `1px solid ${theme.green}44`,
            color: theme.green, textAlign: 'center', fontSize: '15px', fontWeight: '500'
          }}>
            🎉 Great job! You've completed this lesson.
          </div>
        )}
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button onClick={() => navigate('/lessons')} style={btn(theme.surfaceHover, theme.border, theme.textSecondary)}>
          ← Back to Lessons
        </button>
        {isCompleted && (
          <button
            onClick={() => navigate('/dashboard')}
            style={{ ...btn(theme.blue), background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})` }}
          >
            View Dashboard →
          </button>
        )}
      </div>
    </div>
  );
};

const btn = (bg, border, color) => ({
  padding: '11px 22px',
  backgroundColor: bg,
  color: color || 'white',
  border: `1px solid ${border || 'transparent'}`,
  borderRadius: '10px',
  fontSize: '14px',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'opacity 0.2s',
});

export default LessonPlayer;
