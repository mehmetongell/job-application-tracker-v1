import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, User, LogOut, PlusCircle, Search, MapPin, X, Calendar, Mail, Shield
} from 'lucide-react';
import API from './api';
import Login from './Login';

const NavItem = ({ icon: Icon, label, active, to }) => (
  <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-semibold ${active ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);

const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-blue-100 text-blue-700",
    interview: "bg-amber-100 text-amber-700",
    rejected: "bg-rose-100 text-rose-700",
    offer: "bg-emerald-100 text-emerald-700",
  };
  const currentStatus = status?.toLowerCase() || 'applied';
  return <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${styles[currentStatus] || "bg-slate-100"}`}>{status}</span>;
};

const StatCard = ({ label, value, color, icon: Icon }) => {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
      <div className={`w-12 h-12 ${colors[color]} rounded-2xl flex items-center justify-center mb-4 shadow-inner`}><Icon size={24} /></div>
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{label}</p>
      <h3 className="text-3xl font-black text-slate-900 mt-1">{value || 0}</h3>
    </div>
  );
};

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert("Kayıt başarılı! Giriş yapabilirsiniz.");
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <User className="text-white" size={28} />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create Account</h1>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="text" placeholder="Ad Soyad" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={name} onChange={(e) => setName(e.target.value)} />
          <input required type="email" placeholder="E-posta" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Şifre" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-indigo-700 transition-all">Sign In</button>
        </form>
        <p className="text-center mt-6 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-indigo-600 font-bold">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="profile" />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black text-slate-900 mb-8">Profile Settings</h1>
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-xl">
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 bg-indigo-600 rounded-3xl flex items-center justify-center text-white text-3xl font-bold">
                <User size={40} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Mehmet Öngel</h2>
                <p className="text-slate-500 font-medium">Full Stack Developer</p>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-indigo-600"><Mail size={18}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">E-mail</p><p className="font-bold text-slate-700">mehmet@test.com</p></div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-emerald-600"><Shield size={18}/></div>
                <div><p className="text-[10px] font-bold text-slate-400 uppercase">Status</p><p className="font-bold text-slate-700">Verified</p></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
      <div className="p-8 flex items-center gap-3">
        <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Briefcase className="text-white" size={22} /></div>
        <span className="text-xl font-bold text-slate-800 tracking-tight italic">JobPulse</span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        <NavItem icon={LayoutDashboard} label="Dashboard" to="/" active={activePage === 'dashboard'} />
        <NavItem icon={User} label="Profile" to="/profile" active={activePage === 'profile'} />
      </nav>
      <div className="p-4 mt-auto">
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-semibold">
          <LogOut size={20} /><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0 });
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ company: '', position: '', location: '', status: 'APPLIED' });

  const fetchData = async (searchQuery = '') => {
    try {
      const [statsRes, jobsRes] = await Promise.all([
        API.get('/jobs/stats'),
        API.get(`/jobs?search=${searchQuery}`)
      ]);
      setStats(statsRes.data.data);
      setJobs(jobsRes.data.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      setIsModalOpen(false);
      setFormData({ company: '', position: '', location: '', status: 'APPLIED' });
      fetchData(search);
    } catch (err) { alert("Hata oluştu!"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="dashboard" />
      <main className="flex-1 p-8">
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[32px] p-8 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900">New Application</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required type="text" placeholder="Company..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                <input required type="text" placeholder="Position..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                <input type="text" placeholder="Location..." className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
                <select className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-slate-600" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-indigo-700 transition-all">Add</button>
              </form>
            </div>
          </div>
        )}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search..." className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl outline-none shadow-sm font-medium" value={search} onChange={(e) => { setSearch(e.target.value); fetchData(e.target.value); }} />
          </div>
          <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3.5 rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-0.5"><PlusCircle size={20} /><span>New Application</span></button>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard label="Applied" value={stats.APPLIED} color="indigo" icon={Briefcase} />
          <StatCard label="Interviews" value={stats.INTERVIEW} color="amber" icon={Calendar} />
          <StatCard label="Offers" value={stats.OFFER} color="emerald" icon={PlusCircle} />
          <StatCard label="Rejections" value={stats.REJECTED} color="rose" icon={LogOut} />
        </div>
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">Active Applications</h2>
            <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{jobs.length} Registration</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="text-slate-400 text-[10px] uppercase font-black border-b border-slate-50"><th className="px-8 py-5">Company & Position</th><th className="px-8 py-5 text-center">Status</th><th className="px-8 py-5">Location</th><th className="px-8 py-5 text-right">Date</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-indigo-50/30 transition-all">
                    <td className="px-8 py-6"><div className="flex flex-col"><span className="font-bold text-slate-900 text-lg group-hover:text-indigo-600">{job.company}</span><span className="text-slate-400 text-sm">{job.position}</span></div></td>
                    <td className="px-8 py-6 text-center"><StatusBadge status={job.status} /></td>
                    <td className="px-8 py-6 text-slate-500 font-semibold"><div className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-300" />{job.location || 'Remote'}</div></td>
                    <td className="px-8 py-6 text-right"><span className="text-slate-400 text-[11px] font-black">{new Date(job.createdAt).toLocaleDateString('tr-TR')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const PrivateRoute = ({ children }) => {
    return localStorage.getItem('token') ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}