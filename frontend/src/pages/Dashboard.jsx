import React, { useEffect, useState } from 'react';
import { Search as SearchIcon, PlusCircle, LayoutList, KanbanSquare } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import toast from 'react-hot-toast';

import StatsGrid from '../components/dashboard/StatsGrid';
import JobTable from '../components/dashboard/JobTable';
import JobModal from '../components/dashboard/JobModal';
import AnalysisModal from '../components/dashboard/AnalysisModal'; 
import BoardView from '../components/dashboard/BoardView';

export default function Dashboard() {
  const [stats, setStats] = useState({ APPLIED: 0, INTERVIEW: 0, OFFER: 0, REJECTED: 0, AI_AVG: 0 });
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  
  const [viewMode, setViewMode] = useState('table'); 
  
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedJob, setSelectedJob] = useState(null);  
  
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
    <div className="flex min-h-screen bg-[#F8FAFC] overflow-hidden">
      <Sidebar activePage="dashboard" />
      
      <main className="flex-1 p-10 h-screen overflow-y-auto overflow-x-hidden relative">
        
        <header className="flex justify-between items-center mb-10 relative z-10">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">JobPulse</h1>
            <p className="text-slate-400 font-black mt-2 text-xs uppercase tracking-[0.2em]">Application Intelligence</p>
          </div>
          
          <div className="flex gap-4 items-center">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
              <input 
                type="text" placeholder="Filter jobs..." 
                className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl outline-none shadow-sm focus:ring-2 ring-indigo-100 transition-all font-bold text-sm min-w-[280px]"
                value={search} onChange={(e) => { setSearch(e.target.value); fetchData(e.target.value); }}
              />
            </div>

            <div className="bg-white p-1.5 rounded-2xl border-2 border-red-500 flex items-center gap-1 shadow-sm animate-pulse">
              <button 
                onClick={() => setViewMode('table')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'table' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                title="List View"
              >
                <LayoutList size={20} />
              </button>
              <button 
                onClick={() => setViewMode('board')}
                className={`p-2 rounded-xl transition-all duration-200 ${viewMode === 'board' ? 'bg-indigo-50 text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
                title="Board View"
              >
                <KanbanSquare size={20} />
              </button>
            </div>

            <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black shadow-lg shadow-slate-200 hover:scale-105 active:scale-95 transition-all text-sm">
              <PlusCircle size={18} /><span>Add Job</span>
            </button>
          </div>
        </header>

        <div className="relative z-0">
          <StatsGrid stats={stats} />
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0 mt-8">
          {viewMode === 'table' ? (
            <JobTable 
              jobs={jobs} 
              onJobClick={(job) => setSelectedJob(job)} 
            />
          ) : (
            <BoardView 
              jobs={jobs} 
              onStatusChange={() => fetchData(search)} 
              onJobClick={(job) => setSelectedJob(job)} 
            />
          )}
        </div>

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

        {selectedJob && (
          <AnalysisModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)} 
          />
        )}
      </main>
    </div>
  );
}