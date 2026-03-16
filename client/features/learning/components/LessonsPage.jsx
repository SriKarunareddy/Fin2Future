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
    <div className="max-w-6xl mx-auto px-4 py-12">
      <Link 
        to="/learning" 
        className="inline-flex items-center space-x-2 text-emerald-500 hover:text-emerald-400 font-bold mb-8 group transition-all"
      >
        <span className="p-2 bg-emerald-500/10 rounded-lg group-hover:scale-110 transition-transform">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7"></path></svg>
        </span>
        <span>Back to Learning Hub</span>
      </Link>
      
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2 tracking-tighter">
          Financial Lessons
        </h1>
        <p className="text-emerald-200/80 font-medium">Master your financial knowledge with our comprehensive courses</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-8 border border-white/10 mb-12 shadow-2xl">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search lessons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 pl-14 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all group-hover:bg-white/10"
            />
            <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-slate-500 group-hover:text-emerald-400 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all duration-300 border ${
                selectedCategory === category
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-600/20'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-white'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredLessons.map(lesson => (
          <div
            key={lesson.id}
            className="group relative bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col hover:bg-white/[0.08]"
          >
            <div className="flex items-start justify-between mb-6">
              <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20`}>
                {lesson.category}
              </span>
              <span className="text-slate-500 text-sm font-bold">{lesson.duration}</span>
            </div>
            
            <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
              {lesson.title}
            </h3>
            <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed line-clamp-2">
              {lesson.description}
            </p>
            
            <div className="mt-auto flex items-center justify-between">
               <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${
                lesson.difficulty === 'Beginner' ? 'text-green-500' :
                lesson.difficulty === 'Intermediate' ? 'text-amber-500' :
                'text-rose-500'
              }`}>
                {lesson.difficulty} Level
              </span>
              <button className="h-12 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-600/20 active:scale-95">
                {lesson.completed ? 'Review' : 'Start'}
              </button>
            </div>
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