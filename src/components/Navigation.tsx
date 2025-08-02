// src/components/Navigation.tsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { useAuth } from './auth/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const { session, user } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getDisplayName = () => {
    return user?.user_metadata?.full_name || user?.email?.split('@')[0];
  };

  return (
    <header className="py-6 px-8 flex items-center justify-between text-white bg-transparent absolute top-0 w-full z-50">
      <Link to="/" className="text-2xl font-bold text-white">
        Canvasflow
      </Link>
      <div className="flex items-center space-x-6">
        <Link to="/workspace" className="hover:text-teal-400 transition-colors">
          Workspace
        </Link>
        {session ? (
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center space-x-2 p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <img
                src={user?.user_metadata?.avatar_url || 'https://via.placeholder.com/32'}
                alt="Profile"
                className="w-8 h-8 rounded-full"
              />
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-20">
                <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                  <p className="font-semibold">{getDisplayName()}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-red-500 hover:text-white transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="px-6 py-2 rounded-full bg-gradient-to-r from-teal-500 to-green-600 font-semibold shadow-lg hover:from-teal-600 hover:to-green-700 transition-all"
          >
            Login
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navigation;