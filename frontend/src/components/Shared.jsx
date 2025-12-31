import { Link } from 'react-router-dom';

export const NavItem = ({ icon: Icon, label, active, to }) => (
  <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </Link>
);

export const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-blue-50 text-blue-600 border-blue-100",
    interview: "bg-amber-50 text-amber-600 border-amber-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    offer: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  const currentStatus = status?.toLowerCase() || 'applied';
  return <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[currentStatus] || "bg-slate-50"}`}>{status}</span>;
};

export const StatCard = ({ label, value, color, icon: Icon }) => {
  const colors = {
    indigo: "bg-indigo-600 text-white",
    amber: "bg-amber-500 text-white",
    emerald: "bg-emerald-500 text-white",
    rose: "bg-rose-500 text-white",
  };
  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200`}><Icon size={22} /></div>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value || 0}</h3>
    </div>
  );
};