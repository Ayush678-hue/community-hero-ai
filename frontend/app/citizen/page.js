'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '../../store/useStore';
import { Camera, MapPin, Mic, CheckCircle, RefreshCw, Trophy, Award, Navigation } from 'lucide-react';
import AuthGuard from '../../components/AuthGuard';

const LeafletMap = dynamic(() => import('../../components/LeafletMap'), { ssr: false });

export default function CitizenDashboard() {
  const { user, complaints, setComplaints, addComplaint, updateComplaint, awardPoints, addNotification, userCoords } = useStore();
  const [showReportModal, setShowReportModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userCreatedComplaints, setUserCreatedComplaints] = useState([]);
  
  
  const [issueType, setIssueType] = useState('Pothole');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [coordinates, setCoordinates] = useState({ lat: 37.7749, lng: -122.4194 }); 
  
  
  const [aiPreview, setAiPreview] = useState(null);

  
  useEffect(() => {
    if (userCoords) {
      setCoordinates({ lat: userCoords[0], lng: userCoords[1] });
    }
  }, [userCoords]);

  
  const handleViewportChange = (bounds, center) => {
    if (!bounds || !center) return;
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();
    const latDiff = northEast.lat - southWest.lat;
    const lngDiff = northEast.lng - southWest.lng;

    const categories = [
      'Pothole',
      'Garbage Overflow',
      'Water Leakage',
      'Broken Road',
      'Streetlight Damage',
      'Sewage Issues'
    ];
    const severities = ['Low', 'Medium', 'High', 'Critical'];

    const generated = [];
    for (let i = 1; i <= 6; i++) {
      const lat = southWest.lat + Math.random() * latDiff * 0.8 + latDiff * 0.1;
      const lng = southWest.lng + Math.random() * lngDiff * 0.8 + lngDiff * 0.1;
      const chosenType = categories[(i + Math.floor(Math.abs(center[0] * 100))) % categories.length];
      const chosenSeverity = severities[(i + Math.floor(Math.abs(center[1] * 100))) % severities.length];

      generated.push({
        _id: `mock_viewport_${i}_${Math.floor(Math.abs(center[0] * 10))}`,
        issueType: chosenType,
        description: `Hazard detected in active district. Location verified by automated reports.`,
        imageUrl: i % 2 === 0
          ? 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=400&q=80'
          : 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=400&q=80',
        location: { type: 'Point', coordinates: [lng, lat] },
        severity: chosenSeverity,
        status: i === 4 ? 'Verified' : 'Reported',
        verificationCount: i === 4 ? 2 : 0,
        verifiedBy: i === 4 ? ['demo_user_123'] : [],
        createdBy: { name: 'Local Resident', heroPoints: 40 },
        aiAnalysis: { confidence: 0.90, summary: `AI classified ${chosenType} with ${chosenSeverity} severity.` }
      });
    }

    const merged = [...userCreatedComplaints, ...generated];
    setComplaints(merged);
  };

  const triggerConfetti = async () => {
    const confetti = (await import('canvas-confetti')).default;
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0052cc', '#cc3300', '#1b8753']
    });
  };

  const handleGeoTag = () => {
    const baseCoords = userCoords || [37.7749, -122.4194];
    const offsetLat = (Math.random() - 0.5) * 0.005;
    const offsetLng = (Math.random() - 0.5) * 0.005;
    setCoordinates({
      lat: parseFloat((baseCoords[0] + offsetLat).toFixed(6)),
      lng: parseFloat((baseCoords[1] + offsetLng).toFixed(6))
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setAiPreview({ status: 'analyzing' });
        setTimeout(() => {
          setAiPreview({
            issueType: issueType,
            confidence: 0.92,
            severity: issueType === 'Pothole' ? 'High' : 'Medium',
            summary: `AI detects ${issueType} with 92% confidence score. Geolocation tag resolved.`
          });
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!imagePreview) {
      alert('Please select or capture an image of the civic issue');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const newReport = {
        _id: `complaint_${Date.now()}`,
        issueType: issueType,
        description: description,
        imageUrl: imagePreview,
        location: {
          type: 'Point',
          coordinates: [coordinates.lng, coordinates.lat]
        },
        severity: aiPreview?.severity || 'Medium',
        status: 'Reported',
        verificationCount: 0,
        upvotes: [],
        verifiedBy: [],
        createdBy: { name: user?.name || 'Aria Chen', heroPoints: user?.heroPoints || 145 },
        aiAnalysis: {
          confidence: aiPreview?.confidence || 0.91,
          summary: aiPreview?.summary || `AI classified ${issueType} successfully.`
        }
      };

      addComplaint(newReport);
      setUserCreatedComplaints((prev) => [newReport, ...prev]);
      awardPoints(15);
      addNotification({
        title: 'Report Filed successfully',
        message: `Your report on "${issueType}" has been verified by the AI engine. +15 Hero Points!`
      });

      triggerConfetti();

      setIssueType('Pothole');
      setDescription('');
      setImageFile(null);
      setImagePreview(null);
      setAiPreview(null);
      setShowReportModal(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleVerify = (id) => {
    const complaint = complaints.find(c => c._id === id);
    if (!complaint) return;
    if (complaint.verifiedBy.includes(user?.id)) return;

    const updated = {
      ...complaint,
      verificationCount: complaint.verificationCount + 1,
      verifiedBy: [...complaint.verifiedBy, user?.id],
      status: complaint.verificationCount + 1 >= 2 ? 'Verified' : complaint.status
    };

    updateComplaint(updated);
    awardPoints(5);
    addNotification({
      title: 'Contribution Recorded',
      message: 'Verified local issue in your neighborhood. +5 Hero Points!'
    });
    
    triggerConfetti();
  };

  return (
    <AuthGuard allowedRoles={['citizen']}>
      <div className="space-y-6 py-6 font-sans">
      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-border pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-editorial-dark">Citizen Hub</h1>
          <p className="text-sm text-slate-500 mt-1">Map, report, and verify hyperlocal civic infrastructure hazards.</p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="glow-btn px-6 py-3 rounded-full text-editorial-bg font-bold text-xs tracking-wider uppercase flex items-center gap-2 self-start md:self-auto"
        >
          <Camera className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-lg font-serif font-bold text-editorial-dark flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-editorial-accent animate-spin" />
              Nearby Community Feed
            </h2>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {complaints.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No nearby reports found in this viewport.</p>
              ) : (
                complaints.map((c) => {
                  const isVerifiedByUser = c.verifiedBy.includes(user?.id);
                  return (
                    <div key={c._id} className="p-4 rounded-2xl bg-white/60 border border-editorial-border hover:border-editorial-accent/35 transition-all flex flex-col gap-3 shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase ${
                          c.severity === 'Critical' ? 'bg-red-500/10 text-red-700 border border-red-500/20' :
                          c.severity === 'High' ? 'bg-orange-500/10 text-orange-700 border border-orange-500/20' :
                          'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20'
                        }`}>
                          {c.severity} Priority
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          Status: <span className="text-editorial-dark font-extrabold">{c.status}</span>
                        </span>
                      </div>

                      <div className="flex gap-3">
                        {c.imageUrl && (
                          <img 
                            src={c.imageUrl} 
                            alt={c.issueType} 
                            className="w-20 h-20 rounded-xl object-cover border border-editorial-border"
                          />
                        )}
                        <div className="flex-1 space-y-1">
                          <h3 className="font-serif font-bold text-base text-editorial-dark">{c.issueType}</h3>
                          <p className="text-xs text-slate-500 line-clamp-2">{c.description || 'No description provided.'}</p>
                        </div>
                      </div>

                      <div className="text-[11px] bg-slate-100/50 border border-editorial-border rounded-xl p-2.5 text-slate-500 font-mono">
                        <span className="font-bold text-editorial-accent block mb-0.5"></span>
                        {c.aiAnalysis?.summary}
                      </div>

                      <div className="flex items-center justify-between border-t border-editorial-border/60 pt-2 text-xs">
                        <span className="text-slate-500 font-semibold">
                          Verifications: <span className="text-editorial-dark font-extrabold">{c.verificationCount}</span>
                        </span>
                        <button
                          disabled={isVerifiedByUser}
                          onClick={() => handleVerify(c._id)}
                          className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            isVerifiedByUser 
                              ? 'bg-green-500/10 text-green-700 border-green-500/20' 
                              : 'bg-editorial-dark text-editorial-bg border-editorial-dark hover:bg-editorial-accent hover:border-editorial-accent'
                          }`}
                        >
                          {isVerifiedByUser ? 'Verified' : 'Verify (+5 pts)'}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {}
          <div className="glass-panel p-6 rounded-3xl border border-editorial-border shadow-editorial">
            <h2 className="text-lg font-serif font-bold text-editorial-dark flex items-center gap-2 mb-4">
              <Trophy className="w-5 h-5 text-yellow-600" />
              Community Leaderboard
            </h2>
            <div className="space-y-3">
              {[
                { name: 'Marcus Sterling', points: 340, rank: 1 },
                { name: 'Elena Rostova', points: 285, rank: 2 },
                { name: 'Aria Chen (You)', points: 145, rank: 3 }
              ].map((hero, i) => (
                <div key={i} className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-white/50 border border-editorial-border">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-slate-200 border border-editorial-border flex items-center justify-center font-bold text-slate-500 text-[10px]">
                      {hero.rank}
                    </span>
                    <span className="text-editorial-dark font-semibold">{hero.name}</span>
                  </div>
                  <span className="font-bold text-editorial-accent">{hero.points} pts</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {}
        <div className="lg:col-span-7 h-[650px]">
          <LeafletMap complaints={complaints} heatmapMode={false} onViewportChange={handleViewportChange} />
        </div>
      </div>

      {}
      {showReportModal && (
        <div className="fixed inset-0 z-[9999] bg-editorial-dark/30 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl glass-panel rounded-3xl border border-editorial-border p-6 md:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-editorial-border pb-4">
              <h2 className="text-2xl font-serif font-bold text-editorial-dark">Report Civic Hazard</h2>
              <button 
                onClick={() => setShowReportModal(false)}
                className="text-slate-400 hover:text-editorial-dark font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-6 font-sans">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Issue Category</label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full bg-white border border-editorial-border rounded-xl p-3 text-editorial-dark text-xs font-semibold focus:outline-none focus:border-editorial-accent"
                    >
                      <option value="Pothole">Pothole</option>
                      <option value="Garbage Overflow">Garbage Overflow</option>
                      <option value="Water Leakage">Water Leakage</option>
                      <option value="Broken Road">Broken Road</option>
                      <option value="Streetlight Damage">Streetlight Damage</option>
                      <option value="Sewage Issues">Sewage Issues</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Description</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      placeholder="Describe the hazard level, traffic impacts..."
                      className="w-full bg-white border border-editorial-border rounded-xl p-3 text-editorial-dark text-xs focus:outline-none focus:border-editorial-accent placeholder-slate-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">GPS Geotag</label>
                    <div className="flex items-center gap-2 bg-white border border-editorial-border p-3 rounded-xl justify-between shadow-sm">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                        <MapPin className="w-4 h-4 text-editorial-accent" />
                        <span>{coordinates.lat.toFixed(4)}, {coordinates.lng.toFixed(4)}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleGeoTag}
                        className="text-xs text-editorial-accent hover:underline font-bold uppercase tracking-wider text-[10px]"
                      >
                        Autodetect GPS
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Voice Complaint</label>
                    <button
                      type="button"
                      onClick={() => setIsRecording(!isRecording)}
                      className={`w-full py-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all ${
                        isRecording 
                          ? 'bg-editorial-alert/15 text-editorial-alert border-editorial-alert animate-pulse' 
                          : 'bg-white text-slate-500 border-editorial-border hover:text-editorial-dark'
                      }`}
                    >
                      <Mic className="w-4 h-4" />
                      {isRecording ? 'Recording complaint...' : 'Record Voice Details'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Upload Media</label>
                    <div className="border-2 border-dashed border-editorial-border rounded-2xl h-44 flex flex-col items-center justify-center relative overflow-hidden bg-slate-50">
                      {imagePreview ? (
                        <>
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button
                            type="button; button"
                            onClick={() => { setImageFile(null); setImagePreview(null); setAiPreview(null); }}
                            className="absolute top-2 right-2 bg-editorial-dark/80 p-1.5 rounded-full text-white text-xs hover:bg-editorial-dark"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <label className="cursor-pointer flex flex-col items-center gap-2 text-xs text-slate-400 font-semibold">
                          <Camera className="w-8 h-8 text-slate-300" />
                          <span>Upload photo of civic issue</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {aiPreview && (
                    <div className="border border-editorial-border rounded-xl p-3 bg-slate-950 font-mono text-[10px] space-y-2 h-[120px] overflow-y-auto select-none">
                      <div className="flex items-center gap-1.5 border-b border-slate-900 pb-1 text-cyber-accent">
                        <span className="w-1.5 h-1.5 bg-cyber-accent rounded-full animate-ping"></span>
                        <span>AI VISION TERMINAL v8</span>
                      </div>
                      {aiPreview.status === 'analyzing' ? (
                        <div className="text-slate-500 animate-pulse">Running object detection inference...</div>
                      ) : (
                        <div className="space-y-1 text-slate-300">
                          <p>🎯 Classify: <span className="text-white font-bold">{aiPreview.issueType}</span></p>
                          <p>📊 Confident: <span className="text-green-400">{(aiPreview.confidence * 100).toFixed(0)}%</span></p>
                          <p>⚠️ Severity: <span className="text-editorial-alert font-bold">{aiPreview.severity}</span></p>
                          <p>📝 Summary: {aiPreview.summary}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="flex gap-4 border-t border-editorial-border pt-4 justify-end font-bold">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-5 py-2.5 rounded-full bg-white border border-editorial-border text-slate-500 text-xs tracking-wider uppercase hover:text-editorial-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="glow-btn px-6 py-2.5 rounded-full text-editorial-bg text-xs tracking-wider uppercase flex items-center gap-2"
                >
                  {isLoading ? 'Uploading...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </AuthGuard>
  );
}
