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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-editorial-bg text-editorial-dark relative font-sans overflow-hidden select-none">
      {/* Light Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="w-full h-full bg-[linear-gradient(rgba(28,29,31,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,29,31,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-editorial-accent/5 rounded-full blur-[100px] pointer-events-none"></div>

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
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-editorial-accent/5 border border-editorial-border text-editorial-accent text-[10px] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" /> SECURE ACCESS GATEWAY
              </div>
              <div className="flex items-center justify-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-editorial-dark flex items-center justify-center shadow-lg">
                  <Flame className="w-5.5 h-5.5 text-editorial-bg" />
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-editorial-dark">CommunityHero AI</h1>
              </div>
              <p className="text-[11px] text-slate-500 tracking-wide font-medium">
                AI-powered civic reporting starts here.
              </p>
            </div>

            {/* Main Auth Glass Card */}
            <div className="w-full bg-editorial-card border border-editorial-border rounded-3xl p-6 md:p-8 space-y-5 shadow-editorial relative">
              
              {/* Error Message Box */}
              {error && (
                <div className="bg-editorial-alert/10 border border-editorial-alert/20 p-3 rounded-2xl text-editorial-alert text-[11px] flex items-center gap-2 font-medium">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Form inputs */}
              <form onSubmit={handleEmailAuth} className="space-y-4">
                {isSignUp && (
                  <div className="space-y-1.5 text-left">
                    <label className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white border border-editorial-border rounded-xl py-2.5 px-3.5 text-xs text-editorial-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-editorial-accent/30 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input
                      type="email"
                      placeholder="name@civic.org"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white border border-editorial-border rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-editorial-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-editorial-accent/30 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-[9px] text-slate-500 font-extrabold uppercase tracking-wider block">Password</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-white border border-editorial-border rounded-xl py-2.5 pl-10 pr-3.5 text-xs text-editorial-dark placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-editorial-accent/30 focus:border-transparent transition-all duration-300"
                    />
                  </div>
                  {/* Forgot Password utility link */}
                  {!isSignUp && (
                    <a 
                      href="#" 
                      onClick={(e) => { e.preventDefault(); alert("Demo Mode Password Reset: Any email/password will log you in successfully in demo mode!"); }}
                      className="text-[10px] text-slate-500 hover:text-editorial-accent hover:underline transition-colors block text-right mt-1.5 font-bold"
                    >
                      Forgot password?
                    </a>
                  )}
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-editorial-dark hover:bg-editorial-accent text-editorial-bg font-bold py-3 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-[2px] active:translate-y-0 text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-4"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-editorial-bg border-t-transparent rounded-full animate-spin" />
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
                  <div className="flex-grow border-t border-editorial-border"></div>
                  <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">or</span>
                  <div className="flex-grow border-t border-editorial-border"></div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={isLoading}
                  className="w-full bg-white hover:bg-slate-50 border border-editorial-border text-editorial-dark font-bold py-3 rounded-xl transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2.5 text-xs"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.486 0-6.315-2.829-6.315-6.314 0-3.486 2.829-6.315 6.315-6.315 1.564 0 2.977.576 4.074 1.536l3.078-3.078C18.966 2.127 15.825 1 12.24 1 5.922 1 1 5.922 1 12.24s4.922 11.24 11.24 11.24c5.892 0 10.824-4.224 10.824-11.24 0-.768-.072-1.356-.18-1.956H12.24z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              {/* Toggle Signup/Signin */}
              <div className="text-center pt-2 border-t border-editorial-border">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-[11px] text-editorial-accent hover:underline font-bold transition-all duration-300"
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                </button>
              </div>
            </div>

            {/* Tertiary Section: Demo Access */}
            <div className="w-full space-y-3 z-10">
              <div className="relative flex items-center justify-center py-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">— Demo Access (For Hackathon Judges) —</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => handleDemoSignIn('citizen')}
                  disabled={isLoading}
                  className="flex-1 bg-editorial-success/5 hover:bg-editorial-success/10 border border-editorial-success/20 hover:border-editorial-success/50 text-editorial-success font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Enter Citizen Demo
                </button>
                <button
                  onClick={() => handleDemoSignIn('authority')}
                  disabled={isLoading}
                  className="flex-1 bg-editorial-alert/5 hover:bg-editorial-alert/10 border border-editorial-alert/20 hover:border-editorial-alert/50 text-editorial-alert font-bold py-3 px-4 rounded-xl text-xs transition-all duration-300 hover:-translate-y-[2px] active:translate-y-0 flex items-center justify-center gap-2"
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
              className="w-16 h-16 rounded-full bg-editorial-dark flex items-center justify-center shadow-lg border border-editorial-border"
            >
              <CheckCircle2 className="w-8 h-8 text-editorial-bg" />
            </motion.div>
            
            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-editorial-dark">Welcome back!</h2>
              <p className="text-xs text-slate-500">
                {successRole === 'authority' 
                  ? 'Accessing Command Center Dashboard...' 
                  : successRole === 'role-selection'
                  ? 'Setting up profile credentials...'
                  : 'Accessing Citizen Hub Dashboard...'
                }
              </p>
            </div>
            
            <div className="flex gap-1.5 items-center mt-2">
              <div className="w-1.5 h-1.5 bg-editorial-accent rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-1.5 h-1.5 bg-editorial-accent rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-editorial-accent rounded-full animate-bounce"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
