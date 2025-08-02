// src/components/common/Header.tsx
import React from 'react';
import { useAuth } from '../../components/auth/AuthContext';
import { supabase } from '../../services/supabaseClient';
import { Link } from 'react-router-dom';

const Header = () => {
  const { session, user } = useAuth();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <header className="py-6 px-6 bg-gray-900 flex justify-between items-center text-white border-b border-gray-700">
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-xl font-bold text-teal-400">
          Canvasflow
        </Link>
        {session && (
          <nav className="hidden md:flex space-x-4 ml-6">
            <Link to="/workspace" className="text-gray-400 hover:text-white transition-colors duration-200">
              Workspace
            </Link>
            {/* Add other authenticated links here */}
          </nav>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {session ? (
          <>
            <img 
              src={user?.user_metadata.avatar_url || 'https://placehold.co/40x40/555555/FFFFFF?text=A'} 
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-lg transition-colors duration-200"
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;