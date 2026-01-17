import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, User, LogOut, BrainCircuit, Activity } from 'lucide-react';

const NavItem = ({ icon: Icon, label, active, to }) => (
  <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </Link>
);

export default function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  
  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-50">
      <div className="p-8 flex items-center gap-4">
        <div className="relative h-12 w-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg">
          <Activity size={24} className="text-white" />
        </div>
        <div>
          <span className="block text-2xl font-black tracking-tighter text-slate-900 leading-none">JobPulse</span>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Career Hub</span>
        </div>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/" active={activePage === 'dashboard'} />
        <NavItem icon={BrainCircuit} label="AI Analyzer" to="/ai" active={activePage === 'ai'} />
        <NavItem icon={User} label="Profile & Public" to="/profile" active={activePage === 'profile'} />
      </nav>
      <div className="p-6 mt-auto border-t border-slate-50">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all font-bold text-sm">
          <LogOut size={18} /><span>Logout</span>
        </button>
      </div>
    </aside>
  );
}