import React from 'react';
import { MoreHorizontal, ExternalLink, Calendar, MapPin } from 'lucide-react';

export default function JobTable({ jobs, onJobClick }) {
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'INTERVIEW': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'OFFER': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'REJECTED': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100">
            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest pl-10">Company</th>
            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
            <th className="p-6 text-xs font-black text-slate-400 uppercase tracking-widest text-right pr-10">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="3" className="p-10 text-center text-slate-400 font-medium">
                No jobs found. Start by adding one!
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr 
                key={job.id} 
                onClick={() => onJobClick && onJobClick(job)} 
                className="group hover:bg-slate-50 transition-colors cursor-pointer relative"
              >
                <td className="p-6 pl-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-lg shadow-sm group-hover:scale-110 transition-transform">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-base">{job.company}</h3>
                      <p className="text-slate-500 font-bold text-xs mt-0.5">{job.position}</p>
                    </div>
                  </div>
                </td>
                
                <td className="p-6">
                  <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border ${getStatusColor(job.status)}`}>
                    {job.status}
                  </span>
                </td>
                
                <td className="p-6 text-right pr-10">
                  <span className="text-slate-400 font-bold text-xs tabular-nums">
                    {new Date(job.createdAt).toLocaleDateString("tr-TR")}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}