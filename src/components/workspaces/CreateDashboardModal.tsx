// src/components/workspaces/CreateDashboardModal.tsx
import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../auth/AuthContext';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDashboardCreated: () => void;
}

const CreateDashboardModal: React.FC<ModalProps> = ({ isOpen, onClose, onDashboardCreated }) => {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !name) return;

    setLoading(true);
    setError(null);

    const payload = {
      user_id: session.user.id,
      name,
      description,
      config: {}, // Initialize with an empty config
    };

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .insert(payload)
        .select()
        .single();

      if (error) {
        throw new Error(`Failed to create dashboard: ${error.message}`);
      }

      console.log('Dashboard created:', data);
      onDashboardCreated(); // Notify parent component to re-fetch dashboards
      onClose(); // Close the modal
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md border border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Create New Dashboard</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 p-3 rounded-lg text-red-300 mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Dashboard Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="e.g., Sales Performance"
              required
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              placeholder="A brief overview of the dashboard's purpose"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-200 disabled:bg-indigo-900"
          >
            {loading ? 'Creating...' : 'Create Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDashboardModal;