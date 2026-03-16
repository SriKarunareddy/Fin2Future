import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import progressService from '../services/progressService';
import { GUEST_USER_ID, theme } from '../theme';

const StatCard = ({ label, value, color, icon }) => (
  <div style={{
    backgroundColor: theme.surface,
    border: `1px solid ${theme.border}`,
    borderRadius: '14px',
    padding: '24px',
    textAlign: 'center',
    position: 'relative',
    overflow: 'hidden',
  }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
      background: `linear-gradient(90deg, ${color}, ${color}88)`
    }} />
    <div style={{ fontSize: '32px', marginBottom: '6px' }}>{icon}</div>
    <div style={{ fontSize: '36px', fontWeight: '700', color, lineHeight: 1 }}>{value}</div>
    <div style={{ marginTop: '8px', color: theme.textSecondary, fontSize: '13px', fontWeight: '500' }}>{label}</div>
  </div>
);

const LearningDashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, progressData] = await Promise.all([
        progressService.getProgressStats(GUEST_USER_ID),
        progressService.getUserProgress(GUEST_USER_ID)
      ]);
      setStats(statsData);
      const active = progressData
        .filter(p => p.progress > 0)
        .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
        .slice(0, 4);
      setRecentProgress(active);
    } catch {
      setStats({ completed: 0, inProgress: 0, available: 0, overallPercentage: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats, location.key]);

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px', color: theme.textSecondary }}>Loading...</div>
  );

  const pct = stats.overallPercentage || 0;

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '40px 24px' }}>

      {/* XP Header bar — inspired by image */}
      <div style={{
        backgroundColor: theme.surface,
        border: `1px solid ${theme.border}`,
        borderRadius: '16px',
        padding: '20px 28px',
        marginBottom: '32px',
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '50%',
          background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '22px', flexShrink: 0
        }}>👤</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div>
              <div style={{ color: theme.textPrimary, fontWeight: '700', fontSize: '18px' }}>Learning Progress</div>
              <div style={{ color: theme.blue, fontSize: '13px', marginTop: '2px' }}>
                {stats.completed} of {stats.available} lessons completed
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: theme.textSecondary, fontSize: '12px' }}>Overall</div>
              <div style={{ color: theme.orange, fontWeight: '700', fontSize: '20px' }}>{pct}%</div>
            </div>
          </div>
          <div style={{ height: '10px', backgroundColor: '#1e2d3d', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%', borderRadius: '6px',
              background: `linear-gradient(90deg, ${theme.blue}, ${theme.blueLight})`,
              transition: 'width 0.6s ease',
              boxShadow: `0 0 10px ${theme.blue}88`
            }} />
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        <StatCard label="Completed" value={stats.completed} color={theme.green} icon="✅" />
        <StatCard label="In Progress" value={stats.inProgress} color={theme.blue} icon="📖" />
        <StatCard label="Total Lessons" value={stats.available} color={theme.orange} icon="🏆" />
      </div>

      {/* Continue learning */}
      {recentProgress.length > 0 && (
        <div style={{
          backgroundColor: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '28px',
        }}>
          <h3 style={{ margin: '0 0 20px 0', color: theme.textPrimary, fontSize: '16px', fontWeight: '600' }}>
            Continue Learning
          </h3>
          {recentProgress.map((p, i) => {
            const lessonId = p.lessonId?._id || p.lessonId;
            const title = p.lessonId?.title || 'Lesson';
            const barColor = p.completed ? theme.green : theme.blue;
            return (
              <div
                key={p._id}
                onClick={() => navigate(`/lessons/${lessonId}`)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '14px 0',
                  borderBottom: i < recentProgress.length - 1 ? `1px solid ${theme.border}` : 'none',
                  cursor: 'pointer',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                  background: `linear-gradient(135deg, ${theme.blue}44, ${theme.purple}44)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px'
                }}>📘</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: theme.textPrimary, fontWeight: '500', fontSize: '14px', marginBottom: '6px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {title}
                  </div>
                  <div style={{ height: '5px', backgroundColor: theme.border, borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${p.progress}%`, height: '100%', backgroundColor: barColor, borderRadius: '4px', transition: 'width 0.4s' }} />
                  </div>
                </div>
                <div style={{ color: barColor, fontWeight: '600', fontSize: '13px', flexShrink: 0 }}>
                  {p.completed ? '✓ Done' : `${p.progress}%`}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => navigate('/lessons')}
        style={{
          padding: '14px 32px',
          background: `linear-gradient(135deg, ${theme.blue}, ${theme.purple})`,
          color: 'white', border: 'none', borderRadius: '10px',
          fontSize: '15px', cursor: 'pointer', fontWeight: '600',
          boxShadow: `0 4px 20px ${theme.blue}44`,
          transition: 'opacity 0.2s',
        }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
      >
        Browse All Lessons →
      </button>
    </div>
  );
};

export default LearningDashboard;
