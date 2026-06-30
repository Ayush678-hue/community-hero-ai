'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Bell, Trophy, Flame, LogOut, Shield } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  const { user, login, logout, notifications, loadStoredAuth } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  const toggleRole = (role) => {
    const defaultUser = {
      id: 'demo_user_123',
      name: role === 'citizen' ? 'Aria Chen' : 'Officer Marcus Vance',
      email: role === 'citizen' ? 'aria@civic.org' : 'm.vance@citygov.gov',
      role: role,
      heroPoints: role === 'citizen' ? 145 : 0,
      badges: role === 'citizen' ? [{ title: 'First Responder', description: 'Reported 1st valid issue' }] : []
    };
    login(defaultUser, 'mock_jwt_token_for_hackathon');
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b border-editorial-border py-4 px-6 md:px-12 flex justify-between items-center select-none">
      {/* Brand Logo - Luxury styling */}
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-xl bg-editorial-dark flex items-center justify-center shadow-lg">
          <Flame className="w-5 h-5 text-editorial-bg animate-pulse" />
        </div>
        <div>
          <span className="font-serif font-semibold text-lg tracking-tight text-editorial-dark">
            CommunityHero
          </span>
          <span className="text-[9px] block text-editorial-accent font-extrabold tracking-widest uppercase">
            AI Operating System
          </span>
        </div>
      </div>

      {/* Center Links */}
      <div className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-editorial-dark/70">
        <Link href="/" className="hover:text-editorial-accent transition-colors">
          Home
        </Link>
        {user?.role === 'citizen' && (
          <Link href="/citizen" className="hover:text-editorial-accent transition-colors">
            Citizen Hub
          </Link>
        )}
        {user?.role === 'authority' && (
          <Link href="/authority" className="hover:text-editorial-accent transition-colors">
            Command Center
          </Link>
        )}
      </div>

      {/* Right widgets */}
      <div className="flex items-center gap-4">
        {/* Hackathon Role Switcher */}
        <div className="flex bg-slate-200/60 p-0.5 rounded-xl border border-editorial-border text-[10px] gap-0.5 font-bold">
          <button
            onClick={() => toggleRole('citizen')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              user?.role === 'citizen'
                ? 'bg-editorial-dark text-editorial-bg shadow-sm'
                : 'text-editorial-dark/60 hover:text-editorial-dark'
            }`}
          >
            Citizen Mode
          </button>
          <button
            onClick={() => toggleRole('authority')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              user?.role === 'authority'
                ? 'bg-editorial-alert text-editorial-bg shadow-sm'
                : 'text-editorial-dark/60 hover:text-editorial-dark'
            }`}
          >
            Command Panel
          </button>
        </div>

        {user ? (
          <div className="flex items-center gap-3">
            {user.role === 'citizen' && (
              <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-700 px-2.5 py-1.5 rounded-lg border border-yellow-500/20 text-xs font-bold">
                <Trophy className="w-3.5 h-3.5" />
                <span>{user.heroPoints} pts</span>
              </div>
            )}

            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl bg-white border border-editorial-border text-editorial-dark/60 hover:text-editorial-dark transition-all relative"
              >
                <Bell className="w-4 h-4" />
                {notifications.filter(n => !n.readStatus).length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-editorial-alert rounded-full" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 glass-panel rounded-2xl border border-editorial-border p-4 shadow-xl text-left">
                  <h4 className="font-serif font-bold text-sm mb-3 text-editorial-dark border-b border-editorial-border pb-2">
                    Recent Alerts
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications logged.</p>
                    ) : (
                      notifications.map((n, i) => (
                        <div key={i} className="text-xs p-2 rounded bg-editorial-bg border border-editorial-border">
                          <p className="font-bold text-editorial-dark">{n.title}</p>
                          <p className="text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-xl bg-white border border-editorial-border text-editorial-dark/60 hover:text-editorial-dark transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleRole('citizen')}
            className="glow-btn px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5"
          >
            Portal Login
          </button>
        )}
      </div>
    </nav>
  );
}
