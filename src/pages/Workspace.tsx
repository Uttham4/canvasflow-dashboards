// src/pages/Workspace.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { supabase } from '../services/supabaseClient';
import Header from '../components/common/Header';
import CreateDashboardModal from '../components/workspaces/CreateDashboardModal';
import { Link } from 'react-router-dom';

const Workspace = () => {
  const { session } = useAuth();
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboards = async () => {
    if (!session) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke('dashboards-api', {
      headers: { 'Authorization': `Bearer ${session.access_token}` },
      method: 'GET'
    });
    if (error) {
      console.error('Error fetching dashboards:', error);
    } else {
      setDashboards(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboards();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Header />
      <div className="container mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">My Workspace</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-200"
          >
            Create New Dashboard
          </button>
        </div>

        {dashboards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboards.map((dashboard: any) => (
              <Link to={`/dashboard/${dashboard.id}`} key={dashboard.id}>
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
                  <h2 className="text-xl font-semibold mb-2">{dashboard.name}</h2>
                  <p className="text-gray-400 text-sm">{dashboard.description}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-20">
            <p>You don't have any dashboards yet. Create one to get started!</p>
          </div>
        )}
      </div>
      
      <CreateDashboardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDashboardCreated={fetchDashboards}
      />
    </div>
  );
};

export default Workspace;