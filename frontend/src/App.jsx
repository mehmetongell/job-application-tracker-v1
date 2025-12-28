import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, User, LogOut, PlusCircle, Search, MapPin, X, 
  Calendar, Shield, BrainCircuit, FileText, TrendingUp, Globe, Activity
} from 'lucide-react';
import API from './api';
import Login from './Login';

// --- SHARED COMPONENTS ---

const NavItem = ({ icon: Icon, label, active, to }) => (
  <Link to={to} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all font-bold ${active ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
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

// --- GLOBAL SIDEBAR ---

function Sidebar({ activePage }) {
  const navigate = useNavigate();
  const handleLogout = () => { localStorage.removeItem('token'); navigate('/login'); };
  
  return (
    <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen z-50">
      {/* Cilalanmış Yeni Logo (No .ai) */}
      <div className="p-8 flex items-center gap-4">
        <div className="relative">
          <div className="absolute -inset-1 bg-indigo-500 rounded-2xl blur opacity-20 animate-pulse"></div>
          <div className="relative h-12 w-12 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white">
            <Activity size={24} className="text-white" strokeWidth={3} />
          </div>
        </div>
        <div>
          <span className="block text-2xl font-black tracking-tighter text-slate-900 leading-none">
            Job<span className="text-indigo-600">Pulse</span>
          </span>
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
          <LogOut size={18} /><span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

// --- MAIN PAGES ---

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
    } catch (err) { alert("Analysis failed. Please check your file or try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar activePage="ai" />
      <main className="flex-1 p-10 max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">AI Compatibility Engine</h1>
          <p className="text-slate-500 font-medium">Upload your PDF resume and let our AI evaluate your profile against the job.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form onSubmit={handleAnalyze} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 space-y-6 h-fit">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Job Requirements</label>
              <textarea required className="w-full h-48 p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-2 ring-indigo-100 transition-all text-sm font-medium" placeholder="Paste the full job description here..." onChange={(e) => setJobDesc(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Resume Upload (PDF)</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center hover:border-indigo-400 transition-all group">
                <input type="file" required accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                <FileText size={32} className="mx-auto text-slate-300 group-hover:text-indigo-500 mb-2 transition-colors" />
                <span className="block text-sm font-bold text-slate-600">{file ? file.name : "Choose file or drag here"}</span>
              </div>
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><BrainCircuit size={20}/> Run Analysis</>}
            </button>
          </form>

          <div className="space-y-6">
            {result ? (
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-[12px] border-indigo-600 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full uppercase tracking-widest">Match Result</span>
                  <div className="text-6xl font-black text-indigo-600">%{result.matchPercentage}</div>
                </div>
                <p className="text-slate-600 font-bold italic mb-8 leading-relaxed text-lg">"{result.summary}"</p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2 underline underline-offset-4">Missing Skillsets</h4>
                    <div className="flex flex-wrap gap-2">{result.missingKeywords.map(k => <span key={k} className="bg-rose-50 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold border border-rose-100">{k}</span>)}</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2 underline underline-offset-4">Strategic Tips</h4>
                    <ul className="space-y-3">{result.improvementTips.map(t => <li key={t} className="text-slate-500 text-sm font-bold flex gap-3"><TrendingUp size={16} className="text-emerald-500 shrink-0"/>{t}</li>)}</ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] text-slate-300 space-y-4">
                <BrainCircuit size={48} className="opacity-20" />
                <p className="font-black uppercase tracking-[0.2em] text-sm">Waiting for data...</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ProfilePage() {
  const [isPublic, setIsPublic] = useState(false);
  const username = 'mehmet-dev'; // Normalde login olan kullanıcıdan gelir

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="profile" />
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-10 tracking-tight">Profile & Branding</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full"></div>
              <div className="flex items-center gap-8 mb-10">
                <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[36px] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                  <User size={48} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">Mehmet Öngel</h2>
                  <p className="text-indigo-600 font-black text-sm uppercase tracking-widest mt-1 italic">Software Engineer</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Registered Mail</p><p className="font-bold text-slate-800">mehmet@test.com</p></div>
                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100"><p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Verification</p><p className="font-bold text-emerald-600 flex items-center gap-2 italic"><Shield size={16}/> Identity Verified</p></div>
              </div>
            </div>

            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <div><h3 className="text-xl font-black text-slate-900 mb-1">Public Visibility</h3><p className="text-sm text-slate-400 font-medium tracking-tight">Enable this to allow recruiters to view your AI success rates.</p></div>
                <button onClick={() => setIsPublic(!isPublic)} className={`w-16 h-9 rounded-full transition-all relative p-1 ${isPublic ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                  <div className={`bg-white w-7 h-7 rounded-full transition-all shadow-md ${isPublic ? 'translate-x-7' : 'translate-x-0'}`} />
                </button>
              </div>
              {isPublic && (
                <div className="flex items-center gap-4 p-5 bg-indigo-50 rounded-3xl border border-indigo-100 animate-in slide-in-from-right-4 duration-300">
                  <Globe className="text-indigo-600 shrink-0" size={20} />
                  <span className="text-xs font-black text-indigo-700 tracking-tight overflow-hidden text-ellipsis italic">jobpulse.com/public/{username}</span>
                  <button className="ml-auto text-[10px] font-black uppercase text-indigo-600 hover:text-indigo-800 px-4 py-2 bg-white rounded-xl shadow-sm">Copy</button>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-indigo-950 rounded-[44px] p-10 text-white shadow-2xl flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-8"><TrendingUp size={28} className="text-indigo-300" /></div>
              <h3 className="text-2xl font-black leading-[1.15] mb-6 tracking-tight">Elevate Your Presence</h3>
              <p className="text-indigo-200/80 text-sm font-bold leading-relaxed">Your consistency in AI-vetting makes you a top candidate. Keep analyzing to stay ahead.</p>
            </div>
            <div className="mt-12 p-6 bg-gradient-to-br from-white/10 to-transparent rounded-[32px] border border-white/10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-2">Growth Tip</p>
              <p className="text-xs font-bold leading-relaxed text-indigo-50 italic">"Focus on cloud-native tools to boost your match rate by 20%."</p>
            </div>
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
    } catch (err) { alert("Error adding job!"); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="dashboard" />
      <main className="flex-1 p-10">
        {/* Modal UI */}
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[44px] p-10 border border-white shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight italic">New Opportunity</h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input required type="text" placeholder="Company Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all font-bold" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                <input required type="text" placeholder="Position Title" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 transition-all font-bold" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-slate-500 appearance-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Track It</button>
              </form>
            </div>
          </div>
        )}
        
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 leading-none tracking-tight italic">JobPulse</h1>
            <p className="text-slate-400 font-black mt-2 text-xs uppercase tracking-[0.2em]">Application Intelligence</p>
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input type="text" placeholder="Filter jobs..." className="w-full md:w-80 pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-3xl outline-none shadow-sm focus:shadow-xl transition-all font-bold" value={search} onChange={(e) => { setSearch(e.target.value); fetchData(e.target.value); }} />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-3xl font-black shadow-xl shadow-indigo-100 hover:scale-105 active:scale-95 transition-all"><PlusCircle size={20} /><span>Add Job</span></button>
          </div>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
          <StatCard label="Applied" value={stats.APPLIED} color="indigo" icon={Briefcase} />
          <StatCard label="Interview" value={stats.INTERVIEW} color="amber" icon={Calendar} />
          <StatCard label="Offer" value={stats.OFFER} color="emerald" icon={PlusCircle} />
          <StatCard label="Rejected" value={stats.REJECTED} color="rose" icon={LogOut} />
          <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-200">
             <BrainCircuit className="mb-4 opacity-50" size={24}/>
             <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Compatibility</p>
             <h3 className="text-4xl font-black mt-1">%{stats.AI_AVG || 0}</h3>
          </div>
        </div>

        <div className="bg-white rounded-[44px] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h2 className="text-xl font-black text-slate-800">Pipeline Status</h2>
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{jobs.length} Active Records</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="text-slate-300 text-[10px] uppercase font-black border-b border-slate-50"><th className="px-10 py-6">Company & Role</th><th className="px-10 py-6 text-center">Status</th><th className="px-10 py-6">Location</th><th className="px-10 py-6 text-right">Added</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {jobs.map((job) => (
                  <tr key={job.id} className="group hover:bg-indigo-50/20 transition-all cursor-pointer">
                    <td className="px-10 py-7"><div className="flex flex-col"><span className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{job.company}</span><span className="text-slate-400 font-bold text-xs">{job.position}</span></div></td>
                    <td className="px-10 py-7 text-center"><StatusBadge status={job.status} /></td>
                    <td className="px-10 py-7 text-slate-500 font-black text-sm"><div className="flex items-center gap-2"><MapPin size={14} className="text-slate-300" />{job.location || 'Remote'}</div></td>
                    <td className="px-10 py-7 text-right"><span className="text-slate-400 text-[10px] font-black italic">{new Date(job.createdAt).toLocaleDateString()}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {jobs.length === 0 && <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">Pipeline Empty</div>}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- APP ROUTING ---

export default function App() {
  const PrivateRoute = ({ children }) => localStorage.getItem('token') ? children : <Navigate to="/login" />;

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/ai" element={<PrivateRoute><AIAnalyzer /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      </Routes>
    </Router>
  );
}