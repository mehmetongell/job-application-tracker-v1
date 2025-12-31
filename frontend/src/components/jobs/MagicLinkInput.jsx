import React, { useState } from 'react';
import { autoFillJob } from '../../services/jobService';
import { Sparkles, Loader2 } from 'lucide-react'; 

const MagicLinkInput = ({ onJobAdded }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAutoFill = async () => {
    if (!url) return;
    setLoading(true);
    try {
      const result = await autoFillJob(url);
      alert('Job details successfully extracted and saved!');
      onJobAdded(result.data); 
      setUrl(''); 
    } catch (error) {
      console.error('Magic Link Error:', error);
      alert('Something went wrong. Please check your API quota or the link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100 mb-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Sparkles className="text-blue-500" size={20} />
        AI Magic Link Scraper
      </h3>
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="url"
          placeholder="Paste a LinkedIn or Kariyer.net link here..."
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          onClick={handleAutoFill}
          disabled={loading || !url}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Analyzing...
            </>
          ) : (
            'Auto-fill'
          )}
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-2 italic">
        * Works best with public LinkedIn, Kariyer.net, and Google Jobs links.
      </p>
    </div>
  );
};

export default MagicLinkInput;