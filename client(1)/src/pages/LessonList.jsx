import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lessonService from '../services/lessonService';
import progressService from '../services/progressService';
import authService from '../services/authService';
import LessonCard from '../components/LessonCard';
import CategoryFilter from '../components/CategoryFilter';
import SearchBar from '../components/SearchBar';

const LessonList = () => {
  const [lessons, setLessons] = useState([]);
  const [userProgress, setUserProgress] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [selectedCategory, searchTerm]);

  const fetchData = async () => {
    try {
      const user = authService.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      setLoading(true);

      let lessonData;
      if (searchTerm) {
        lessonData = await lessonService.searchLessons(searchTerm, { category: selectedCategory });
      } else {
        lessonData = await lessonService.getAllLessons({ category: selectedCategory });
      }

      const progressData = await progressService.getUserProgress(user.id);

      setLessons(lessonData.lessons);
      setUserProgress(progressData);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const getLessonProgress = (lessonId) => {
    const progress = userProgress.find(p => p.lessonId._id === lessonId);
    return progress ? progress.progress : 0;
  };

  const getLessonStatus = (lesson) => {
    const progress = userProgress.find(p => p.lessonId._id === lesson._id);
    
    if (lesson.isLocked) return 'Locked';
    if (!progress) return 'Start';
    if (progress.completed) return 'Review';
    if (progress.progress > 0) return 'Continue';
    return 'Start';
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Financial Lessons</h1>

      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      <CategoryFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

      {lessons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
          No lessons found
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '20px' 
        }}>
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson._id}
              lesson={lesson}
              status={getLessonStatus(lesson)}
              progress={getLessonProgress(lesson._id)}
              onClick={() => navigate(`/lessons/${lesson._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonList;
