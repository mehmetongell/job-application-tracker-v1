import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import { 
  User, Shield, LogOut, LayoutDashboard, BrainCircuit, Activity 
} from 'lucide-react';
import API from './services/api';
import Login from './pages/Login';
import ProfilePage from './pages/ProfilePage';
import Dashboard from './pages/Dashboard';
import Sidebar from './components/Sidebar';


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