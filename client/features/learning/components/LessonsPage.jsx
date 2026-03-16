import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function LessonsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [lessons, setLessons] = useState([]);

  const categories = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'];

  useEffect(() => {
    // TODO: Fetch lessons from API
    // Mock data for now
    setLessons([
      {
        id: 1,
        title: 'Introduction to Budgeting',
        category: 'Budgeting',
        description: 'Learn the basics of creating and maintaining a personal budget.',
        duration: '15 min',
        difficulty: 'Beginner',
        completed: false
      },
      {
        id: 2,
        title: 'Emergency Fund Basics',
        category: 'Saving',
        description: 'Why you need an emergency fund and how to build one.',
        duration: '12 min',
        difficulty: 'Beginner',
        completed: false
      },
      {
        id: 3,
        title: 'Credit Score 101',
        category: 'Credit',
        description: 'Understanding credit scores and how they affect your financial life.',
        duration: '20 min',
        difficulty: 'Intermediate',
        completed: false
      }
    ]);
  }, []);

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || lesson.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Link
            to="/learning"
            className="text-emerald-400 hover:text-emerald-300 transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </Link>
        </div>
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2">
          Financial Lessons
        </h1>
        <p className="text-emerald-200/80">Master your financial knowledge with our comprehensive courses</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 mb-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 pl-12 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
              🔍
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLessons.map(lesson => (
          <div
            key={lesson.id}
            className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
          >
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  lesson.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  lesson.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {lesson.difficulty}
                </span>
                <span className="text-slate-400 text-sm">{lesson.duration}</span>
              </div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">
                {lesson.title}
              </h3>
              <p className="text-slate-300 text-sm mb-3">{lesson.description}</p>
              <span className="inline-block px-3 py-1 bg-slate-700 rounded-full text-xs text-slate-400">
                {lesson.category}
              </span>
            </div>

            <button className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105">
              {lesson.completed ? 'Review Lesson' : 'Start Lesson'}
            </button>
          </div>
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-2xl font-bold text-slate-400 mb-2">No lessons found</h3>
          <p className="text-slate-500">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
}