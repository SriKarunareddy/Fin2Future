import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import learningApi from '../../../src/api/learning.api';

export default function LessonsPage() {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'];

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await learningApi.getModules();
      setModules(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredModules = modules.filter(mod => 
    selectedCategory === 'All' || mod.category === selectedCategory
  );

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
      
      <div className="mb-12">
        <h1 className="text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 mb-2 tracking-tighter">
          Financial Modules
        </h1>
        <p className="text-emerald-200/80 font-medium">Step-by-step paths to financial mastery</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-12">
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

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-white/5 rounded-[2.5rem] animate-pulse"></div>)}
        </div>
      ) : filteredModules.length === 0 ? (
        <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
           <p className="text-slate-500 font-bold">No modules available in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredModules.map(mod => (
            <Link
              key={mod._id}
              to={`/learning/modules/${mod._id}`}
              className="group bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col hover:bg-white/[0.08]"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {mod.category}
                </span>
                <span className="text-slate-500 text-sm font-bold uppercase tracking-tighter">{mod.level}</span>
              </div>
              
              <h3 className="text-2xl font-black text-white mb-3 tracking-tight group-hover:text-emerald-400 transition-colors">
                {mod.title}
              </h3>
              <p className="text-slate-400 font-medium text-sm mb-8 leading-relaxed line-clamp-2">
                {mod.description}
              </p>
              
              <div className="mt-auto flex items-center justify-between">
                <span className="text-emerald-500 font-black text-sm uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  View Lessons →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}