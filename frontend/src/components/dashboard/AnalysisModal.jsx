import React, { useState } from 'react';
import { Upload, BrainCircuit, CheckCircle2, AlertCircle, X, Activity } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AnalysisModal({ job, onClose }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a PDF resume first!");
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', `${job.position} at ${job.company}. Location: ${job.location || 'Not specified'}`);
    formData.append('jobTitle', job.position);

    setLoading(true);
    try {
      const { data } = await API.post('/ai/analyze-resume', formData);
      setResult(data.data.analysis);
      toast.success("AI Analysis Complete!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "AI service is currently unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[44px] p-10 shadow-2xl overflow-y-auto max-h-[90vh] border border-white relative animate-in zoom-in-95">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-2xl">
              <BrainCircuit className="text-indigo-600" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 italic leading-none">{job.company}</h2>
              <p className="text-slate-400 font-bold text-xs mt-1 uppercase tracking-wider">{job.position}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-300 transition-colors">
            <X size={24} />
          </button>
        </div>

        {!result ? (
          <div className="space-y-6">
            <div className="border-4 border-dashed border-indigo-50 rounded-[32px] p-16 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer relative group text-center">
              <input 
                type="file" 
                accept=".pdf" 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={(e) => setFile(e.target.files[0])} 
              />
              <Upload className="mx-auto mb-4 text-slate-200 group-hover:text-indigo-300 transition-colors" size={56} />
              <p className="font-black text-slate-400 text-sm">
                {file ? file.name : "Drop your Resume (PDF)"}
              </p>
            </div>
            
            <button 
              onClick={handleUpload} 
              disabled={loading || !file}
              className="w-full bg-slate-900 text-white py-6 rounded-3xl font-black text-lg flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-30 shadow-xl shadow-slate-200"
            >
              {loading ? <Activity className="animate-spin" /> : "Verify Compatibility"}
            </button>
          </div>
        ) : (
          <div className="space-y-8 animate-in slide-in-from-bottom-6">
            {/* Score Display */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-10 rounded-[40px] text-white flex justify-between items-center shadow-2xl shadow-indigo-200">
              <div>
                <p className="text-xs font-black uppercase opacity-60 tracking-[0.2em]">Match Score</p>
                <h3 className="text-7xl font-black mt-2">%{result.matchPercentage}</h3>
              </div>
              <div className="w-24 h-24 rounded-full border-8 border-white/10 flex items-center justify-center">
                <CheckCircle2 size={40} className="text-white/40" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Missing Skills */}
              <div className="bg-slate-50 p-7 rounded-[32px] border border-slate-100">
                <h4 className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} className="text-rose-500" /> Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map(skill => (
                    <span key={skill} className="bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-xl font-bold text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Summary */}
              <div className="bg-slate-50 p-7 rounded-[32px] border border-slate-100">
                <h4 className="font-black text-slate-800 mb-4 text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500" /> AI Insights
                </h4>
                <p className="text-slate-500 text-xs font-bold leading-relaxed">{result.summary}</p>
              </div>
            </div>

            <button 
              onClick={() => setResult(null)} 
              className="w-full py-4 text-slate-300 font-black text-[10px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
            >
              Run another analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}