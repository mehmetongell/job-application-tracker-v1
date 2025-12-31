import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, PlusCircle } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import toast from 'react-hot-toast';

import StatsGrid from '../components/dashboard/StatsGrid';
import JobTable from '../components/dashboard/JobTable';
import JobModal from '../components/dashboard/JobModal';

export default function Dashboard() {
  const [stats, setStats] = useState({ APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0, AI_AVG: 0 });
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ company: '', position: '', location: '', status: 'APPLIED' });
  const [magicLink, setMagicLink] = useState('');
  const [isMagicLoading, setIsMagicLoading] = useState(false);

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

  const handleMagicFill = async () => {
    if (!magicLink) return toast.error("Please paste a link first!");
    setIsMagicLoading(true);
    try {
      const { data } = await API.post('/jobs/auto-fill', { url: magicLink });
      setFormData({
        ...formData,
        company: data.data.company || '',
        position: data.data.position || '',
        location: data.data.location || ''
      });
      toast.success("AI extracted job details!");
      setMagicLink('');
    } catch (err) {
      toast.error(err.response?.data?.error || "AI busy or link invalid.");
    } finally { setIsMagicLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/jobs', formData);
      toast.success("Opportunity added!");
      setIsModalOpen(false);
      setFormData({ company: '', position: '', location: '', status: 'APPLIED' });
      fetchData();
    } catch (err) { toast.error("Error adding job."); }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar activePage="dashboard" />
      
      <main className="flex-1 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">JobPulse</h1>
            <p className="text-slate-400 font-black mt-2 text-xs uppercase tracking-[0.2em]">Application Intelligence</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" placeholder="Filter jobs..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none shadow-sm focus:ring-2 ring-indigo-100 transition-all font-bold"
                value={search} onChange={(e) => { setSearch(e.target.value); fetchData(e.target.value); }}
              />
            </div>
            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-all">
              <PlusCircle size={20} /><span>Add Job</span>
            </button>
          </div>
        </header>

        <StatsGrid stats={stats} />
        
        <JobTable jobs={jobs} />

        <JobModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          magicLink={magicLink}
          setMagicLink={setMagicLink}
          handleMagicFill={handleMagicFill}
          isMagicLoading={isMagicLoading}
        />
      </main>
    </div>
  );
}