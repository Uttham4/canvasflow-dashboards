import React from 'react';
import { useParams } from 'react-router-dom';

// Placeholder for a navigation component
const Sidebar = () => {
  return (
    <div className="w-64 h-full bg-gray-800 p-6 flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-8">
          Canvasflow
        </h2>
        <nav className="space-y-4">
          <a
            href="/workspace"
            className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m0 0l-7 7-7-7m7 7v-3m0 3h7m-7 0h-7" />
            </svg>
            <span>Workspace</span>
          </a>
          <div className="flex items-center space-x-3 text-teal-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm14 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm14 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            <span>Dashboards</span>
          </div>
        </nav>
      </div>
      <div>
        <button
          onClick={() => supabase.auth.signOut()}
          className="w-full flex items-center justify-center space-x-3 px-4 py-2 text-red-400 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-auto relative">
        {/* Dynamic Background Grid */}
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-5"></div>
        
        <div className="relative z-10 flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-extrabold text-white">Dashboard {id}</h1>
            <p className="text-gray-400 mt-2">
              An interactive visualization of your data.
            </p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-colors duration-200">
              Share
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-sm font-semibold transition-colors duration-200">
              Save
            </button>
          </div>
        </div>

        {/* Dashboard Grid/Canvas Placeholder */}
        <div className="p-6 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 h-[calc(100vh-140px)]">
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg border border-dashed border-gray-600 rounded-lg">
            Drag and drop charts here to build your dashboard.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;