import React from 'react';
import { MapPin } from 'lucide-react';
import { StatusBadge } from '../Shared';

export default function JobTable({ jobs, onJobClick }) {
  return (
    <div className="bg-white rounded-[44px] shadow-2xl shadow-slate-200/50 border border-slate-50 overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="text-slate-300 text-[10px] uppercase font-black border-b border-slate-50">
            <th className="px-10 py-6">Company & Role</th>
            <th className="px-10 py-6 text-center">Status</th>
            <th className="px-10 py-6">Location</th>
            <th className="px-10 py-6 text-right">Added</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-50">
          {jobs.map((job) => (
            <tr 
              key={job.id} 
              onClick={() => onJobClick(job)}
              className="group hover:bg-indigo-50/20 transition-all cursor-pointer"
            >
              <td className="px-10 py-7">
                <div className="flex flex-col">
                  <span className="font-black text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                    {job.company}
                  </span>
                  <span className="text-slate-400 font-bold text-xs">{job.position}</span>
                </div>
              </td>
              <td className="px-10 py-7 text-center">
                <StatusBadge status={job.status} />
              </td>
              <td className="px-10 py-7 text-slate-500 font-black text-sm">
                <div className="flex items-center gap-2">
                  <MapPin size={14} />{job.location || 'Remote'}
                </div>
              </td>
              <td className="px-10 py-7 text-right text-slate-400 text-[10px] font-black italic">
                {new Date(job.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {jobs.length === 0 && (
        <div className="p-20 text-center text-slate-300 font-black uppercase tracking-widest">
          Pipeline Empty
        </div>
      )}
    </div>
  );
}