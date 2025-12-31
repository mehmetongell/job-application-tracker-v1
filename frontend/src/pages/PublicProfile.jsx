import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, BrainCircuit, Globe, Activity } from 'lucide-react';
import API from '../services/api';

export default function PublicProfile() {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await API.get(`/users/public/${username}`);
        setData(data.data);
      } catch (err) { setError(true); }
    };
    fetchPublicData();
  }, [username]);

  if (error) return <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50"><h1 className="text-4xl font-black text-slate-300 italic">404 - Profile is Private or Not Found</h1></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><Activity className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[44px] shadow-2xl p-12 text-center mb-10 border-b-[12px] border-indigo-600 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50"></div>
          <div className="w-28 h-28 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-[36px] mx-auto flex items-center justify-center text-white text-4xl font-black mb-6 shadow-2xl shadow-indigo-100">
            {data.name?.charAt(0)}
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">{data.name}</h1>
          <p className="text-indigo-600 font-black uppercase text-xs tracking-[0.3em] mt-3 italic">{data.bio || 'Career Explorer'}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Avg. Match Score</p>
            <h2 className="text-5xl font-black text-indigo-600">%{data.stats?.averageMatchScore || 0}</h2>
          </div>
          <div className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Success Index</p>
            <h2 className="text-5xl font-black text-slate-800">{data.stats?.totalAnalyses || 0} <span className="text-sm">Jobs</span></h2>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[44px] shadow-xl border border-slate-100">
          <h3 className="font-black text-xl text-slate-800 mb-8 flex items-center gap-3"><Globe size={24} className="text-indigo-600"/> Verified Vetting History</h3>
          <div className="space-y-4">
            {data.recentActivity?.map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:scale-[1.02] transition-transform">
                <span className="font-black text-slate-700 text-lg italic">{analysis.jobTitle}</span>
                <span className="bg-white text-indigo-600 border border-indigo-100 px-5 py-2 rounded-2xl text-sm font-black shadow-sm">%{analysis.matchPercentage}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}