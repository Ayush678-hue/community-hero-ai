'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, ShieldAlert, Award, Star } from 'lucide-react';

export default function HeroPointGamificationPage() {
  return (
    <div className="space-y-8 py-10 max-w-4xl mx-auto font-sans select-none">
      {}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-editorial-accent hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Terminal Hub
      </Link>

      {}
      <div className="flex items-center gap-4 border-b border-editorial-border pb-6">
        <div className="w-14 h-14 rounded-2xl bg-editorial-dark flex items-center justify-center shadow-lg">
          <Trophy className="w-6 h-6 text-editorial-bg" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-editorial-dark">Hero Point Gamification</h1>
          <p className="text-sm text-slate-500 mt-1">Reputation Tiers, Badge Achievements, & Anti-Spam Verification Rules</p>
        </div>
      </div>

      {}
      <div className="grid md:grid-cols-12 gap-8">
        
        {}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-600" />
              1. Hero Points Score Structure
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Residents earn reputation points by engaging in positive civic behaviors. Points accumulate in the user profile and establish rank placement on the leaderboard:
            </p>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/70 p-3 rounded-xl border border-editorial-border shadow-sm">
                <span className="text-editorial-accent font-extrabold text-lg block">+15</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">File Report</span>
              </div>
              <div className="bg-white/70 p-3 rounded-xl border border-editorial-border shadow-sm">
                <span className="text-editorial-accent font-extrabold text-lg block">+5</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Verify Hazard</span>
              </div>
              <div className="bg-white/70 p-3 rounded-xl border border-editorial-border shadow-sm">
                <span className="text-editorial-accent font-extrabold text-lg block">+50</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase">Issue Resolved</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Award className="w-5 h-5 text-editorial-accent" />
              2. Badge Tiers & Achievements
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Achieving milestones awards citizens with persistent Profile Badges:
            </p>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-3 bg-white/70 p-2.5 rounded-xl border border-editorial-border shadow-sm">
                <div className="w-6 h-6 rounded-full bg-editorial-accent/10 text-editorial-accent flex items-center justify-center font-bold">1</div>
                <div>
                  <h4 className="font-bold text-editorial-dark">Civic Initiator</h4>
                  <p className="text-slate-400 text-[10px]">Awarded immediately upon filing your very first verified civic complaint.</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/70 p-2.5 rounded-xl border border-editorial-border shadow-sm">
                <div className="w-6 h-6 rounded-full bg-yellow-500/10 text-yellow-700 flex items-center justify-center font-bold">2</div>
                <div>
                  <h4 className="font-bold text-editorial-dark">Community Hero</h4>
                  <p className="text-slate-400 text-[10px]">Unlocked when you accumulate 200+ points by resolving issues and upvoting hazards.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-editorial-alert" />
              3. Community Guard Anti-Spam Control
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              To prevent abuse or fake complaints, reported issues enter a pending queue and are not classified as "Verified" or assigned departments until at least two nearby neighbors upvote/verify the coordinate marker. Submitting fake complaints results in point penalties, discouraging spam.
            </p>
          </div>
        </div>

        {}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-editorial-border bg-slate-50 font-mono text-[9px] space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2 text-editorial-accent font-bold">
              <span>🏆 reward_score_trigger</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p className="text-slate-400"></p>
              <p>def award_points(user_id, amount):</p>
              <p className="pl-3">user = db.users.find(user_id)</p>
              <p className="pl-3">user.heroPoints += amount</p>
              <p className="pl-3">if user.heroPoints &gt;= 200:</p>
              <p className="pl-6">user.award_badge("Community Hero")</p>
              <p className="text-editorial-success font-bold mt-2">Active: REWARDS_SCHEDULER_ONLINE</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
