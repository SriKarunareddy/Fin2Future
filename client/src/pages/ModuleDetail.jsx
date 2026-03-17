import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import learningApi from '../api/learning.api';

export default function ModuleDetail({ user }) {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchModule();
  }, [moduleId]);

  const fetchModule = async () => {
    try {
      const data = await learningApi.getModule(moduleId);
      setModule(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading module...</div>;
  if (!module) return <div className="p-20 text-center text-rose-500">Module not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <Link to="/lessons" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to All Modules
      </Link>

      <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-white/10 rounded-[3rem] p-12 mb-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-3xl -z-10"></div>
        <span className="bg-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full mb-6 inline-block border border-indigo-500/20">
          Curriculum • {module.category}
        </span>
        <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{module.title}</h1>
        <p className="text-slate-400 text-lg leading-relaxed max-w-2xl">{module.description}</p>
      </div>

      <h2 className="text-2xl font-black text-white mb-8 px-4 flex items-center gap-3">
        Included Lessons 
        <span className="text-sm font-normal text-slate-500">({module.lessons?.length || 0})</span>
      </h2>

      <div className="space-y-4">
        {module.lessons?.map((lesson, index) => (
          <Link
            key={lesson._id}
            to={`/lessons/${lesson._id}`}
            className="group block bg-white/5 border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.08] transition-all relative overflow-hidden"
          >
            <div className="flex items-center gap-8">
              <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 rounded-2xl flex items-center justify-center font-black text-xl group-hover:scale-110 transition-transform">
                {index + 1}
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">{lesson.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-1">{lesson.description}</p>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-xs font-black text-slate-500 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg mb-2">
                  {lesson.duration} Mins
                </span>
                <span className="text-indigo-500 font-bold group-hover:translate-x-2 transition-transform">Start →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
