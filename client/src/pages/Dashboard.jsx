import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Dashboard({ user, onLogout }) {
  const [analytics, setAnalytics] = useState({ gamesPlayed: 0, modulesCompleted: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!user || !user._id) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/quiz/analytics/${user._id}`);
        const data = await response.json();
        if (data.success) {
          setAnalytics(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [user]);

  const navItems = [
    { name: 'Budget Game', to: '/budget-game', icon: '🎮', colorClass: 'hover:shadow-indigo-500/20 bg-indigo-500/20 shadow-indigo-500/10 via-indigo-500', iconBg: 'bg-indigo-500/20', shadowColor: 'shadow-indigo-500/10', viaColor: 'via-indigo-500', desc: 'Test your financial planning skills.' },
    { name: 'Learning', to: '/learning', icon: '📚', colorClass: 'hover:shadow-emerald-500/20 bg-emerald-500/20 shadow-emerald-500/10 via-emerald-500', iconBg: 'bg-emerald-500/20', shadowColor: 'shadow-emerald-500/10', viaColor: 'via-emerald-500', desc: 'Interactive financial literacy courses.' },
    { name: 'Books', to: '/books', icon: '📖', colorClass: 'hover:shadow-amber-500/20 bg-amber-500/20 shadow-amber-500/10 via-amber-500', iconBg: 'bg-amber-500/20', shadowColor: 'shadow-amber-500/10', viaColor: 'via-amber-500', desc: 'Curated financial wisdom and guides.' },
    { name: 'Gov Finance', to: '/gov-finance', icon: '🏛️', colorClass: 'hover:shadow-rose-500/20 bg-rose-500/20 shadow-rose-500/10 via-rose-500', iconBg: 'bg-rose-500/20', shadowColor: 'shadow-rose-500/10', viaColor: 'via-rose-500', desc: 'Understanding government schemes.' },
    { name: 'Personalized Finance', to: '/personalized-finance', icon: '💎', colorClass: 'hover:shadow-purple-500/20 bg-purple-500/20 shadow-purple-500/10 via-purple-500', iconBg: 'bg-purple-500/20', shadowColor: 'shadow-purple-500/10', viaColor: 'via-purple-500', desc: 'Tailored paths for your goals.' },
  ];

  if (user?.role === 'admin') {
    navItems.push({ 
        name: 'Manage Books', 
        to: '/admin/books', 
        icon: '🛡️', 
        colorClass: 'hover:shadow-rose-600/30 bg-rose-600/20 shadow-rose-600/20 via-rose-600', 
        iconBg: 'bg-rose-600/20', 
        shadowColor: 'shadow-rose-600/20', 
        viaColor: 'via-rose-600 border-2 border-rose-500/30', 
        desc: 'Admin: Upload and manage PDF library.' 
    });
    navItems.push({ 
        name: 'Manage Curriculum', 
        to: '/admin/learning', 
        icon: '🎓', 
        colorClass: 'hover:shadow-indigo-600/30 bg-indigo-600/20 shadow-indigo-600/20 via-indigo-600', 
        iconBg: 'bg-indigo-600/20', 
        shadowColor: 'shadow-indigo-600/20', 
        viaColor: 'via-indigo-600 border-2 border-indigo-500/30', 
        desc: 'Admin: Create modules, lessons and rich content.' 
    });
    navItems.push({ 
        name: 'Manage Gov Analytics', 
        to: '/admin/gov', 
        icon: '🏛️', 
        colorClass: 'hover:shadow-orange-600/30 bg-orange-600/20 shadow-orange-600/20 via-orange-600', 
        iconBg: 'bg-orange-600/20', 
        shadowColor: 'shadow-orange-600/20', 
        viaColor: 'via-orange-600 border-2 border-orange-500/30', 
        desc: 'Admin: Manage government updates and national data cards.' 
    });
  }

  return (
    <div className="flex-grow flex flex-col items-center p-6 text-slate-100 relative overflow-hidden font-sans">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-10%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="z-10 w-full max-w-6xl py-12">
        {/* Hero Section */}
        <section className="mb-16 text-center md:text-left">
          <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter">
            Master Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-emerald-400">FINANCES</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed">
            Take control of your future with interactive tools, personalized courses, and real-world simulations designed for your success.
          </p>
        </section>

        {/* Analytics if logged in */}
        {user && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl flex items-center space-x-6 hover:bg-white/10 transition-all group">
              <div className="p-5 bg-indigo-500/20 text-indigo-400 rounded-2xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Total Games</p>
                <p className="text-4xl font-black text-white">{loading ? '...' : analytics.gamesPlayed}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/10 shadow-xl flex items-center space-x-6 hover:bg-white/10 transition-all group">
              <div className="p-5 bg-emerald-500/20 text-emerald-400 rounded-2xl group-hover:scale-110 transition-transform">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path></svg>
              </div>
              <div>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mb-1">Modules Done</p>
                <p className="text-4xl font-black text-white">{loading ? '...' : analytics.modulesCompleted}</p>
              </div>
            </div>
          </div>
        )}

        {/* Feature Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={user ? item.to : '/login'}
              className={`group relative overflow-hidden bg-white/5 backdrop-blur-md rounded-[2.5rem] p-10 border border-white/10 shadow-2xl transition-all duration-500 hover:-translate-y-3 flex flex-col justify-end min-h-[300px] hover:bg-white/[0.08] ${item.colorClass.split(' ')[0]}`}
            >
              <div className={`absolute top-10 right-10 w-20 h-20 ${item.iconBg} rounded-[2rem] flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 text-4xl shadow-lg ${item.shadowColor}`}>
                {item.icon}
              </div>
              <div className="z-10">
                <h3 className="text-3xl font-black text-white mb-3 tracking-tight group-hover:translate-x-1 transition-transform">{item.name}</h3>
                <p className="text-slate-400 font-medium group-hover:text-slate-200 transition-colors">{item.desc}</p>
              </div>
              <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${item.viaColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
