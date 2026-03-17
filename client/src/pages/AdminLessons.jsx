import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import learningApi from '../api/learning.api';

export default function AdminLessons({ user }) {
  const { moduleId } = useParams();
  const [module, setModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    duration: 10,
    category: '', // will be inherited
    level: '', // will be inherited
    moduleId: moduleId,
    order: 0
  });

  useEffect(() => {
    fetchModuleAndLessons();
  }, [moduleId]);

  const fetchModuleAndLessons = async () => {
    try {
      const data = await learningApi.getModule(moduleId);
      setModule(data.data);
      setNewLesson(prev => ({ 
        ...prev, 
        category: data.data.category, 
        level: data.data.level,
        order: data.data.lessons.length
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await learningApi.createLesson(newLesson, user.token);
      setShowAddModal(false);
      setNewLesson({ ...newLesson, title: '', description: '', order: newLesson.order + 1 });
      fetchModuleAndLessons();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await learningApi.deleteLesson(id, user.token);
      fetchModuleAndLessons();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading module...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Link to="/admin/learning" className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Modules
      </Link>

      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">{module.title}</h1>
          <p className="text-slate-400">Managing lessons for this module</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
        >
          Add New Lesson
        </button>
      </div>

      <div className="space-y-4">
        {module.lessons.map((lesson, index) => (
          <div key={lesson._id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex justify-between items-center group hover:bg-white/[0.08] transition-all">
            <div className="flex items-center gap-6">
              <div className="w-10 h-10 bg-white/5 text-slate-500 rounded-full flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{lesson.title}</h3>
                <p className="text-sm text-slate-500">{lesson.duration} mins • {lesson.content?.length || 0} Content Blocks</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link 
                to={`/admin/lesson-editor/${lesson._id}`}
                className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all"
              >
                Edit Content
              </Link>
              <button 
                onClick={() => handleDeleteLesson(lesson._id)}
                className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
              </button>
            </div>
          </div>
        ))}

        {module.lessons.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10 text-slate-500">
            No lessons in this module yet.
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleCreateLesson} className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Add Lesson</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Lesson Title</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newLesson.title}
                  onChange={e => setNewLesson({...newLesson, title: e.target.value})}
                  placeholder="e.g. Introduction to SIPs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Short Description</label>
                <textarea
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-20"
                  value={newLesson.description}
                  onChange={e => setNewLesson({...newLesson, description: e.target.value})}
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Estimated Duration (mins)</label>
                <input
                  required
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newLesson.duration}
                  onChange={e => setNewLesson({...newLesson, duration: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-white/10">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-indigo-600 font-bold">Add Lesson</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
