import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import learningApi from '../api/learning.api';

export default function AdminLessonEditor({ user }) {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [content, setContent] = useState([]);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const data = await learningApi.getLesson(lessonId, user.token);
      setLesson(data.data);
      setContent(data.data.content || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type) => {
    setContent([...content, { type, value: '', metadata: {} }]);
  };

  const updateBlock = (index, value) => {
    const newContent = [...content];
    newContent[index].value = value;
    setContent(newContent);
  };

  const updateMetadata = (index, key, val) => {
    const newContent = [...content];
    newContent[index].metadata = { ...newContent[index].metadata, [key]: val };
    setContent(newContent);
  };

  const removeBlock = (index) => {
    setContent(content.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    if ((index === 0 && direction === -1) || (index === content.length - 1 && direction === 1)) return;
    const newContent = [...content];
    const temp = newContent[index];
    newContent[index] = newContent[index + direction];
    newContent[index + direction] = temp;
    setContent(newContent);
  };

  const handleFileUpload = async (index, file) => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${user.token}` },
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        updateBlock(index, data.url);
      }
    } catch (err) {
      setError('File upload failed');
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await learningApi.updateLesson(lessonId, { ...lesson, content }, user.token);
      setError(null);
      alert('Lesson saved successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading editor...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Link to={`/admin/modules/${lesson.moduleId}`} className="text-slate-500 hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </Link>
          <div>
            <h1 className="text-2xl font-black text-white">{lesson.title}</h1>
            <p className="text-sm text-slate-500">Rich Content Editor</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 font-bold">
          {error}
        </div>
      )}

      {/* Content Blocks */}
      <div className="space-y-6 mb-12">
        {content.map((block, index) => (
          <div key={index} className="relative group bg-white/5 border border-white/10 rounded-2xl p-6 transition-all border-l-4 border-l-transparent hover:border-l-indigo-500">
            {/* Toolbar */}
            <div className="absolute -right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => moveBlock(index, -1)} className="p-2 bg-slate-800 rounded-lg hover:text-indigo-400 border border-white/10 shadow-xl">↑</button>
               <button onClick={() => removeBlock(index)} className="p-2 bg-slate-800 rounded-lg hover:text-rose-400 border border-white/10 shadow-xl">×</button>
               <button onClick={() => moveBlock(index, 1)} className="p-2 bg-slate-800 rounded-lg hover:text-indigo-400 border border-white/10 shadow-xl">↓</button>
            </div>

            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest bg-indigo-500/10 px-2 py-0.5 rounded">
                {block.type}
              </span>
            </div>

            {block.type === 'text' && (
              <textarea 
                className="w-full bg-transparent border-none focus:ring-0 text-slate-200 leading-relaxed h-32 resize-none text-lg"
                placeholder="Write lesson text here..."
                value={block.value}
                onChange={e => updateBlock(index, e.target.value)}
              />
            )}

            {block.type === 'image' && (
              <div className="space-y-4">
                {block.value && (
                  <img src={block.value} className="max-h-64 rounded-xl mx-auto border border-white/10" alt="Preview" />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => handleFileUpload(index, e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30"
                />
              </div>
            )}

            {block.type === 'pdf' && (
              <div className="space-y-4">
                 {block.value && (
                   <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-between text-indigo-400 font-bold">
                     <span>{block.value.split('-').pop()}</span>
                     <Link to={block.value} target="_blank" className="underline">View PDF</Link>
                   </div>
                 )}
                 <input 
                  type="file" 
                  accept=".pdf" 
                  onChange={e => handleFileUpload(index, e.target.files[0])}
                  className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30"
                />
              </div>
            )}

            {block.type === 'link' && (
              <div className="space-y-4">
                <input 
                  type="text" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  placeholder="Link Label (e.g. Recommended Video)"
                  value={block.metadata?.label || ''}
                  onChange={e => updateMetadata(index, 'label', e.target.value)}
                />
                <input 
                  type="url" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                  placeholder="https://example.com"
                  value={block.value}
                  onChange={e => updateBlock(index, e.target.value)}
                />
              </div>
            )}
          </div>
        ))}

        {content.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-bold">
            Start adding blocks to build your lesson content
          </div>
        )}
      </div>

      {/* Add Block Toolbar */}
      <div className="sticky bottom-8 bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-4 flex justify-around shadow-2xl">
        {[
          { type: 'text', label: 'Add Text', icon: 'T' },
          { type: 'image', label: 'Add Image', icon: '🖼️' },
          { type: 'pdf', label: 'Add PDF', icon: '📄' },
          { type: 'link', label: 'Add Link', icon: '🔗' }
        ].map(btn => (
          <button 
            key={btn.type}
            onClick={() => addBlock(btn.type)}
            className="flex items-center gap-2 px-6 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-bold"
          >
            <span className="text-lg">{btn.icon}</span>
            {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}
