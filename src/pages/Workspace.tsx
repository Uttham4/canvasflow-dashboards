// src/pages/Workspace.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../components/auth/AuthContext';
import { supabase } from '../services/supabaseClient';

const Workspace = () => {
  const { session } = useAuth();
  const [dashboards, setDashboards] = useState([]);

  useEffect(() => {
    const fetchDashboards = async () => {
      if (!session) return;
      const { data, error } = await supabase.functions.invoke('dashboards-api', {
        headers: { 'Authorization': `Bearer ${session.access_token}` }
      });
      if (error) {
        console.error('Error fetching dashboards:', error);
      } else {
        setDashboards(data);
      }
    };
    fetchDashboards();
  }, [session]);

  return (
    <div>
      <h1>Welcome to your Workspace</h1>
      <h2>My Dashboards:</h2>
      <ul>
        {dashboards.map((dashboard) => (
          <li key={dashboard.id}>{dashboard.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Workspace;