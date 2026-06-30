'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../../store/useStore';
import { firebaseUpdateUserRole } from '../firebaseAuthHelper';
import { User, ShieldAlert, Award, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';

export default function RoleSelectionPage() {
  const { user, login, loadStoredAuth } = useStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const selectRole = async (role) => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setIsLoading(true);
    try {
      // Update role in database
      await firebaseUpdateUserRole(user.uid, role);
      
      // Update role in local Zustand store & localStorage
      const updatedUser = { ...user, role: role };
      const token = localStorage.getItem('hero_token') || 'mock_token';
      login(updatedUser, token);
      
      // Redirect to correct dashboard
      router.push(role === 'authority' ? '/authority' : '/citizen');
    } catch (error) {
      console.error("Failed to select role:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0f1d] text-white relative font-sans overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="w-full h-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
      </div>

      <div className="w-full max-w-2xl z-10 space-y-8 flex flex-col items-center">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-serif font-extrabold text-white tracking-tight">Select Your Calling</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Choose your role in the civic ecosystem to access tailored features and dashboards.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid md:grid-cols-2 gap-6 w-full mt-4">
          
          {/* Citizen Card */}
          <div 
            onClick={() => !isLoading && selectRole('citizen')}
            className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-80 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white group-hover:text-cyan-400 transition-colors">Citizen Hero</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Report local infrastructure hazards in seconds. Verify neighboring issues, accumulate Hero Points, and earn community badges as you build a safer neighborhood.
              </p>
            </div>
            <button className="w-full mt-6 bg-cyan-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow">
              Join as Citizen <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Authority Card */}
          <div 
            onClick={() => !isLoading && selectRole('authority')}
            className="group relative bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 flex flex-col justify-between h-80 hover:border-rose-500/40 hover:bg-slate-900/80 transition-all cursor-pointer shadow-xl hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-serif font-bold text-white group-hover:text-rose-400 transition-colors">Operations Command</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Review priority alert queues and dispatch municipal maintenance crews. Track density heatmaps, log resolution snapshots, and verify civic repairs.
              </p>
            </div>
            <button className="w-full mt-6 bg-rose-500 text-slate-950 font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow">
              Join as Authority <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
