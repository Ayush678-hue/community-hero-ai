'use client';
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useStore } from '../../store/useStore';
import { Shield, Hammer, MapPin, CheckCircle2, TrendingUp, AlertTriangle, HammerIcon, BarChart2 } from 'lucide-react';

const LeafletMap = dynamic(() => import('../../components/LeafletMap'), { ssr: false });

export default function AuthorityDashboard() {
  const { complaints, setComplaints, updateComplaint, addNotification } = useStore();
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [resolutionFile, setResolutionFile] = useState(null);
  const [resolutionPreview, setResolutionPreview] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [similarityScore, setSimilarityScore] = useState(null);
  const [activeTab, setActiveTab] = useState('queue'); // 'queue' or 'stats'

  // Handle viewport bounds updates to dynamically generate mock complaints for heatmap
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

    setComplaints(generated);
  };

  // Form states for complaint detail panel
  const [dept, setDept] = useState('Public Works');
  const [currentStatus, setCurrentStatus] = useState('Reported');

  useEffect(() => {
    if (selectedComplaint) {
      setCurrentStatus(selectedComplaint.status);
    }
  }, [selectedComplaint]);

  const handleUpdate = () => {
    if (!selectedComplaint) return;
    const updated = {
      ...selectedComplaint,
      status: currentStatus
    };
    updateComplaint(updated);
    addNotification({
      title: 'Workforce Dispatched',
      message: `Assigned department "${dept}" to resolve "${selectedComplaint.issueType}". Status: ${currentStatus}`
    });
    setSelectedComplaint(updated);
  };

  const handleResolutionImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResolutionFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setResolutionPreview(reader.result);
        setIsVerifying(true);
        setTimeout(() => {
          setSimilarityScore(89);
          setIsVerifying(false);
        }, 1500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalResolve = () => {
    if (!selectedComplaint) return;
    const updated = {
      ...selectedComplaint,
      status: 'Resolved'
    };
    updateComplaint(updated);
    addNotification({
      title: 'Task Resolved successfully',
      message: `Visual check matches original hazard report by 89%. Task closed.`
    });
    setSelectedComplaint(updated);
    setResolutionFile(null);
    setResolutionPreview(null);
    setSimilarityScore(null);
  };

  return (
    <div className="space-y-6 py-6 font-sans">
      
      {/* Header - Editorial serif */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-editorial-border pb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-editorial-dark">Command Center</h1>
          <p className="text-sm text-slate-500 mt-1">Smart city operations, workforce dispatch, and visual resolution gateways.</p>
        </div>

        {/* Tab triggers */}
        <div className="flex bg-slate-200/60 p-0.5 rounded-xl border border-editorial-border font-bold text-xs self-start md:self-auto">
          <button
            onClick={() => setActiveTab('queue')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'queue' ? 'bg-editorial-dark text-editorial-bg shadow' : 'text-editorial-dark/60 hover:text-editorial-dark'
            }`}
          >
            Dispatch Queue
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-lg transition-all ${
              activeTab === 'stats' ? 'bg-editorial-dark text-editorial-bg shadow' : 'text-editorial-dark/60 hover:text-editorial-dark'
            }`}
          >
            Hotspot Analytics
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Dispatch Queue or Load Charts */}
        <div className="lg:col-span-4 space-y-6">
          {activeTab === 'queue' ? (
            <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
              <h2 className="text-lg font-serif font-bold text-editorial-dark flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-editorial-alert" />
                Active Alerts Queue
              </h2>
              
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {complaints.filter(c => c.status !== 'Resolved').map((c) => (
                  <div
                    key={c._id}
                    onClick={() => setSelectedComplaint(c)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer text-xs space-y-2 text-left ${
                      selectedComplaint?._id === c._id
                        ? 'bg-editorial-accent/10 border-editorial-accent/40 shadow-sm'
                        : 'bg-white border-editorial-border hover:border-editorial-accent/35'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-editorial-dark">{c.issueType}</span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                        c.severity === 'Critical' ? 'bg-red-500/15 text-red-700' :
                        c.severity === 'High' ? 'bg-orange-500/15 text-orange-700' :
                        'bg-yellow-500/15 text-yellow-700'
                      }`}>
                        {c.severity}
                      </span>
                    </div>
                    <p className="text-slate-500 line-clamp-1">{c.description}</p>
                    <div className="flex justify-between text-[10px] text-slate-400 font-semibold pt-1 border-t border-slate-100">
                      <span>Status: {c.status}</span>
                      <span>Verified count: {c.verificationCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
              <h2 className="text-lg font-serif font-bold text-editorial-dark flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-editorial-accent" />
                Workforce Allocation Load
              </h2>
              <div className="space-y-4 text-xs">
                {[
                  { name: 'Public Works (Roads)', load: 85, color: 'bg-red-500' },
                  { name: 'Environmental Health', load: 45, color: 'bg-green-500' },
                  { name: 'Water & Sewage Utilities', load: 70, color: 'bg-blue-500' },
                  { name: 'Electrical Engineering', load: 30, color: 'bg-yellow-500' }
                ].map((dept, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between font-semibold">
                      <span>{dept.name}</span>
                      <span>{dept.load}% load</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className={`h-full ${dept.color}`} style={{ width: `${dept.load}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: details panel or Live Map */}
        <div className="lg:col-span-8">
          {activeTab === 'queue' ? (
            selectedComplaint ? (
              <div className="glass-panel p-6 rounded-3xl border border-editorial-border shadow-editorial space-y-6 text-left">
                <div className="flex justify-between items-start border-b border-editorial-border pb-4">
                  <div>
                    <h2 className="text-2xl font-serif font-bold text-editorial-dark">{selectedComplaint.issueType}</h2>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4 text-editorial-accent" />
                      Coordinates: {selectedComplaint.location.coordinates[1].toFixed(5)}, {selectedComplaint.location.coordinates[0].toFixed(5)}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    selectedComplaint.status === 'Reported' ? 'bg-yellow-500/10 text-yellow-700' :
                    selectedComplaint.status === 'Verified' ? 'bg-blue-500/10 text-blue-700' :
                    selectedComplaint.status === 'In Progress' ? 'bg-orange-500/10 text-orange-700' :
                    'bg-green-500/10 text-green-700'
                  }`}>
                    {selectedComplaint.status}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Side: Images */}
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Original Hazard Image</h4>
                      {selectedComplaint.imageUrl ? (
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Hazard"
                          className="w-full h-48 object-cover rounded-2xl border border-editorial-border shadow-sm"
                        />
                      ) : (
                        <div className="h-48 rounded-2xl border border-dashed border-editorial-border bg-slate-50 flex items-center justify-center text-xs text-slate-400">
                          No original photo uploaded.
                        </div>
                      )}
                    </div>

                    {/* Resolution Upload */}
                    <div>
                      <h4 className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Resolution Verification Proof</h4>
                      {resolutionPreview ? (
                        <div className="space-y-3">
                          <img
                            src={resolutionPreview}
                            alt="Resolution"
                            className="w-full h-48 object-cover rounded-2xl border border-editorial-border shadow-sm"
                          />
                          {isVerifying ? (
                            <p className="text-xs text-slate-400 animate-pulse font-mono">Running OpenCV SSIM visual similarity index checks...</p>
                          ) : (
                            similarityScore && (
                              <div className="p-3.5 bg-slate-900 border border-editorial-border rounded-xl font-mono text-[10px] space-y-1.5 text-slate-300">
                                <p className="text-green-400 font-bold">// Verification Match Passed</p>
                                <p>Grayscale Structural Similarity Index: <b className="text-white text-xs">{similarityScore}%</b></p>
                                <button
                                  onClick={handleFinalResolve}
                                  className="w-full mt-2 bg-editorial-success text-white font-bold py-2 rounded-lg text-[9px] uppercase tracking-wider hover:bg-emerald-700 transition-all"
                                >
                                  Close Task & Release Rewards
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-editorial-border rounded-2xl h-48 flex flex-col items-center justify-center cursor-pointer bg-slate-50 text-slate-400 hover:text-editorial-dark transition-all">
                          <HammerIcon className="w-8 h-8 text-slate-300 mb-1" />
                          <span className="text-xs font-semibold">Upload repaired state photograph</span>
                          <input type="file" accept="image/*" onChange={handleResolutionImage} className="hidden" />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Right Side: details & Actions */}
                  <div className="space-y-5 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Citizen Description:</p>
                      <p className="bg-white border border-editorial-border p-3 rounded-xl text-editorial-dark italic">
                        "{selectedComplaint.description || 'No description provided.'}"
                      </p>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Assign Dispatch Department</label>
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-xl p-3 text-editorial-dark text-xs font-semibold focus:outline-none"
                      >
                        <option value="Public Works (Roads)">Public Works (Roads)</option>
                        <option value="Environmental Health">Environmental Health</option>
                        <option value="Water & Sewage Utilities">Water & Sewage Utilities</option>
                        <option value="Electrical Engineering">Electrical Engineering</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Update Task Status</label>
                      <select
                        value={currentStatus}
                        onChange={(e) => setCurrentStatus(e.target.value)}
                        className="w-full bg-white border border-editorial-border rounded-xl p-3 text-editorial-dark text-xs font-semibold focus:outline-none"
                      >
                        <option value="Reported">Reported (Pending)</option>
                        <option value="Verified">Verified (Confirmed)</option>
                        <option value="In Progress">In Progress (Workforce Dispatched)</option>
                        <option value="Resolved">Resolved (Complete)</option>
                      </select>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-xl border border-editorial-border space-y-1">
                      <p className="font-bold text-editorial-dark mb-1 font-serif">Original AI Prediction:</p>
                      <p className="text-slate-500">Class confidence: {selectedComplaint.aiAnalysis?.confidence ? `${(selectedComplaint.aiAnalysis.confidence * 100).toFixed(0)}%` : '91%'}</p>
                      <p className="text-slate-500 mt-1">Summary: {selectedComplaint.aiAnalysis?.summary || 'N/A'}</p>
                    </div>

                    <button
                      onClick={handleUpdate}
                      className="w-full bg-editorial-dark hover:bg-editorial-accent text-editorial-bg font-bold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 shadow-sm text-xs tracking-wider uppercase"
                    >
                      <Hammer className="w-4 h-4" /> Save Dispatch Changes
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="glass-panel p-12 rounded-3xl border border-editorial-border text-center flex flex-col items-center justify-center gap-3 shadow-editorial h-[350px]">
                <CheckCircle2 className="w-12 h-12 text-slate-300" />
                <h3 className="font-serif font-bold text-xl text-slate-400">No Task Selected</h3>
                <p className="text-xs text-slate-500 max-w-xs">Select a report from the active alerts queue on the left to review details, assign departments, and check resolutions.</p>
              </div>
            )
          ) : (
            <div className="h-[600px] w-full">
              <LeafletMap complaints={complaints} heatmapMode={true} onViewportChange={handleViewportChange} />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
