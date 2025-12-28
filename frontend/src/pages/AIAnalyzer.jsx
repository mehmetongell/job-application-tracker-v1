import React, { useState } from 'react';
import axios from 'axios';

const AIAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jobDesc);

    try {
      const { data } = await axios.post('/api/ai/analyze-resume', formData);
      setResult(data.data.analysis);
    } catch (err) {
      alert("AI analysis failed. Please check your API quota.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-2xl font-bold mb-6">AI Career Assistant</h2>
      <form onSubmit={handleUpload} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block mb-2 font-medium">Job Description</label>
          <textarea 
            className="w-full p-3 border rounded-lg h-32"
            placeholder="Paste the job description here..."
            onChange={(e) => setJobDesc(e.target.value)}
          />
        </div>
        
        <div>
          <label className="block mb-2 font-medium">Upload Resume (PDF)</label>
          <input type="file" onChange={(e) => setFile(e.target.files[0])} className="w-full" />
        </div>

        <button 
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {loading ? "AI is thinking..." : "Start Analysis"}
        </button>
      </form>

      {result && (
        <div className="mt-10 p-6 bg-indigo-50 rounded-xl border border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold">Analysis Result</h3>
            <span className="text-3xl font-bold text-indigo-600">%{result.matchPercentage}</span>
          </div>
          <p className="text-gray-700 mb-4 italic">"{result.summary}"</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-bold text-red-500 mb-2">Missing Skills</h4>
              <ul className="list-disc ml-4 text-sm">{result.missingKeywords.map(k => <li key={k}>{k}</li>)}</ul>
            </div>
            <div className="bg-white p-4 rounded shadow-sm">
              <h4 className="font-bold text-green-500 mb-2">Improvement Tips</h4>
              <ul className="list-disc ml-4 text-sm">{result.improvementTips.map(t => <li key={t}>{t}</li>)}</ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const handleGetQuestions = async () => {
  setLoadingQuestions(true);
  try {
    const { data } = await API.post('/ai/interview-prep', { jobDescription: jobDesc, resumeText: "PDF_TEXT_HERE" });
    setQuestions(data.data);
  } catch (err) {
    alert("Could not fetch questions.");
  } finally {
    setLoadingQuestions(false);
  }
};

{result && (
  <div className="mt-8">
    <button 
      onClick={handleGetQuestions}
      className="flex items-center gap-2 text-indigo-600 font-black uppercase text-xs hover:bg-indigo-50 p-3 rounded-xl transition-all"
    >
      <Shield size={16} /> Generate Personalized Interview Questions
    </button>
    
    {questions.length > 0 && (
      <div className="mt-6 space-y-4 animate-in slide-in-from-top-4 duration-500">
        {questions.map((q, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-3xl shadow-sm">
            <h5 className="font-black text-slate-800 mb-2">Q{i+1}: {q.question}</h5>
            <div className="bg-amber-50 p-4 rounded-2xl text-xs text-amber-800 font-medium">
              <strong>💡 Pro Tip:</strong> {q.hint}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
)}