import { useState, useEffect } from 'react';
import govApi from '../api/gov.api';

export default function AdminGovFinance({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'Scheme',
    sourceUrl: '',
    isHero: false
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await govApi.getPosts();
      setPosts(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await govApi.createPost(newPost, user.token);
      setShowAddModal(false);
      setNewPost({ title: '', content: '', category: 'Scheme', sourceUrl: '', isHero: false });
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gov post?')) return;
    try {
      await govApi.deletePost(id, user.token);
      fetchPosts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-black text-white">Gov Finance Management</h1>
          <p className="text-slate-400">Manage government schemes, budget updates and economic alerts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-rose-600/20"
        >
          Add Learning Card
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-bold">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
           {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white/5 rounded-3xl"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 group relative">
              <span className="text-[10px] font-black uppercase text-rose-400 bg-rose-500/10 px-2 py-1 rounded mb-4 inline-block">
                {post.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
              <p className="text-slate-500 text-sm line-clamp-3 mb-6">{post.content}</p>
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-600">{new Date(post.createdAt).toLocaleDateString()}</span>
                <button 
                  onClick={() => handleDelete(post._id)}
                  className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <form onSubmit={handleSubmit} className="relative bg-slate-900 border border-white/10 p-8 rounded-[2.5rem] w-full max-w-lg shadow-2xl">
            <h3 className="text-2xl font-black mb-6">New Gov Learning Card</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Title</label>
                <input
                  required
                  type="text"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newPost.title}
                  onChange={e => setNewPost({...newPost, title: e.target.value})}
                  placeholder="e.g. Budget 2024: New Income Tax Slabs"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Category</label>
                <select
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newPost.category}
                  onChange={e => setNewPost({...newPost, category: e.target.value})}
                >
                  {['Scheme', 'Budget', 'Taxation', 'Economic Trend', 'RBI Update'].map(c => <option key={c} value={c} className="bg-slate-900">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Detailed Content</label>
                <textarea
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white h-32"
                  value={newPost.content}
                  onChange={e => setNewPost({...newPost, content: e.target.value})}
                  placeholder="Explain the update in detail..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Source URL (Optional)</label>
                <input
                  type="url"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  value={newPost.sourceUrl}
                  onChange={e => setNewPost({...newPost, sourceUrl: e.target.value})}
                  placeholder="https://pib.gov.in/..."
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 rounded-xl border border-white/10">Cancel</button>
                <button type="submit" className="flex-1 py-3 rounded-xl bg-rose-600 font-bold">Add Card</button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
