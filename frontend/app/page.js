'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Shield, Sparkles, MapPin, Award, ArrowRight, Eye, RefreshCw, Activity, CheckCircle, TrendingUp, Navigation } from 'lucide-react';
import Link from 'next/link';

const LIVE_EVENTS = [
  { type: 'RESOLVED', text: 'Pothole resolved near Metro Crossing', points: '+50 pts to Aria C.', time: 'Just now' },
  { type: 'VERIFIED', text: 'Water leakage verified in West District', points: '+10 pts to Elena R.', time: '2 mins ago' },
  { type: 'REPORTED', text: 'Garbage Overflow detected by YOLOv8 near park', points: 'AI Priority: Medium', time: '5 mins ago' },
  { type: 'ESCALATED', text: 'Critical Sewage Overflow reported near school', points: 'Auto-Routed to Water Dept', time: '10 mins ago' },
  { type: 'RESOLVED', text: 'Broken Streetlight repaired on 5th Avenue', points: '+50 pts to Devon L.', time: '15 mins ago' }
];

export default function LandingPage() {
  const { login } = useStore();
  const [reportsCount, setReportsCount] = useState(1489);
  const [heroesCount, setHeroesCount] = useState(542);
  const [feedIndex, setFeedIndex] = useState(0);

  // Dynamic ticking counters for live demo simulation
  useEffect(() => {
    const counterInterval = setInterval(() => {
      setReportsCount(prev => prev + (Math.random() > 0.65 ? 1 : 0));
      setHeroesCount(prev => prev + (Math.random() > 0.95 ? 1 : 0));
    }, 4500);

    const feedInterval = setInterval(() => {
      setFeedIndex(prev => (prev + 1) % LIVE_EVENTS.length);
    }, 5000);

    return () => {
      clearInterval(counterInterval);
      clearInterval(feedInterval);
    };
  }, []);

  const handleQuickDemo = (role) => {
    const demoUser = {
      id: 'demo_user_123',
      name: role === 'citizen' ? 'Aria Chen' : 'Officer Marcus Vance',
      email: role === 'citizen' ? 'aria@civic.org' : 'm.vance@citygov.gov',
      role: role,
      heroPoints: role === 'citizen' ? 145 : 0,
      badges: role === 'citizen' ? [{ title: 'First Responder', description: 'Reported 1st valid issue' }] : []
    };
    login(demoUser, 'mock_jwt_token_for_hackathon');
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center py-10 md:py-16 gap-12 max-w-5xl mx-auto overflow-hidden">
      
      {/* Editorial Grid Background */}
      <div className="absolute inset-0 -z-10 pointer-events-none opacity-25">
        <div className="w-full h-full bg-[linear-gradient(rgba(28,29,31,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(28,29,31,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Hero Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-editorial-dark/5 border border-editorial-border text-editorial-dark text-[10px] font-bold uppercase tracking-widest select-none">
        <Sparkles className="w-3.5 h-3.5 text-editorial-accent animate-pulse" />
        Futuristic Civic Intelligence Operating System
      </div>

      {/* Value Proposition Section */}
      <div className="space-y-6 text-center">
        <h1 className="text-5xl md:text-8xl font-serif text-editorial-dark tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Empowering Communities <br />
          Through <span className="italic font-light text-editorial-accent">AI-Driven Civic Action</span>
        </h1>
        <p className="text-sm md:text-base text-slate-500 max-w-2xl mx-auto font-sans leading-relaxed">
          Real-time civic intelligence powered by AI, geolocation, and community collaboration. Snap a photo. AI classifies the hazard and routes repair workflows automatically.
        </p>
      </div>

      {/* Tactile Pill-Style CTAs */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full max-w-md">
        <Link 
          href="/citizen" 
          onClick={() => handleQuickDemo('citizen')}
          className="glow-btn w-full sm:w-auto px-8 py-3.5 rounded-full text-editorial-bg font-bold text-center text-sm tracking-wider uppercase flex items-center justify-center gap-2 group transition-all"
        >
          Report an Issue
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link 
          href="/citizen" 
          onClick={() => handleQuickDemo('citizen')}
          className="w-full sm:w-auto bg-white border border-editorial-border hover:border-editorial-accent/40 hover:bg-slate-50/50 px-8 py-3.5 rounded-full text-editorial-dark font-bold text-center text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-1.5 shadow-sm"
        >
          <Navigation className="w-4 h-4 text-editorial-accent" />
          Explore Live Map
        </Link>
      </div>

      {/* Luxury Immersive 3D/Perspective HUD Terminal Display */}
      <div className="w-full glass-panel border border-editorial-border rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-8 shadow-editorial relative overflow-hidden select-none hover:shadow-2xl transition-shadow duration-500">
        <div className="absolute inset-0 bg-gradient-to-tr from-editorial-accent/3 via-transparent to-transparent -z-10"></div>
        
        {/* Left terminal metadata */}
        <div className="md:col-span-6 space-y-4 flex-1">
          <span className="text-[10px] text-editorial-accent font-extrabold tracking-widest uppercase">System Telemetry</span>
          <h2 className="text-3xl font-serif text-editorial-dark leading-tight">
            Intelligent mapping, routing, and verification.
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed font-sans">
            Our priority engine aggregates location sensitivities, public safety risks, and community verify counts to queue critical repairs first.
          </p>
          <div className="flex gap-4 pt-2">
            <div className="bg-editorial-dark/3 p-4 rounded-2xl border border-editorial-border flex-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">Resolutions Verified</span>
              <span className="text-2xl font-serif text-editorial-dark font-bold mt-1 block">94.2%</span>
            </div>
            <div className="bg-editorial-dark/3 p-4 rounded-2xl border border-editorial-border flex-1">
              <span className="text-[9px] text-slate-400 block font-bold uppercase tracking-wider">AI Accuracy Rate</span>
              <span className="text-2xl font-serif text-green-600 font-bold mt-1 block">98.4%</span>
            </div>
          </div>
        </div>

        {/* Right 3D Perspective Graphic Wrapper */}
        <div className="md:col-span-6 flex-1 h-56 relative bg-slate-100/50 rounded-2xl border border-editorial-border flex items-center justify-center [perspective:800px] overflow-hidden">
          {/* Laser scanning strip */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-editorial-accent/8 to-transparent animate-laser-scan -z-10"></div>
          
          {/* 3D Floating perspective card */}
          <div className="w-56 h-36 rounded-2xl bg-white border border-editorial-border shadow-xl p-4 flex flex-col justify-between [transform:rotateX(20deg)_rotateY(-15deg)] hover:[transform:rotateX(10deg)_rotateY(-5deg)] transition-transform duration-700 hover:shadow-2xl">
            <div className="flex justify-between items-center text-[9px] font-bold">
              <span className="bg-red-500/10 text-red-700 border border-red-500/25 px-2 py-0.5 rounded">CRITICAL HAZARD</span>
              <span className="text-slate-400">#00f2fe</span>
            </div>
            <div>
              <h4 className="text-sm font-bold text-editorial-dark font-sans">Pothole Detected</h4>
              <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-0.5">
                <MapPin className="w-3 h-3 text-editorial-accent" /> School safety zone
              </p>
            </div>
            <div className="flex justify-between items-center text-[9px] border-t border-editorial-border/60 pt-2 font-mono text-slate-400">
              <span>Confidence: 94.2%</span>
              <span className="text-editorial-accent font-bold">YOLOv8 Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Stats Dashboard Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-2">
        {[
          { label: 'Reports Logged', value: reportsCount.toLocaleString(), trend: '+3 today', color: 'text-editorial-accent' },
          { label: 'AI Accuracy Rating', value: '98.4%', trend: '↑ +2.1% this week', color: 'text-green-700', isRadar: true },
          { label: 'Verified Resolutions', value: '1,102', trend: '94.2% rate', color: 'text-editorial-dark' },
          { label: 'Active Heroes', value: heroesCount.toLocaleString(), trend: '+12 active today', color: 'text-yellow-700' }
        ].map((stat, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl text-left border border-editorial-border hover:border-editorial-accent/30 transition-all flex flex-col justify-between h-28 relative group select-none hover:shadow-sm">
            {stat.isRadar && (
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-green-600 animate-pulse" />
            )}
            <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider block">
              {stat.label}
            </span>
            <div className="my-1">
              <span className={`text-2xl md:text-3xl font-serif font-extrabold ${stat.color} block tracking-tight`}>
                {stat.value}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
              <TrendingUp className="w-3.5 h-3.5 text-editorial-accent" />
              {stat.trend}
            </span>
          </div>
        ))}
      </div>

      {/* Live Community Activity Ticker */}
      <div className="w-full glass-panel border border-editorial-border rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none shadow-sm hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 min-w-[160px]">
          <Activity className="w-4 h-4 text-editorial-alert animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Live Civic Feed
          </span>
        </div>
        <div className="flex-1 h-8 overflow-hidden relative flex items-center">
          <div 
            className="absolute left-0 right-0 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs transition-all duration-700 ease-in-out"
            key={feedIndex}
          >
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold tracking-wide ${
                LIVE_EVENTS[feedIndex].type === 'RESOLVED' ? 'bg-green-500/10 text-green-700 border border-green-500/25' :
                LIVE_EVENTS[feedIndex].type === 'VERIFIED' ? 'bg-blue-500/10 text-blue-700 border border-blue-500/25' :
                LIVE_EVENTS[feedIndex].type === 'ESCALATED' ? 'bg-red-500/10 text-red-700 border border-red-500/25' :
                'bg-yellow-500/10 text-yellow-700 border border-yellow-500/25'
              }`}>
                {LIVE_EVENTS[feedIndex].type}
              </span>
              <span className="text-editorial-dark font-medium">{LIVE_EVENTS[feedIndex].text}</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500 mt-1 sm:mt-0">
              <span className="text-editorial-accent font-bold text-[11px]">{LIVE_EVENTS[feedIndex].points}</span>
              <span>{LIVE_EVENTS[feedIndex].time}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards Grid */}
      <div className="w-full space-y-4 text-left mt-4 select-none">
        <h2 className="text-2xl md:text-3xl font-serif text-editorial-dark text-center mb-8">
          Intelligent Civic Features
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: <Shield className="w-6 h-6 text-editorial-accent" />,
              title: 'AI Computer Vision',
              desc: 'YOLOv8 automatically detects and routes pothole depths, overflowing public garbage, water leakages, and broken streetlights.',
              link: '/features/ai-computer-vision',
              hud: (
                <div className="mt-4 border border-editorial-border rounded-xl p-3 bg-slate-50 font-mono text-[9px] relative overflow-hidden h-20">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-editorial-accent/3 to-transparent animate-laser-scan"></div>
                  <p className="text-editorial-accent border-b border-editorial-border pb-1 font-bold">⚡ yolo_infer_stream_active</p>
                  <p className="text-editorial-dark mt-1.5">🎯 Detected: <span className="text-green-700 font-bold">Pothole (94.2%)</span></p>
                  <p className="text-slate-400">BoundingBox: [x:120, y:230, w:80, h:50]</p>
                </div>
              )
            },
            {
              icon: <MapPin className="w-6 h-6 text-blue-500" />,
              title: 'Live Viewport Rendering',
              desc: 'Interactive world maps populate issues in real-time based on active bounds, adapting dynamically as you search any city worldwide.',
              link: '/features/live-viewport-rendering',
              hud: (
                <div className="mt-4 border border-editorial-border rounded-xl p-3 bg-slate-50 font-mono text-[9px] h-20 flex flex-col justify-between">
                  <div className="flex justify-between items-center text-slate-400 font-bold">
                    <span>📡 Boundary: [OSM Nominatim]</span>
                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                  </div>
                  <p className="text-editorial-dark font-bold">Query geocode: "West Sector"</p>
                  <p className="text-slate-400">Live coordinates lookup flyTo triggered...</p>
                </div>
              )
            },
            {
              icon: <Award className="w-6 h-6 text-yellow-600" />,
              title: 'Hero Point Gamification',
              desc: 'Earn reputation points, redeemable achievement badges, and climb levels by reporting issues, upvoting, and verifying repairs.',
              link: '/features/hero-point-gamification',
              hud: (
                <div className="mt-4 border border-editorial-border rounded-xl p-3 bg-slate-50 font-mono text-[9px] h-20 flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 font-bold">🏆 Level 3 Hero</p>
                    <p className="text-slate-400 mt-1 font-sans">First Responder Badge</p>
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/25 px-2.5 py-1 rounded text-yellow-700 text-center font-bold">
                    <span className="font-extrabold text-xs block">+15</span>
                    <span>points</span>
                  </div>
                </div>
              )
            }
          ].map((item, idx) => (
            <Link
              href={item.link}
              key={idx}
              className="feature-card group block rounded-3xl glass-panel border border-editorial-border hover:border-editorial-accent/35 transition-all duration-400 hover:scale-[1.03] hover:shadow-editorial cursor-pointer"
              aria-label={`Learn more about ${item.title}`}
              tabIndex={0}
            >
              <div className="p-6 flex flex-col justify-between h-full select-none">
                <div className="space-y-4">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 border border-editorial-border flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-editorial-dark group-hover:text-editorial-accent transition-colors duration-200">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                {item.hud}
                <span className="mt-4 inline-flex items-center text-xs text-editorial-accent font-bold group-hover:underline">
                  Learn More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
