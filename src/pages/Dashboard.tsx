// src/pages/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthContext';
import { supabase } from '../services/supabaseClient';
import DashboardBuilder from '../components/dashboard/DashboardBuilder';
import { Node, Edge } from '@xyflow/react';
import Header from '../components/common/Header';

const Dashboard = () => {
  const { id } = useParams<{ id: string }>();
  const { session } = useAuth();
  const [dashboard, setDashboard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = async () => {
    if (!session || !id) return;
    setLoading(true);
    setError(null);

    try {
      const { data: dashboardData, error: dbError } = await supabase
        .from('dashboards')
        .select('*')
        .eq('id', id)
        .single();

      if (dbError) throw new Error(dbError.message);
      setDashboard(dashboardData);
    } catch (err: any) {
      setError(`Failed to load dashboard: ${err.message}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveDashboard = async (nodes: Node[], edges: Edge[]) => {
    if (!session || !dashboard) return;
    
    const updatedConfig = {
      nodes,
      edges,
    };
    
    const { error } = await supabase
      .from('dashboards')
      .update({ config: updatedConfig })
      .eq('id', id)
      .eq('user_id', session.user.id);
      
    if (error) {
      console.error('Failed to save dashboard:', error.message);
    } else {
      console.log('Dashboard saved successfully!');
    }
  };

  useEffect(() => {
    loadDashboard();
  }, [id, session]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        Error: {error}
      </div>
    );
  }

  return (
    <DashboardBuilder dashboard={dashboard} onSave={handleSaveDashboard} />
  );
};

export default Dashboard;