'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { firebaseLoginWithGoogle, firebaseLoginWithEmail, firebaseSignupWithEmail } from '../firebaseAuthHelper';
import { Shield, Sparkles, Mail, Lock, LogIn, UserPlus, Flame } from 'lucide-react';

export default function LoginPage() {
  const { login, loadStoredAuth } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await firebaseLoginWithGoogle();
      login(result.user, result.token);
      
      // If it is a new user, they go to role-selection. Otherwise to dashboard
      if (result.isNewUser) {
        router.push('/role-selection');
      } else {
        router.push(result.user.role === 'authority' ? '/authority' : '/citizen');
      }
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      let result;
      if (isSignUp) {
        result = await firebaseSignupWithEmail(name, email, password);
        login(result.user, result.token);
        router.push('/role-selection');
      } else {
        result = await firebaseLoginWithEmail(email, password);
        login(result.user, result.token);
        router.push(result.user.role === 'authority' ? '/authority' : '/citizen');
      }
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (role) => {
    const demoUser = {
      uid: 'demo_uid_' + role + '_' + Date.now(),
      name: role === 'citizen' ? 'Aria Chen (Demo)' : 'Officer Vance (Demo)',
      email: role === 'citizen' ? 'demo.citizen@civic.org' : 'demo.officer@citygov.gov',
      role: role,
      heroPoints: role === 'citizen' ? 145 : 0,
      badges: role === 'citizen' ? [{ title: 'First Responder', description: 'Joined the network' }] : [],
      reportsCount: role === 'citizen' ? 1 : 0
    };
    login(demoUser, 'mock_demo_jwt_token_123');
    router.push(role === 'authority' ? '/authority' : '/citizen');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f1d] text-white relative font-sans overflow-hidden select-none">
      {/* Background neon grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>
      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse top-1/3 pointer-events-none"></div>

      <div className="w-full max-w-md z-10 space-y-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Secure Auth Portal
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/35">
              <Flame className="w-6 h-6 text-[#0a0f1d] animate-pulse" />
            </div>
            <h1 className="text-3xl font-serif font-extrabold text-white tracking-tight">CommunityHero AI</h1>
          </div>
          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            Empowering Communities Through AI-Driven Civic Action
          </p>
        </div>

        {/* Auth Panel Card */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/25 p-3 rounded-xl text-red-400 text-xs text-center font-semibold">
              {error}
            </div>
          )}

          {/* Email Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div className="space-y-1 text-left">
                <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-3 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  placeholder="name@civic.org"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl py-2.5 pl-10 pr-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/10 mt-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Social Sign-In */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-white/10"></div>
            <span className="flex-shrink mx-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">or</span>
            <div className="flex-grow border-t border-white/10"></div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full bg-white hover:bg-slate-50 text-slate-950 font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2.5 text-xs border border-slate-200 shadow-md"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.486 0-6.315-2.829-6.315-6.314 0-3.486 2.829-6.315 6.315-6.315 1.564 0 2.977.576 4.074 1.536l3.078-3.078C18.966 2.127 15.825 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.892 0 10.824-4.224 10.824-11.24 0-.768-.072-1.356-.18-1.956H12.24z"/>
            </svg>
            Continue with Google
          </button>

          {/* Role switcher toggle */}
          <div className="text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-xs text-cyan-400 hover:underline font-bold"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>

        {/* Demo Portals for Hackathon Reviewers */}
        <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => handleDemoSignIn('citizen')}
            className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 py-3 rounded-2xl text-xs font-bold transition-all text-cyan-400"
          >
            Enter Citizen Demo
          </button>
          <button
            onClick={() => handleDemoSignIn('authority')}
            className="flex-1 bg-slate-900 hover:bg-slate-800 border border-white/5 py-3 rounded-2xl text-xs font-bold transition-all text-rose-400"
          >
            Enter Authority Demo
          </button>
        </div>
      </div>
    </div>
  );
}
