import React, { useState } from 'react';
import MediaTrackLogo from "../components/ui/MediaTrackLogo";
import BackgroundImage from '../layout/BackgroundImage';
import { supabase } from "../config";
import { useNavigate } from 'react-router-dom';
import PasswordInput from '../components/ui/PasswordInput';

const Login = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-built email
  const email = 'zyrusalvez13@gmail.com';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Replace this with actual Supabase auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Login successful
        setPassword('h-screen');
        navigate("/")
        console.log('Login successful!', data);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <BackgroundImage />
      
      <div className="flex flex-col items-center justify-center min-h-screen px-6 pt-20">
        {/* Login Form Container */}
        <div className="w-full max-w-md animate-fade-in">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">

            {/* Login Form */}
            <div className="space-y-6">
              <div className='flex justify-center'>
                <MediaTrackLogo width={90}/>
              </div>

              <PasswordInput setPassword={setPassword} password={password} onKeyDown={(e) => e.key === 'Enter' && handleLogin(e)}/>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading || !password}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>

            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Automated Health Check System for Streaming Platforms
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;