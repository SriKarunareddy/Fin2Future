import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import govApi from '../api/gov.api';

export default function GovFinancePage({ user }) {
  const [data, setData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dataRes, postsRes] = await Promise.all([
          govApi.getGovData(user?.token),
          govApi.getPosts()
        ]);
        setData(dataRes.data);
        setPosts(postsRes.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="p-20 text-center animate-pulse text-2xl font-black">Connecting to Gov Data Centers...</div>;

  const inflationData = [
    { month: 'Oct', rate: 4.8 },
    { month: 'Nov', rate: 5.5 },
    { month: 'Dec', rate: 5.7 },
    { month: 'Jan', rate: 5.1 },
    { month: 'Feb', rate: 5.0 },
    { month: 'Mar', rate: data?.trends?.inflation?.headline || 5.6 }
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Header */}
      <div className="relative bg-gradient-to-br from-rose-900/40 via-slate-900 to-slate-950 border border-white/10 rounded-[3rem] p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 blur-[120px] -z-10 rounded-full"></div>
        <div className="max-w-3xl">
          <span className="bg-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-full mb-6 inline-block border border-rose-500/20">
            National Finance Portal
          </span>
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight">
            Indian Economic <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-400 text-6xl md:text-8xl">INSIGHTS</span>
          </h1>
          <p className="text-slate-400 text-xl font-medium leading-relaxed">
            Directly from data.gov.in and RBI. Understand how national trends affect your wallet.
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Visual Trends */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
            <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
              <span className="w-2 h-8 bg-rose-500 rounded-full"></span>
              CPI Inflation Trend (%)
            </h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={inflationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    itemStyle={{ color: '#fb7185', fontWeight: 'bold' }}
                  />
                  <Line type="monotone" dataKey="rate" stroke="#fb7185" strokeWidth={4} dot={{ r: 6, fill: '#fb7185' }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Gov Spending Spotlight</p>
              <h3 className="text-2xl font-bold text-white mb-4">Infrastructure</h3>
              <p className="text-3xl font-black text-rose-400">{data?.trends?.spending?.infrastructure}</p>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">Allocation to railways and highways remains at record highs, potentially easing logistics costs.</p>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/[0.08] transition-all">
              <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2">GST Update</p>
              <h3 className="text-2xl font-bold text-white mb-4">National Collection</h3>
              <p className="text-3xl font-black text-emerald-400">{data?.trends?.taxation?.gstCollection}</p>
              <p className="text-sm text-slate-500 mt-4 leading-relaxed">Tax compliance is hitting new milestones, indicating a strong formal economy recovery.</p>
            </div>
          </div>
        </div>

        {/* Right Column: Personalized Insights */}
        <div className="space-y-8">
           <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -left-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
             <h2 className="text-2xl font-black text-white mb-6">Personalized AI Insights</h2>
             
             <div className="space-y-6">
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-black">1</div>
                 <p className="text-slate-200 text-sm leading-relaxed">{data?.personalizedInsights?.spendingVsInflation}</p>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-indigo-500 flex-shrink-0 flex items-center justify-center font-black">2</div>
                 <p className="text-slate-200 text-sm leading-relaxed">{data?.personalizedInsights?.taxImpact}</p>
               </div>
               <div className="flex gap-4">
                 <div className="w-8 h-8 rounded-full bg-emerald-500 flex-shrink-0 flex items-center justify-center font-black">✓</div>
                 <p className="text-emerald-400 text-sm font-bold leading-relaxed">{data?.personalizedInsights?.recommendation}</p>
               </div>
             </div>
           </div>

           <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8">
             <h2 className="text-xl font-black text-white mb-6">Latest Gov Learning Cards</h2>
             <div className="space-y-4">
               {posts.slice(0, 4).map(post => (
                 <div key={post._id} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                   <h4 className="font-bold text-white mb-1">{post.title}</h4>
                   <span className="text-[10px] font-black uppercase text-rose-400">{post.category}</span>
                 </div>
               ))}
               {posts.length === 0 && <p className="text-slate-600 text-center py-4">No cards uploaded yet.</p>}
             </div>
           </div>
        </div>
      </div>

      {/* Full Learning Cards Carousel/Grid */}
      <div>
        <h2 className="text-3xl font-black text-white mb-8">All Schemes & Updates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {posts.map(post => (
            <div key={post._id} className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:border-rose-500/30 transition-all group">
               <span className="text-[10px] font-black uppercase text-rose-400 mb-4 inline-block">{post.category}</span>
               <h3 className="text-xl font-bold text-white mb-4 group-hover:text-rose-400 transition-colors">{post.title}</h3>
               <p className="text-slate-400 text-sm line-clamp-4 leading-relaxed">{post.content}</p>
               {post.sourceUrl && (
                 <a href={post.sourceUrl} target="_blank" className="mt-8 inline-block text-rose-400 font-bold text-sm hover:underline">Read Source PIB →</a>
               )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
