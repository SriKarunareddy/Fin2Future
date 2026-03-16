import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lessonService from '../services/lessonService';
import progressService from '../services/progressService';
import { GUEST_USER_ID, theme } from '../theme';

const categoryIcons = {
  Budgeting: '💰', Saving: '🏦', Credit: '💳',
  Investing: '📈', Debt: '📉', Housing: '🏠'
};

const levelColors = {
  Beginner: theme.green,
  Intermediate: theme.blue,
  Advanced: theme.purple,
};

const statusConfig = {
  Start:    { color: theme.blue,   bg: `${theme.blue}22`,   label: 'Start' },
  Continue: { color: theme.orange, bg: `${theme.orange}22`, label: 'Continue' },
  Review:   { color: theme.green,  bg: `${theme.green}22`,  label: '✓ Done' },
  Locked:   { color: '#4a5568',    bg: '#4a556822',         label: '🔒 Locked' },
};

const LessonCard = ({ lesson, status, progress, onClick }) => {
  const isLocked = status === 'Locked';
  const cfg = statusConfig[status] || statusConfig.Start;
  const icon = categoryIcons[lesson.category] || '📚';
  const levelColor = levelColors[lesson.level] || theme.blue;

  return (
    <div
      onClick={!isLocked ? onClick : undefined}
      style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: '16px',
        padding: '22px',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        opacity: isLocked ? 0.5 : 1,
        transition: 'transform 0.15s, border-color 0.15s, box-shadow 0.15s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => {
        if (!isLocked) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = theme.blue;
          e.currentTarget.style.boxShadow = `0 8px 24px ${theme.blue}22`;
        }
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.borderColor = theme.border;
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Top accent line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', backgroundColor: cfg.color, opacity: 0.7 }} />

      {/* Icon + status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
        <div style={{
          width: '46px', height: '46px', borderRadius: '12px',
          background: `linear-gradient(135deg, ${cfg.color}44, ${cfg.color}22)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px'
        }}>{icon}</div>
        <span style={{
          padding: '4px 10px', borderRadius: '20px',
          backgroundColor: cfg.bg, color: cfg.color,
          fontSize: '12px', fontWeight: '600'
        }}>{cfg.label}</span>
      </div>

      <h3 style={{ margin: '0 0 8px 0', color: theme.textPrimary, fontSize: '15px', fontWeight: '600', lineHeight: '1.3' }}>
        {lesson.title}
      </h3>
      <p style={{ color: theme.textSecondary, fontSize: '13px', margin: '0 0 16px 0', lineHeight: '1.5' }}>
        {lesson.description.length > 80 ? lesson.description.slice(0, 80) + '…' : lesson.description}
      </p>

      {/* Tags */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
        <span style={{ padding: '3px 8px', backgroundColor: `${levelColor}22`, color: levelColor, borderRadius: '6px', fontSize: '11px', fontWeight: '600' }}>
          {lesson.level}
        </span>
        <span style={{ padding: '3px 8px', backgroundColor: theme.border, color: theme.textSecondary, borderRadius: '6px', fontSize: '11px' }}>
          ⏱ {lesson.duration} min
        </span>
      </div>

      {/* Progress bar */}
      {progress > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span style={{ color: theme.textMuted, fontSize: '11px' }}>Progress</span>
            <span style={{ color: cfg.color, fontSize: '11px', fontWeight: '600' }}>{progress}%</span>
          </div>
          <div style={{ height: '5px', backgroundColor: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${progress}%`, height: '100%', borderRadius: '4px',
              background: progress === 100
                ? `linear-gradient(90deg, ${theme.green}, #16a34a)`
                : `linear-gradient(90deg, ${theme.blue}, ${theme.blueLight})`,
              boxShadow: `0 0 6px ${cfg.color}66`
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

const CATEGORIES = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'];

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, [selectedCategory, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [lessonData, progressData] = await Promise.all([
        searchTerm
          ? lessonService.searchLessons(searchTerm, { category: selectedCategory })
          : lessonService.getAllLessons({ category: selectedCategory }),
        progressService.getUserProgress(GUEST_USER_ID)
      ]);
      setLessons(lessonData.lessons || []);
      setUserProgress(progressData || []);
    } catch { setLessons([]); }
    finally { setLoading(false); }
  };

  const getProgress = (lessonId) => {
    const p = userProgress.find(p => (p.lessonId?._id || p.lessonId) === lessonId);
    return p ? p.progress : 0;
  };

  const getStatus = (lesson) => {
    if (lesson.isLocked) return 'Locked';
    const p = userProgress.find(p => (p.lessonId?._id || p.lessonId) === lesson._id);
    if (!p) return 'Start';
    if (p.completed) return 'Review';
    if (p.progress > 0) return 'Continue';
    return 'Start';
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h1 style={{ margin: '0 0 6px 0', color: theme.textPrimary, fontSize: '26px', fontWeight: '700' }}>
          Select Your Lesson
        </h1>
        <p style={{ color: theme.textSecondary, margin: 0, fontSize: '14px' }}>
          Choose a lesson to begin your financial literacy journey
        </p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '20px' }}>
        <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: theme.textMuted, fontSize: '16px' }}>🔍</span>
        <input
          type="text"
          placeholder="Search lessons..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%', padding: '12px 14px 12px 40px',
            backgroundColor: theme.surface, border: `1px solid ${theme.border}`,
            borderRadius: '10px', color: theme.textPrimary, fontSize: '14px',
            outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
        {CATEGORIES.map(cat => {
          const val = cat === 'All' ? '' : cat;
          const active = selectedCategory === val;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(val)}
              style={{
                padding: '7px 16px', borderRadius: '20px', fontSize: '13px', fontWeight: '500',
                cursor: 'pointer', border: `1px solid ${active ? theme.blue : theme.border}`,
                backgroundColor: active ? `${theme.blue}22` : theme.surface,
                color: active ? theme.blue : theme.textSecondary,
                transition: 'all 0.15s',
              }}
            >{cat}</button>
          );
        })}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px', color: theme.textSecondary }}>Loading lessons...</div>
      ) : lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px', color: theme.textSecondary }}>No lessons found</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {lessons.map(lesson => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              status={getStatus(lesson)}
              progress={getProgress(lesson._id)}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
