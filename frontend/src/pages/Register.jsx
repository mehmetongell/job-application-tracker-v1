import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post('/auth/register', { name, email, password });
      toast.success("Registration successful!");
      navigate('/login');
    } catch (err) { toast.error(err.response?.data?.message || "Error."); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-[40px] shadow-2xl p-10 border border-slate-100">
        <h1 className="text-3xl font-black text-slate-900 text-center mb-8">Join JobPulse</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-medium" value={name} onChange={(e) => setName(e.target.value)} />
          <input required type="email" placeholder="Email" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input required type="password" placeholder="Password" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black shadow-lg">Create Account</button>
        </form>
        <p className="text-center mt-6 text-slate-500 font-bold text-sm">Member? <Link to="/login" className="text-indigo-600 underline">Login</Link></p>
      </div>
    </div>
  );
}