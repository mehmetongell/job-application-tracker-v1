import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      const { data } = await axios.get('/api/jobs/stats'); 
      setStats(data.data);
    };
    fetchStats();
  }, []);

  if (!stats) return <div className="p-8">Loading stats...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8">Career Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-indigo-500">
          <p className="text-gray-500 text-sm uppercase">Total Applications</p>
          <h2 className="text-4xl font-bold">{stats.ai.totalAnalyses}</h2>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-green-500">
          <p className="text-gray-500 text-sm uppercase">Avg. AI Match Score</p>
          <h2 className="text-4xl font-bold text-green-600">%{stats.ai.averageMatch}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-t-4 border-orange-500">
          <p className="text-gray-500 text-sm uppercase">Success Rate</p>
          <h2 className="text-4xl font-bold">{stats.ai.successfulApplications || 0} Jobs</h2>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;