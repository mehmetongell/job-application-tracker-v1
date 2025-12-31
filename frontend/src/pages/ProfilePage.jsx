import React, { useState, useEffect } from 'react';
import { User, Shield, Globe, TrendingUp } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', username: '', bio: '', isPublic: false });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const { data } = await API.get('/users/me');
        setProfile(data.data);
      } catch (err) { toast.error("Could not load profile."); }
      finally { setLoading(false); }
    };
    fetchMe();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await API.patch('/users/updateMe', profile);
      toast.success('Profile updated successfully! ✨');
    } catch (err) { toast.error('Error: Username might be taken.'); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="profile" />
      <main className="flex-1 p-10 max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-10 italic">Account & Branding</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <form onSubmit={handleUpdate} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-slate-100">
               <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Full Name</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Public Alias (slug)</label>
                  <div className="flex items-center gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-slate-400 text-xs font-bold">jobpulse.com/public/</span>
                    <input type="text" className="bg-transparent border-none outline-none font-bold w-full" value={profile.username} onChange={(e) => setProfile({...profile, username: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Bio / Headline</label>
                  <textarea className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold h-32" value={profile.bio} onChange={(e) => setProfile({...profile, bio: e.target.value})} />
                </div>
               </div>
            </div>

            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-black text-slate-800 mb-1 flex items-center gap-2"><Globe size={18}/> Visibility</h4>
                <p className="text-xs text-slate-400 font-bold">Toggle public profile for recruiters.</p>
              </div>
              <button type="button" onClick={() => setProfile({...profile, isPublic: !profile.isPublic})} className={`w-14 h-8 rounded-full transition-all relative ${profile.isPublic ? 'bg-indigo-600' : 'bg-slate-200'}`}>
                <div className={`absolute top-1 bg-white w-6 h-6 rounded-full transition-all ${profile.isPublic ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <button className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl shadow-indigo-100 hover:scale-[1.02] active:scale-95 transition-all">Save Changes</button>
          </form>

          <div className="space-y-6">
             <div className="bg-indigo-900 rounded-[40px] p-8 text-white shadow-2xl">
               <TrendingUp size={40} className="mb-6 text-indigo-400" />
               <h3 className="text-2xl font-black leading-tight mb-4">Elevate Your Presence</h3>
               <p className="text-indigo-200 text-sm font-medium">Public profiles with scores above 80% receive 4x more clicks from recruiters.</p>
             </div>
             <div className="bg-white rounded-[40px] p-8 shadow-xl border border-slate-100 text-center">
                <Shield className="mx-auto text-emerald-500 mb-3" size={32}/>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Account Type</p>
                <p className="text-lg font-black text-slate-800">Professional</p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}