'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '../store/useStore';

export default function AuthGuard({ children, allowedRoles }) {
  const { user, isAuthenticated, loadStoredAuth } = useStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    loadStoredAuth();
    setChecked(true);
  }, [loadStoredAuth]);

  useEffect(() => {
    if (!checked) return;

    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('hero_token');
      const storedUserStr = localStorage.getItem('hero_user');

      if (!token || !storedUserStr) {
        router.push('/login');
        return;
      }

      const parsedUser = JSON.parse(storedUserStr);
      if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
        // Redirect to their default dashboard if they have a role mismatch
        if (parsedUser.role === 'citizen') {
          router.push('/citizen');
        } else if (parsedUser.role === 'authority') {
          router.push('/authority');
        } else {
          router.push('/login');
        }
      }
    }
  }, [checked, isAuthenticated, user, router, allowedRoles]);

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-editorial-bg font-sans">
        <div className="flex flex-col items-center gap-3 select-none">
          <div className="w-10 h-10 border-4 border-editorial-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Securing session gateway...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
