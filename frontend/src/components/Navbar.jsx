import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'AI Analyzer', path: '/ai-analysis', icon: '🤖' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <nav className="w-64 min-h-screen bg-white border-r border-gray-200 p-6 hidden md:block">
      <div className="text-2xl font-bold text-indigo-600 mb-10 flex items-center gap-2">
        🚀 <span className="text-gray-900">CareerAI</span>
      </div>
      
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path 
                ? 'bg-indigo-50 text-indigo-600 font-bold' 
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <span>{item.icon}</span>
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;