import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import learningApi from '../api/learning.api';

export default function LessonViewer({ user }) {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLesson();
  }, [lessonId]);

  const fetchLesson = async () => {
    try {
      const data = await learningApi.getLesson(lessonId, user.token);
      setLesson(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center">Loading lesson content...</div>;
  if (!lesson) return <div className="p-20 text-center text-rose-500">Lesson not found</div>;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to={`/learning/modules/${lesson.moduleId}`} className="inline-flex items-center gap-2 text-slate-500 hover:text-white mb-8 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        Back to Module
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-4">
           <span className="bg-emerald-500/10 text-emerald-400 text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/10">
             Lesson Content
           </span>
           <span className="text-slate-500 text-xs font-bold">{lesson.duration} Minute Read</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">{lesson.title}</h1>
        <p className="text-slate-400 text-lg italic border-l-4 border-emerald-500 pl-6 py-2">{lesson.description}</p>
      </div>

      {/* Rich Content Sections */}
      <div className="space-y-12 mb-20">
        {lesson.content?.map((block, index) => (
          <div key={index} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {block.type === 'text' && (
              <div className="prose prose-invert max-w-none text-slate-300 text-lg leading-relaxed whitespace-pre-wrap">
                {block.value}
              </div>
            )}

            {block.type === 'image' && (
              <figure className="my-8">
                <img src={block.value} alt="Lesson illustration" className="w-full rounded-[2rem] border border-white/10 shadow-2xl" />
                {block.metadata?.caption && (
                  <figcaption className="text-center text-slate-500 text-sm mt-4 italic">{block.metadata.caption}</figcaption>
                )}
              </figure>
            )}

            {block.type === 'pdf' && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:bg-white/10 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rose-500/20 text-rose-400 rounded-xl flex items-center justify-center font-black">PDF</div>
                  <div>
                    <h4 className="font-bold text-white">Attachment Resource</h4>
                    <p className="text-xs text-slate-500 uppercase tracking-widest">Download for offline reading</p>
                  </div>
                </div>
                <a 
                  href={block.value} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-emerald-600 px-6 py-2.5 rounded-xl text-xs font-black transition-all"
                >
                  VIEW PDF
                </a>
              </div>
            )}

            {block.type === 'link' && (
              <a 
                href={block.value} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block bg-indigo-600/10 border border-indigo-500/20 p-6 rounded-2xl hover:bg-indigo-600/20 transition-all group"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-400 mb-1 block">External Resource</span>
                    <h4 className="font-bold text-white text-lg group-hover:underline">{block.metadata?.label || 'Click to Learn More'}</h4>
                  </div>
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                </div>
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-12 text-center">
        <h3 className="text-xl font-black text-white mb-4">You've finished this lesson!</h3>
        <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-600/20">
          Mark as Completed
        </button>
      </div>
    </div>
  );
}
