import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import learningApi from '../api/learning.api';

export default function AdminLearning({ user }) {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newModule, setNewModule] = useState({
    title: '',
    description: '',
    category: 'Budgeting',
    level: 'Beginner',
    order: 0
  });

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

  const handleCreateModule = async (e) => {
    e.preventDefault();
    try {
      await learningApi.createModule(newModule, user.token);
      setShowAddModal(false);
      setNewModule({ title: '', description: '', category: 'Budgeting', level: 'Beginner', order: 0 });
      fetchModules();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteModule = async (id) => {
    if (!window.confirm('Delete this module and all its lessons?')) return;
    try {
      await learningApi.deleteModule(id, user.token);
      fetchModules();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Learning Management</h1>
          <p className="text-slate-400">Create curriculum modules and lessons</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20"
        >
          Create New Module
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map(mod => (
            <div key={mod._id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-indigo-500/20 text-indigo-400 text-xs font-black px-3 py-1 rounded-full uppercase">
                  {mod.category} • {mod.level}
                </span>
                <div className="flex gap-2">
                  <Link 
                    to={`/admin/modules/${mod._id}`}
                    className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                  >
                    Edit Lessons
                  </Link>
                  <button 
                    onClick={() => handleDeleteModule(mod._id)}
                    className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-2">{mod.title}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mb-6">{mod.description}</p>
              
              <Link 
                to={`/admin/modules/${mod._id}`}
                className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors"
              >
                Manage Lessons
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Add Module Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleCreateModule} className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black mb-6">Create Learning Module</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Module Title</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newModule.title}
                  onChange={e => setNewModule({...newModule, title: e.target.value})}
                  placeholder="e.g. Budgeting 101"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Description</label>
                <textarea
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-24"
                  value={newModule.description}
                  onChange={e => setNewModule({...newModule, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Category</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    value={newModule.category}
                    onChange={e => setNewModule({...newModule, category: e.target.value})}
                  >
                    {['Budgeting', 'Saving', 'Credit', 'Investing', 'Debt', 'Housing'].map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Level</label>
                  <select
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                    value={newModule.level}
                    onChange={e => setNewModule({...newModule, level: e.target.value})}
                  >
                    {['Beginner', 'Intermediate', 'Advanced'].map(l => <option key={l} value={l} className="bg-slate-900">{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-white/10">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-indigo-600 font-bold">Create Module</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
