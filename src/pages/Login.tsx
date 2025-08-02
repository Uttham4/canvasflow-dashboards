import React from 'react';
import { supabase } from '../services/supabaseClient';

const Login = () => {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/workspace`,
      },
    });
    if (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className="relative h-screen flex overflow-hidden">
      {/* Dynamic Background Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gray-950 p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 opacity-80 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/lined-paper.png')] opacity-5 z-10"></div>
        <div className="relative z-20 text-center space-y-6">
          <svg
            className="w-20 h-20 text-indigo-400 mx-auto animate-fade-in-up"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <h1 className="text-5xl font-extrabold text-white animate-fade-in-up">
            Canvasflow Dashboards
          </h1>
          <p className="text-xl font-light text-gray-300 max-w-sm mx-auto animate-fade-in-up">
            Visualize your data with stunning, interactive dashboards powered by DuckDB and Supabase.
          </p>
        </div>
      </div>

      {/* Login Form Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-900 relative">
        <div className="relative z-10 w-full max-w-md space-y-8 p-10 bg-gray-800 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm bg-opacity-80 animate-fade-in-up">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-white">
              Sign In to Your Workspace
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Unlock a world of powerful data insights.
            </p>
          </div>
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center px-6 py-3 rounded-xl shadow-lg text-lg font-bold bg-gradient-to-r from-teal-500 to-green-600 hover:from-teal-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105"
          >
            <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M44.5 20H24V28.8H35.2C34.7 31.1 33.3 33.1 31.4 34.4L38.4 39.8C42.8 35.8 45 29.8 45 23.5C45 22.7 45 21.9 44.8 21.2C44.7 20.6 44.6 20 44.5 20Z" fill="#4285F4" />
              <path d="M24 45C30.6 45 36.1 42.8 40.5 39.2L33.5 33.8C31.5 35.2 28.9 36 26 36C20.8 36 16.3 33.2 13.9 28.8L6.8 33.6C9.9 39.6 16.4 45 24 45Z" fill="#34A853" />
              <path d="M13.9 28.8C13.2 26.8 12.8 24.5 12.8 22.2C12.8 19.9 13.2 17.6 13.9 15.6L6.8 10.8C4 16.2 4 28.2 6.8 33.6L13.9 28.8Z" fill="#FBBC04" />
              <path d="M24 9C27.4 9 30.5 10.2 32.9 12.3L39.8 5.4C35.9 2 30.4 0 24 0C16.4 0 9.9 5.4 6.8 10.8L13.9 15.6C16.3 11.2 20.8 9 26 9H24Z" fill="#EA4335" />
            </svg>
            Sign in with Google
          </button>
        </div>
      </div>

      {/* Required for custom animations */}
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.8; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s infinite ease-in-out;
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;