import React from 'react';
import { Activity, BrainCircuit } from 'lucide-react';

const MagicFill = ({ magicLink, setMagicLink, handleMagicFill, isMagicLoading }) => {
  return (
    <div className="relative mb-6">
      <label className="block text-[10px] font-black uppercase text-indigo-600 mb-2 tracking-widest">
        Magic Link (AI Scraper)
      </label>
      <div className="flex gap-2">
        <input 
          type="url"
          placeholder="Paste LinkedIn/Kariyer link..." 
          className="flex-1 px-6 py-4 bg-indigo-50/50 border border-indigo-100 rounded-2xl outline-none focus:ring-2 ring-indigo-200 font-bold text-sm"
          value={magicLink}
          onChange={(e) => setMagicLink(e.target.value)}
        />
        <button 
          type="button"
          onClick={handleMagicFill}
          disabled={isMagicLoading}
          className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center disabled:opacity-50"
        >
          {isMagicLoading ? <Activity className="animate-spin" size={20}/> : <BrainCircuit size={20} />}
        </button>
      </div>
    </div>
  );
};

export default MagicFill;