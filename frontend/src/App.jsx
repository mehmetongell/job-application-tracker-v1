import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, User, LogOut, PlusCircle, Search, MapPin, X, 
  Calendar, Shield, BrainCircuit, FileText, TrendingUp, Globe, Activity
} from 'lucide-react';
import API from './services/api';
import Login from './pages/Login';

// --- SHARED COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, to }) => (
  <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
    <Icon size={20} />
    <span className="text-sm">{label}</span>
  </Link>
);

const StatusBadge = ({ status }) => {
  const styles = {
    applied: "bg-blue-50 text-blue-600 border-blue-100",
    interview: "bg-amber-50 text-amber-600 border-amber-100",
    rejected: "bg-rose-50 text-rose-600 border-rose-100",
    offer: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };
  const currentStatus = status?.toLowerCase() || 'applied';
  return <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${styles[currentStatus] || "bg-slate-50"}`}>{status}</span>;
};

const StatCard = ({ label, value, color, icon: Icon }) => {
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

// --- PAGES ---

function Sidebar({ activePage }) {
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

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      alert("Registration successful!");
      navigate('/login');
    } catch (err) { alert(err.response?.data?.message || "Registration error."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Join JobPulse</h1>
          <p className="text-slate-400 font-bold mt-2">Start tracking your career today.</p>
        </div>
        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all font-medium" value={name} onChange={(e) => setName(e.target.value)} />
          <input required type="email" placeholder="Email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">Create Account</button>
        </form>
        <p className="text-center mt-6 text-slate-500 font-bold text-sm">Already a member? <Link to="/login" className="text-indigo-600 underline">Login</Link></p>
      </div>
    </div>
  );
}

function AIAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);
    try {
      const { data } = await API.post('/ai/analyze-resume', formData);
      setResult(data.data.analysis);
    } catch (err) { alert("AI analysis failed."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar activePage="ai" />
      <main className="flex-1 p-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-black text-slate-900 mb-10 text-center italic">AI Vetting</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form onSubmit={handleAnalyze} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 space-y-6">
            <textarea required className="w-full h-48 p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none" placeholder="Job description..." onChange={(e) => setJobDesc(e.target.value)} />
            <input type="file" required accept=".pdf" className="w-full p-4 bg-slate-50 border border-dashed border-slate-300 rounded-2xl" onChange={(e) => setFile(e.target.files[0])} />
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-lg">
               {loading ? "Analyzing..." : "Start AI Analysis"}
            </button>
          </form>
          <div>
            {result ? (
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-8 border-indigo-600">
                <div className="text-5xl font-black text-indigo-600 mb-4">%{result.matchPercentage} Match</div>
                <p className="text-slate-600 font-bold italic mb-6">"{result.summary}"</p>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">{result.missingKeywords.map(k => <span key={k} className="bg-rose-50 text-rose-600 px-3 py-1 rounded-lg text-xs font-bold">{k}</span>)}</div>
                  <ul className="text-sm text-slate-500 font-medium">{result.improvementTips.map(t => <li key={t}>• {t}</li>)}</ul>
                </div>
              </div>
            ) : <div className="h-full border-2 border-dashed border-slate-100 rounded-[40px] flex items-center justify-center text-slate-300 font-bold">Waiting for input...</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0, AI_AVG: 0 });
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
      setStats({...statsRes.data.data, AI_AVG: statsRes.data.ai?.averageMatch || 0});
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
    } catch (err) { alert("Error!"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="dashboard" />
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Opportunity Tracker</h1>
          <button onClick={() => setIsModalOpen(true)} className="bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black shadow-lg shadow-indigo-100">+ New Job</button>
        </header>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <StatCard label="Total" value={stats.APPLIED} color="indigo" icon={Briefcase} />
          <StatCard label="Interview" value={stats.INTERVIEW} color="amber" icon={Calendar} />
          <StatCard label="Offer" value={stats.OFFER} color="emerald" icon={PlusCircle} />
          <StatCard label="Rejected" value={stats.REJECTED} color="rose" icon={LogOut} />
          <div className="bg-indigo-900 p-6 rounded-[32px] text-white shadow-xl">
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Score</p>
             <h3 className="text-4xl font-black mt-1">%{stats.AI_AVG}</h3>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black italic">Add Job</h2>
                <button onClick={() => setIsModalOpen(false)}><X/></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required placeholder="Company" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                <input required placeholder="Position" className="w-full p-4 bg-slate-50 rounded-2xl outline-none border border-slate-100" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black">Track Now</button>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-[40px] shadow-xl border border-slate-50 overflow-hidden">
           <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] font-black uppercase text-slate-400">
                <tr><th className="px-10 py-5">Company</th><th className="px-10 py-5">Status</th><th className="px-10 py-5 text-right">Date</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-indigo-50/20 transition-all">
                    <td className="px-10 py-6 font-black text-slate-800">{job.company} <span className="block text-xs text-slate-400 font-bold">{job.position}</span></td>
                    <td className="px-10 py-6"><StatusBadge status={job.status}/></td>
                    <td className="px-10 py-6 text-right text-xs font-black text-slate-400">{new Date(job.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </main>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="profile" />
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto bg-white rounded-[40px] p-12 shadow-xl border border-slate-100">
          <div className="flex items-center gap-8 mb-10">
            <div className="w-24 h-24 bg-indigo-600 rounded-[30px] flex items-center justify-center text-white shadow-xl"><User size={40}/></div>
            <div>
              <h1 className="text-3xl font-black text-slate-900">Mehmet Öngel</h1>
              <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest mt-1 italic">Verified Professional</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Email</p><p className="font-bold">mehmet@test.com</p></div>
            <div className="p-6 bg-slate-50 rounded-3xl"><p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p><p className="font-bold text-emerald-600 flex items-center gap-2"><Shield size={16}/> Pro Plan</p></div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const PrivateRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/ai" element={<PrivateRoute><AIAnalyzer /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}