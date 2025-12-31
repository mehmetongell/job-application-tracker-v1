import React from 'react';
import { X, Activity, BrainCircuit } from 'lucide-react';

export default function JobModal({ 
  isOpen, onClose, onSubmit, formData, setFormData, 
  magicLink, setMagicLink, handleMagicFill, isMagicLoading 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-[44px] p-10 border border-white shadow-2xl animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black italic">New Opportunity</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative mb-6">
            <label className="block text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">Magic Link (AI Scraper)</label>
            <div className="flex gap-2">
              <input 
                type="url" placeholder="Paste link here..." 
                className="flex-1 px-6 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:ring-2 ring-indigo-200 font-bold text-sm"
                value={magicLink} onChange={(e) => setMagicLink(e.target.value)}
              />
              <button 
                type="button" onClick={handleMagicFill} disabled={isMagicLoading}
                className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50"
              >
                {isMagicLoading ? <Activity className="animate-spin" size={20}/> : <BrainCircuit size={20} />}
              </button>
            </div>
          </div>

          <input required placeholder="Company Name" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-bold" value={formData.company} onChange={(e) => setFormData({...formData, company: e.target.value})} />
          <input required placeholder="Position Title" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-bold" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value})} />
          <input placeholder="Location" className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 ring-indigo-100 font-bold" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
          
          <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none font-black text-slate-500 appearance-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <button type="submit" className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-indigo-700 transition-all mt-4">Track It</button>
        </form>
      </div>
    </div>
  );
}