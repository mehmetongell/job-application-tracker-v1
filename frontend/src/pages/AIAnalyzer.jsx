import React, { useState } from 'react';
import { BrainCircuit, FileText, Shield, TrendingUp, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import API from '../services/api';
import toast from 'react-hot-toast';

export default function AIAnalyzer() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);

    try {
      const { data } = await API.post('/ai/analyze-resume', formData);
      setResult(data.data.analysis);
      toast.success("Analysis complete!");
    } catch (err) { toast.error("Quota limit or file error."); }
    finally { setLoading(false); }
  };

  const handleGetQuestions = async () => {
    setLoadingQuestions(true);
    try {
      // Not: Resume text normalde backend'de PDF'den okunuyor, burada analiz sonucundan besleniyoruz
      const { data } = await API.post('/ai/interview-prep', { jobDescription: jobDesc });
      setQuestions(data.data);
      toast.success("Interview prep ready!");
    } catch (err) { toast.error("Could not generate questions."); }
    finally { setLoadingQuestions(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar activePage="ai" />
      <main className="flex-1 p-10 max-w-6xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-3 italic tracking-tight">AI Compatibility Engine</h1>
          <p className="text-slate-500 font-medium">Evaluate your profile against any job description in seconds.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <form onSubmit={handleAnalyze} className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-50 space-y-6 h-fit">
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Requirements</label>
              <textarea required className="w-full h-48 p-5 bg-slate-50 border border-slate-100 rounded-[24px] outline-none focus:ring-2 ring-indigo-100 transition-all text-sm font-medium" placeholder="Paste the job requirements here..." onChange={(e) => setJobDesc(e.target.value)} />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Resume (PDF)</label>
              <div className="relative border-2 border-dashed border-slate-200 rounded-[24px] p-8 text-center hover:border-indigo-400 transition-all group">
                <input type="file" required accept=".pdf" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={(e) => setFile(e.target.files[0])} />
                <FileText size={32} className="mx-auto text-slate-300 group-hover:text-indigo-500 mb-2 transition-colors" />
                <span className="block text-sm font-bold text-slate-600">{file ? file.name : "Select your Resume PDF"}</span>
              </div>
            </div>
            <button disabled={loading} className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black shadow-xl hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-3">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><BrainCircuit size={20}/> Run AI Analysis</>}
            </button>
          </form>

          <div className="space-y-6">
            {result ? (
              <div className="bg-white p-8 rounded-[40px] shadow-2xl border-t-[12px] border-indigo-600 animate-in fade-in slide-in-from-bottom-4">
                <div className="flex justify-between items-center mb-8">
                  <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full uppercase tracking-widest italic">Match Result</span>
                  <div className="text-6xl font-black text-indigo-600">%{result.matchPercentage}</div>
                </div>
                <p className="text-slate-600 font-bold italic mb-8 leading-relaxed text-lg">"{result.summary}"</p>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-3 flex items-center gap-2">⚠️ Missing Skills</h4>
                    <div className="flex flex-wrap gap-2">{result.missingKeywords.map(k => <span key={k} className="bg-rose-50 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold border border-rose-100">{k}</span>)}</div>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">💡 Strategic Advice</h4>
                    <ul className="space-y-3">{result.improvementTips.map(t => <li key={t} className="text-slate-500 text-sm font-bold flex gap-3"><TrendingUp size={16} className="text-emerald-500 shrink-0"/>{t}</li>)}</ul>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-50">
                  <button onClick={handleGetQuestions} disabled={loadingQuestions} className="w-full py-4 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all">
                    {loadingQuestions ? "Generating..." : <><Sparkles size={16}/> Get Personalized Interview Questions</>}
                  </button>
                  
                  {questions.length > 0 && (
                    <div className="mt-8 space-y-4 animate-in fade-in zoom-in-95">
                      {questions.map((q, i) => (
                        <div key={i} className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                          <p className="font-black text-slate-800 text-sm mb-2">Q{i+1}: {q.question}</p>
                          <div className="bg-indigo-600/5 p-4 rounded-2xl text-[11px] text-indigo-700 font-bold border border-indigo-100/50">
                             <strong>Tip:</strong> {q.hint}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[40px] text-slate-300 space-y-4">
                <BrainCircuit size={48} className="opacity-10" />
                <p className="font-black uppercase tracking-[0.2em] text-sm italic">Analyze your first resume</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}