import { useState, useEffect } from 'react';
import booksApi from '../api/books.api';

export default function AdminBooks({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    category: 'Budgeting'
  });
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getBooks();
      setBooks(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return setError('Please select a PDF file');
    
    setUploading(true);
    setError(null);
    setSuccess(null);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('description', formData.description);
    data.append('category', formData.category);
    data.append('book', file);

    try {
      await booksApi.uploadBook(data, user.token);
      setSuccess('Book uploaded successfully!');
      setFormData({ title: '', author: '', description: '', category: 'Budgeting' });
      setFile(null);
      e.target.reset();
      fetchBooks();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await booksApi.deleteBook(id, user.token);
      fetchBooks();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Manage Library</h1>
          <p className="text-slate-400">Upload and manage educational PDFs for users</p>
        </div>
        <div className="bg-rose-500/10 text-rose-400 px-4 py-2 rounded-xl text-sm font-bold border border-rose-500/20">
          Admin Mode
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Form */}
        <div className="lg:col-span-1">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8 sticky top-8">
            <h2 className="text-xl font-bold text-white mb-6">Upload New Book</h2>
            
            {error && (
              <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold">
                {error}
              </div>
            )}
            
            {success && (
              <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-bold">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Book Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. Mastering Budgeting"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Author</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 h-24 resize-none"
                  placeholder="Brief summary..."
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                >
                  <option value="Budgeting" className="bg-slate-900">Budgeting</option>
                  <option value="Investing" className="bg-slate-900">Investing</option>
                  <option value="Saving" className="bg-slate-900">Saving</option>
                  <option value="Taxes" className="bg-slate-900">Taxes</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-2">PDF File</label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 transition-all cursor-pointer"
                />
                <p className="mt-2 text-[10px] text-slate-500 italic">Max size: 10MB (PDF only)</p>
              </div>
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 mt-4"
              >
                {uploading ? 'Uploading...' : 'Publish to Library'}
              </button>
            </form>
          </div>
        </div>

        {/* Existing Books List */}
        <div className="lg:col-span-2">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[2rem] p-8">
            <h2 className="text-xl font-bold text-white mb-6">Existing Books ({books.length})</h2>
            
            {loading ? (
              <div className="animate-pulse space-y-4">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-2xl"></div>)}
              </div>
            ) : books.length === 0 ? (
              <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                <p className="text-slate-500">No books uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {books.map(book => (
                  <div key={book._id} className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all flex justify-between items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-indigo-600/20 text-indigo-400 rounded-xl flex items-center justify-center font-black">
                        PDF
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-indigo-400 transition-colors">{book.title}</h3>
                        <p className="text-sm text-slate-500">{book.author} • {book.category}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(book._id)}
                      className="p-3 text-slate-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Delete Book"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
