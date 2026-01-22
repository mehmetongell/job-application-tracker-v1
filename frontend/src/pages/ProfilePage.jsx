import React, { useState, useEffect } from 'react';
import { User, Shield, Mail, Briefcase, Save, Loader2 } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState({
    name: '',
    email: '',
    title: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/auth/me');
        setUser(data.data);
      } catch (error) {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await API.patch('/auth/me', {
        name: user.name,
        title: user.title,
        bio: user.bio
      });
      setUser(data.data); 
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center bg-[#F8FAFC]"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="profile" />
      
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          
          <div className="bg-white rounded-[40px] p-12 shadow-xl border border-slate-100 mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
              <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
                <span className="text-4xl font-black">{user.name?.charAt(0).toUpperCase()}</span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h1>
                <p className="text-indigo-600 font-bold uppercase text-xs tracking-widest mt-2 flex items-center justify-center md:justify-start gap-2">
                  <Shield size={14} /> Verified Professional
                </p>
                <p className="text-slate-400 font-medium mt-4 max-w-lg">{user.bio || "No bio yet. Tell us about yourself!"}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[40px] shadow-xl border border-slate-100 p-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900 italic">Personal Details</h2>
              <button 
                onClick={handleUpdate} 
                disabled={saving}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                Save Changes
              </button>
            </div>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:ring-2 ring-indigo-100 transition-all">
                  <User size={20} className="text-slate-400" />
                  <input 
                    value={user.name} 
                    onChange={(e) => setUser({...user, name: e.target.value})}
                    className="bg-transparent outline-none w-full font-bold text-slate-700" 
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 focus-within:ring-2 ring-indigo-100 transition-all">
                  <Briefcase size={20} className="text-slate-400" />
                  <input 
                    value={user.title || ''} 
                    onChange={(e) => setUser({...user, title: e.target.value})}
                    className="bg-transparent outline-none w-full font-bold text-slate-700" 
                    placeholder="e.g. Senior Frontend Developer"
                  />
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                <div className="flex items-center gap-3 bg-slate-100 p-4 rounded-2xl border border-slate-200 opacity-70 cursor-not-allowed">
                  <Mail size={20} className="text-slate-400" />
                  <input 
                    value={user.email} 
                    disabled 
                    className="bg-transparent outline-none w-full font-bold text-slate-500 cursor-not-allowed" 
                  />
                  <span className="text-[10px] font-black bg-slate-200 text-slate-500 px-2 py-1 rounded">LOCKED</span>
                </div>
              </div>

              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">About Me</label>
                <textarea 
                  value={user.bio || ''} 
                  onChange={(e) => setUser({...user, bio: e.target.value})}
                  className="w-full bg-slate-50 p-5 rounded-2xl border border-slate-100 focus:ring-2 ring-indigo-100 outline-none font-medium text-slate-600 h-32 resize-none"
                  placeholder="Write a short bio about your career goals..."
                />
              </div>
            </form>
          </div>

        </div>
      </main>
    </div>
  );
}