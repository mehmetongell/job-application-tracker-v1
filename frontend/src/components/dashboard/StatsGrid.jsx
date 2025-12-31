import React from 'react';
import { Briefcase, Calendar, PlusCircle, LogOut, BrainCircuit } from 'lucide-react';
import { StatCard } from '../Shared';

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
      <StatCard label="Total" value={stats.APPLIED} color="indigo" icon={Briefcase} />
      <StatCard label="Interview" value={stats.INTERVIEW} color="amber" icon={Calendar} />
      <StatCard label="Offer" value={stats.OFFER} color="emerald" icon={PlusCircle} />
      <StatCard label="Rejected" value={stats.REJECTED} color="rose" icon={LogOut} />
      
      <div className="bg-gradient-to-br from-indigo-600 to-violet-800 p-6 rounded-[32px] text-white shadow-xl shadow-indigo-200">
         <BrainCircuit className="mb-4 opacity-50" size={24}/>
         <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Avg. Compatibility</p>
         <h3 className="text-4xl font-black mt-1">%{stats.AI_AVG}</h3>
      </div>
    </div>
  );
}