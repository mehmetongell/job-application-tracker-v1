import React, { useState } from 'react';
import { Upload, BrainCircuit, CheckCircle2, AlertCircle, X, Activity, MessageSquare, BookOpen, Lightbulb } from 'lucide-react';
import API from '../../services/api';
import toast from 'react-hot-toast';

export default function AnalysisModal({ job, onClose }) {
  const [activeTab, setActiveTab] = useState('match'); 
  
  const [file, setFile] = useState(null);
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const [interviewLoading, setInterviewLoading] = useState(false);
  const [interviewResult, setInterviewResult] = useState(null);


  const handleMatchAnalysis = async () => {
    if (!file) return toast.error("Please select a PDF resume first!");
    
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', `${job.position} at ${job.company}. Location: ${job.location || 'Not specified'}`);
    formData.append('jobTitle', job.position);

    setMatchLoading(true);
    try {
      const { data } = await API.post('/ai/analyze-resume', formData);
      setMatchResult(data.data.analysis);
      toast.success("Analysis Complete!");
    } catch (err) {
      toast.error("Analysis failed.");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleGetInterviewQuestions = async () => {
    if (interviewResult) return; 
    
    setInterviewLoading(true);
    try {
      const { data } = await API.post('/ai/interview-prep', {
        company: job.company,
        position: job.position
      });
      setInterviewResult(data.data);
    } catch (err) {
      toast.error("Could not generate questions.");
    } finally {
      setInterviewLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-3xl rounded-[44px] p-8 shadow-2xl overflow-hidden border border-white flex flex-col max-h-[90vh]">
        
        {/* --- HEADER --- */}
        <div className="flex justify-between items-start mb-6 shrink-0">
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

        {/* --- TABS --- */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 shrink-0">
          <button 
            onClick={() => setActiveTab('match')}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'match' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <Activity size={16} /> Match Score
          </button>
          <button 
            onClick={() => { setActiveTab('interview'); handleGetInterviewQuestions(); }}
            className={`flex-1 py-3 rounded-xl text-sm font-black transition-all flex items-center justify-center gap-2 ${activeTab === 'interview' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <MessageSquare size={16} /> Interview Coach
          </button>
        </div>

        {/* --- CONTENT AREA (Scrollable) --- */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* TAB 1: CV MATCH */}
          {activeTab === 'match' && (
            <div className="animate-in slide-in-from-left-4 duration-300">
              {!matchResult ? (
                <div className="space-y-6 py-4">
                  <div className="border-4 border-dashed border-indigo-50 rounded-[32px] p-12 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer relative group text-center">
                    <input type="file" accept=".pdf" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                    <Upload className="mx-auto mb-4 text-slate-200 group-hover:text-indigo-300 transition-colors" size={48} />
                    <p className="font-black text-slate-400 text-sm">{file ? file.name : "Drop your CV (PDF)"}</p>
                  </div>
                  <button 
                    onClick={handleMatchAnalysis} disabled={matchLoading || !file}
                    className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {matchLoading ? <Activity className="animate-spin" /> : "Analyze Match"}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Score */}
                  <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[32px] text-white flex justify-between items-center shadow-lg shadow-indigo-200">
                    <div>
                      <p className="text-xs font-black uppercase opacity-60 tracking-[0.2em]">Compatibility</p>
                      <h3 className="text-6xl font-black mt-1">%{matchResult.matchPercentage}</h3>
                    </div>
                    <CheckCircle2 size={48} className="text-white/30" />
                  </div>
                  {/* Summary */}
                  <div className="bg-slate-50 p-6 rounded-[24px]">
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{matchResult.summary}</p>
                  </div>
                  <button onClick={() => setMatchResult(null)} className="w-full text-slate-400 text-xs font-bold uppercase tracking-widest hover:text-indigo-600">Analyze Again</button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INTERVIEW COACH */}
          {activeTab === 'interview' && (
            <div className="animate-in slide-in-from-right-4 duration-300">
              {interviewLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Activity className="animate-spin mb-4 text-indigo-600" size={40} />
                  <p className="font-black text-xs uppercase tracking-widest">Generating Questions...</p>
                </div>
              ) : interviewResult ? (
                <div className="space-y-6">
                  
                  {/* Culture Tip */}
                  <div className="bg-amber-50 p-5 rounded-[24px] flex gap-4 items-start border border-amber-100">
                    <Lightbulb className="text-amber-500 shrink-0" size={24} />
                    <div>
                      <h4 className="font-black text-amber-900 text-xs uppercase tracking-widest mb-1">Culture Tip</h4>
                      <p className="text-amber-800 text-sm font-medium">{interviewResult.companyCultureTip}</p>
                    </div>
                  </div>

                  {/* Technical Questions */}
                  <div>
                    <h4 className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-widest mb-4">
                      <BookOpen size={16} className="text-indigo-600" /> Technical Questions
                    </h4>
                    <div className="space-y-3">
                      {interviewResult.technicalQuestions?.map((q, i) => (
                        <div key={i} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors">
                          <p className="font-bold text-slate-700 mb-2">Q{i+1}: {q.question}</p>
                          <p className="text-xs text-slate-400 font-medium italic">💡 Hint: {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Behavioral Questions */}
                  <div>
                    <h4 className="flex items-center gap-2 font-black text-slate-800 text-sm uppercase tracking-widest mb-4 mt-8">
                      <MessageSquare size={16} className="text-emerald-600" /> Behavioral
                    </h4>
                    <div className="space-y-3">
                      {interviewResult.behavioralQuestions?.map((q, i) => (
                        <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-emerald-100 transition-colors">
                          <p className="font-bold text-slate-700 mb-2">{q.question}</p>
                          <p className="text-xs text-slate-400 font-medium italic">💡 Focus: {q.hint}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-10 text-slate-400">
                  <p>Failed to load questions. Try again.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}