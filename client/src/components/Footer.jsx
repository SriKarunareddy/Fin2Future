import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full mt-auto py-12 px-6 border-t border-white/5 bg-slate-950/50 backdrop-blur-sm z-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Logo and About */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-sm font-bold">F2F</span>
              </div>
              <h2 className="text-xl font-black tracking-tighter text-white">
                FIN2FUTURE
              </h2>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed mb-6">
              Empowering the next generation with financial literacy through interactive simulations, 
              curated courses, and government-backed financial wisdom.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'GitHub', 'LinkedIn'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 bg-slate-500 rounded-sm opacity-50"></div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Resources</h3>
            <ul className="space-y-4">
              <li><Link to="/learning" className="text-slate-400 hover:text-indigo-400 transition-colors">Learning Modules</Link></li>
              <li><Link to="/budget-game" className="text-slate-400 hover:text-indigo-400 transition-colors">Budget Game</Link></li>
              <li><Link to="/books" className="text-slate-400 hover:text-indigo-400 transition-colors">Financial Books</Link></li>
              <li><Link to="/gov-finance" className="text-slate-400 hover:text-indigo-400 transition-colors">Gov Finance</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-bold mb-6 uppercase tracking-widest text-xs">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">About Us</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Contact</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-slate-400 hover:text-indigo-400 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm">
          <p>© {currentYear} Fin2Future. All rights reserved.</p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="flex items-center">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></span>
              Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
