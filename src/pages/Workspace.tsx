// src/pages/Workspace.tsx

import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { supabase } from '../services/supabaseClient';
import { Link } from 'react-router-dom';

const Workspace = () => {
  const { session } = useAuth();
  const [dashboards, setDashboards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboards = async () => {
      if (!session) return;
      
      const { data, error } = await supabase.functions.invoke('dashboards-api', {
        method: 'GET', // <-- THIS IS THE CRITICAL FIX
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        console.error('Error fetching dashboards:', error);
      } else {
        setDashboards(data);
      }
      setLoading(false);
    };

    fetchDashboards();
  }, [session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading dashboards...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-900 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-8">My Workspace</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboards.map((dashboard) => (
          <Link to={`/dashboard/${dashboard.id}`} key={dashboard.id} className="block">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:scale-105">
              <h2 className="text-xl font-semibold mb-2">{dashboard.name}</h2>
              <p className="text-gray-400">{dashboard.description}</p>
            </div>
          </Link>
        ))}
        <button className="bg-gray-700 hover:bg-gray-600 rounded-lg shadow-lg flex items-center justify-center p-6 text-gray-400 border-2 border-dashed border-gray-500">
          <span className="text-xl">+ New Dashboard</span>
        </button>
      </div>
    </div>
  );
};

export default Workspace;