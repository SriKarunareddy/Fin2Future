import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import progressService from '../services/progressService';
import authService from '../services/authService';
import ProgressBar from '../components/ProgressBar';

const LearningDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      const data = await progressService.getProgressStats(user.id);
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Learning Dashboard</h1>
      
      <div style={{ marginTop: '30px' }}>
        <h2>Overall Progress</h2>
        <ProgressBar progress={stats.overallPercentage} height={20} />
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginTop: '30px' 
      }}>
        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          backgroundColor: '#E8F5E9' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#2E7D32' }}>Completed</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#2E7D32' }}>
            {stats.completed}
          </p>
        </div>

        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          backgroundColor: '#E3F2FD' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#1565C0' }}>In Progress</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#1565C0' }}>
            {stats.inProgress}
          </p>
        </div>

        <div style={{ 
          padding: '20px', 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          backgroundColor: '#FFF3E0' 
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#E65100' }}>Available</h3>
          <p style={{ fontSize: '36px', fontWeight: 'bold', margin: 0, color: '#E65100' }}>
            {stats.available}
          </p>
        </div>
      </div>

      <button
        onClick={() => navigate('/lessons')}
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          backgroundColor: '#2196F3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        View All Lessons
      </button>
    </div>
  );
};

export default LearningDashboard;
