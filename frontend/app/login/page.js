'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { firebaseLoginWithGoogle, firebaseLoginWithEmail, firebaseSignupWithEmail } from '../firebaseAuthHelper';
import { Flame, Mail, Lock, LogIn, UserPlus, Sparkles, User, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const { login, loadStoredAuth } = useStore();
  const router = useRouter();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successRole, setSuccessRole] = useState('');

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await firebaseLoginWithGoogle();
      
      setSuccessRole(result.user.role);
      setIsSuccess(true);
      
      setTimeout(() => {
        login(result.user, result.token);
        if (result.isNewUser) {
          router.push('/role-selection');
        } else {
          router.push(result.user.role === 'authority' ? '/authority' : '/citizen');
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Google Sign-In failed');
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
        setSuccessRole('role-selection');
      } else {
        result = await firebaseLoginWithEmail(email, password);
        setSuccessRole(result.user.role);
      }
      
      setIsSuccess(true);
      
      setTimeout(() => {
        login(result.user, result.token);
        if (isSignUp) {
          router.push('/role-selection');
        } else {
          router.push(result.user.role === 'authority' ? '/authority' : '/citizen');
        }
      }, 1500);
    } catch (err) {
      setError(err.message || 'Invalid credentials or account mismatch');
      setIsLoading(false);
    }
  };

  const handleDemoSignIn = (role) => {
    setIsLoading(true);
    setSuccessRole(role);
    setIsSuccess(true);

    const demoUser = {
      uid: 'demo_uid_' + role + '_' + Date.now(),
      name: role === 'citizen' ? 'Aria Chen (Demo)' : 'Officer Vance (Demo)',
      email: role === 'citizen' ? 'demo.citizen@civic.org' : 'demo.officer@citygov.gov',
      role: role,
      heroPoints: role === 'citizen' ? 145 : 0,
      badges: role === 'citizen' ? [{ title: 'First Responder', description: 'Joined the network' }] : [],
      reportsCount: role === 'citizen' ? 1 : 0
    };

    setTimeout(() => {
      login(demoUser, 'mock_demo_jwt_token_123');
      router.push(role === 'authority' ? '/authority' : '/citizen');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f1d] text-white relative font-sans overflow-hidden select-none">
      {/* Smart City Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="w-full max-w-md space-y-6 flex flex-col items-center z-10"
          >
            {/* Header */}
            <div className="text-center space-y-2.5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> SECURE ACCESS GATEWAY
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Flame className="w-5.5 h-5.5 text-[#0a0f1d]" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-white">CommunityHero AI</h1>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wide font-medium">
                AI-powered civic reporting starts here.
              </p>
            </div>

            {/* Main Auth Glass Card */}
            <div className="w-full bg-slate-950/60 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 space-y-5 shadow-2xl relative">
              
              {/* Error Message Box */}
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-2xl text-red-400 text-[11px] flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-2.5 px-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="name@civic.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-600">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={`w-full bg-slate-950 border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-transparent transition-all duration-300`}
                    />
                  </div>
                  {/* Forgot Password utility link */}
                  {!isSignUp && (
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert("Demo Mode Password Reset: Any email/password will log you in successfully in demo mode!"); }}
                      className="text-[10px] text-slate-500 hover:text-cyan-400 hover:underline transition-colors block text-right mt-1.5 font-bold"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:-translate-y-[2px] active:translate-y-0 text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </>
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

              {/* Secondary Google Auth */}
              <div className="space-y-4">
                <div className="relative flex items-center py-1">
                  <div className="flex-grow border-t border-white/5"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-600 font-extrabold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-white/5"></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/30 text-white font-bold py-3 rounded-xl transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2.5 text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.486 0-6.315-2.829-6.315-6.314 0-3.486 2.829-6.315 6.315-6.315 1.564 0 2.977.576 4.074 1.536l3.078-3.078C18.966 2.127 15.825 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.892 0 10.824-4.224 10.824-11.24 0-.768-.072-1.356-.18-1.956H12.24z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Toggle Signup/Signin */}
              <div className="text-center pt-2 border-t border-white/5">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] text-cyan-400 hover:underline font-bold transition-all duration-300"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>

            {/* Tertiary Section: Demo Access */}
            <div className="w-full space-y-3 z-10">
              <div className="relative flex items-center justify-center py-2">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">— Demo Access (For Hackathon Judges) —</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDemoSignIn('citizen')}
                  disabled={isLoading}
                  className="flex-1 bg-[#10b981]/5 hover:bg-[#10b981]/10 border border-[#10b981]/25 hover:border-[#10b981]/60 text-[#10b981] font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Enter Citizen Demo
                </button>
                <button
                  onClick={() => handleDemoSignIn('authority')}
                  disabled={isLoading}
                  className="flex-1 bg-[#f43f5e]/5 hover:bg-[#f43f5e]/10 border border-[#f43f5e]/25 hover:border-[#f43f5e]/60 text-[#f43f5e] font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Enter Authority Demo
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Cinematic Success Redirection Overlay */
          <motion.div
            key="success-redirect"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center gap-4 text-center z-10"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-16 h-16 rounded-full bg-cyan-500 flex items-center justify-center shadow-lg shadow-cyan-500/40 border border-cyan-400"
            >
              <CheckCircle2 className="w-8 h-8 text-[#0a0f1d]" />
            </motion.div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-white">Welcome back!</h2>
              <p className="text-xs text-slate-400">
                {successRole === 'authority' 
                  ? 'Accessing Command Center Dashboard...' 
                  : successRole === 'role-selection'
                  ? 'Setting up profile credentials...'
                  : 'Accessing Citizen Hub Dashboard...'
                }
              </p>
            </div>
            
            <div className="flex gap-1.5 items-center mt-2">
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
