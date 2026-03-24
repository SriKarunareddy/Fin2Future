import { useState, useEffect } from 'react';
import booksApi from '../api/books.api';

export default function BooksPage({ user }) {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [selectedBook, setSelectedBook] = useState(null);

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

  const openBook = (book) => {
    setSelectedBook(book);
  };

  const closeBook = () => {
    setSelectedBook(null);
  };

  const categories = ['All', ...new Set(books.map(b => b.category))];
  const filteredBooks = filter === 'All' ? books : books.filter(b => b.category === filter);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* PDF Viewer Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl border border-white/10">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-black text-white mb-1">{selectedBook.title}</h2>
                <p className="text-slate-400 text-sm">by {selectedBook.author}</p>
              </div>
              <button
                onClick={closeBook}
                className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* PDF Viewer */}
            <div className="flex-1 p-6">
              <iframe
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedBook.pdfUrl)}`}
                className="w-full h-full rounded-xl bg-white"
                title={selectedBook.title}
                frameBorder="0"
                allow="autoplay"
              />
            </div>
          </div>
        </div>
      )}

      {/* Original Content */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            Financial Library
          </h1>
          <p className="text-slate-400 font-medium">Read hand-picked resources to master your finances.</p>
        </div>
        
        {/* Categories Bar */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl overflow-x-auto w-full md:w-fit no-scrollbar">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                filter === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-3xl h-64 animate-pulse"></div>
          ))}
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-32 bg-white/5 rounded-[3rem] border border-dashed border-white/10">
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No books found</h3>
          <p className="text-slate-500">Check back later for new resources uploaded by admin.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBooks.map(book => (
            <div key={book._id} className="group bg-white/5 backdrop-blur-md border border-white/10 rounded-[2.5rem] p-8 hover:bg-white/[0.08] transition-all duration-500 hover:-translate-y-2 flex flex-col">
              <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/3] bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                 <svg className="w-16 h-16 text-indigo-400/50 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                 <div className="absolute top-4 right-4 bg-indigo-600 text-[10px] font-black uppercase px-3 py-1.5 rounded-full shadow-lg">
                   {book.category}
                 </div>
              </div>

              <h3 className="text-xl font-black text-white mb-2 leading-tight group-hover:text-indigo-400 transition-colors">
                {book.title}
              </h3>
              <p className="text-sm text-slate-500 font-bold mb-4 uppercase tracking-wider">{book.author}</p>
              <p className="text-slate-400 text-sm line-clamp-3 mb-8 flex-grow leading-relaxed">
                {book.description}
              </p>

              <button
                onClick={() => openBook(book)}
                className="inline-flex items-center justify-center gap-2 w-full bg-white/10 hover:bg-indigo-600 text-white font-black py-4 rounded-2xl transition-all duration-300 group/btn shadow-xl"
              >
                Read Book
                <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
