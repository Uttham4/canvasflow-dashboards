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
    <div
      className="relative flex items-center justify-center h-screen bg-cover bg-center text-white"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1620302787823-380d321d2793?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-sm"></div>

      <div className="relative z-10 p-12 mx-4 max-w-sm rounded-xl shadow-2xl bg-white bg-opacity-10 border border-gray-100 border-opacity-30 transform hover:scale-105 transition-transform duration-300 ease-in-out">
        <h1 className="text-4xl font-extrabold text-white mb-2 text-center">Canvasflow</h1>
        <p className="text-xl font-light text-gray-200 text-center mb-8">
          Your data, beautifully visualized.
        </p>
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center px-6 py-3 rounded-lg shadow-lg text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 ease-in-out"
        >
          <svg className="w-6 h-6 mr-3" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M44.5 20H24V28.8H35.2C34.7 31.1 33.3 33.1 31.4 34.4L38.4 39.8C42.8 35.8 45 29.8 45 23.5C45 22.7 45 21.9 44.8 21.2C44.7 20.6 44.6 20 44.5 20Z" fill="#4285F4"/>
            <path d="M24 45C30.6 45 36.1 42.8 40.5 39.2L33.5 33.8C31.5 35.2 28.9 36 26 36C20.8 36 16.3 33.2 13.9 28.8L6.8 33.6C9.9 39.6 16.4 45 24 45Z" fill="#34A853"/>
            <path d="M13.9 28.8C13.2 26.8 12.8 24.5 12.8 22.2C12.8 19.9 13.2 17.6 13.9 15.6L6.8 10.8C4 16.2 4 28.2 6.8 33.6L13.9 28.8Z" fill="#FBBC04"/>
            <path d="M24 9C27.4 9 30.5 10.2 32.9 12.3L39.8 5.4C35.9 2 30.4 0 24 0C16.4 0 9.9 5.4 6.8 10.8L13.9 15.6C16.3 11.2 20.8 9 26 9H24Z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;