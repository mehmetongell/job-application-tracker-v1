import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const PublicProfile = () => {
  const { username } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        const { data } = await axios.get(`/api/users/public/${username}`);
        setData(data.data);
      } catch (err) {
        setError(true);
      }
    };
    fetchPublicData();
  }, [username]);

  if (error) return <div className="text-center mt-20 font-bold text-red-500 text-2xl">Profile not found or private.</div>;
  if (!data) return <div className="text-center mt-20">Loading Profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8 border-b-8 border-indigo-600">
          <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center text-3xl font-bold text-indigo-600 mb-4">
            {data.name?.charAt(0) || 'U'}
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
          <p className="text-gray-500 mt-2">{data.bio || 'Career Explorer'}</p>
        </div>

        {/* AI Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Avg. Match Score</h3>
            <p className="text-4xl font-extrabold text-indigo-600">%{data.stats?.averageMatchScore || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">Analyses Completed</h3>
            <p className="text-4xl font-extrabold text-gray-800">{data.stats?.totalAnalyses || 0}</p>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4">Recent AI Vetting Activity</h3>
          <div className="space-y-4">
            {data.recentActivity.map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700">{analysis.jobTitle}</span>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                  %{analysis.matchPercentage}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;