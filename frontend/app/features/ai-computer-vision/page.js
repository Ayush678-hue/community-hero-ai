'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Brain, Cpu, ShieldAlert, Eye } from 'lucide-react';

export default function AIComputerVisionPage() {
  return (
    <div className="space-y-8 py-10 max-w-4xl mx-auto font-sans select-none">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-editorial-accent hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Terminal Hub
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-editorial-border pb-6">
        <div className="w-14 h-14 rounded-2xl bg-editorial-dark flex items-center justify-center shadow-lg">
          <Brain className="w-6 h-6 text-editorial-bg" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-editorial-dark">AI Computer Vision</h1>
          <p className="text-sm text-slate-500 mt-1">Autonomous Object Detection & Repaired State Verification Pipeline</p>
        </div>
      </div>

      {/* Deep-dive content */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left main text column */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Cpu className="w-5 h-5 text-editorial-accent" />
              1. YOLOv8 Object Detection Engine
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              When a citizen uploads a photograph, the file is pushed directly to the FastAPI AI microservice where a pretrained YOLOv8 (You Only Look Once) deep learning model processes the image matrix. Bounding boxes are generated to identify five core civic hazard classes:
            </p>
            <ul className="grid grid-cols-2 gap-3 text-[10px] font-bold text-slate-500">
              <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-editorial-border">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Potholes & Cracks
              </li>
              <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-editorial-border">
                <span className="w-2 h-2 rounded-full bg-yellow-500"></span> Garbage Overflow
              </li>
              <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-editorial-border">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Water Leakages
              </li>
              <li className="flex items-center gap-2 bg-white/70 p-2.5 rounded-xl border border-editorial-border">
                <span className="w-2 h-2 rounded-full bg-purple-500"></span> Streetlight Damages
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-editorial-alert" />
              2. Smart Severity & Urgency Engine
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              In addition to visual bounding boxes, the platform integrates keyword-based NLP parsing and proximity analysis to determine hazard urgency. Descriptions containing priority keywords like <b className="text-editorial-dark font-bold">"school zone"</b>, <b className="text-editorial-dark font-bold">"hospital crossing"</b>, or <b className="text-editorial-dark font-bold">"exposed hazard"</b> boost priority rankings dynamically to <span className="text-editorial-alert font-bold">Critical</span>.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Eye className="w-5 h-5 text-editorial-success" />
              3. Before/After Visual Restoration Check
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              To close complaints transparently, authorities must upload an image showing the resolved repair. The AI comparisons engine performs a Structural Similarity Index (SSIM) check in grayscale using OpenCV. If the visual structure shows the problem is cleared, the system verifies and releases citizen rewards.
            </p>
          </div>
        </div>

        {/* Right HUD column */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-editorial-border bg-slate-50 font-mono text-[9px] space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2 text-editorial-accent font-bold">
              <span>🤖 yolo_model_inference</span>
              <span className="w-1.5 h-1.5 bg-editorial-accent rounded-full animate-pulse"></span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p className="text-slate-400">// Tensor dimensions: 640x640</p>
              <p>image = cv2.imread(img_path)</p>
              <p>results = yolo_model.predict(image)</p>
              <p className="mt-2 text-red-700 font-bold">Pothole: 94.2% conf</p>
              <p className="text-slate-400">box: [120, 230, 200, 280]</p>
              <p className="text-yellow-600 mt-2 font-bold">StreetlightDamage: 88.5% conf</p>
              <p className="text-slate-400">box: [410, 80, 480, 150]</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-editorial-border bg-slate-50 font-mono text-[9px] space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2 text-editorial-success font-bold">
              <span>🔍 opencv_ssim_verify</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p className="text-slate-400">// SSIM comparison score</p>
              <p>score = structural_similarity(img1, img2)</p>
              <p className="mt-2">Output score: <span className="text-editorial-success font-bold">0.89</span></p>
              <p className="text-[8px] text-slate-400">Status: REPAIR_VALIDATED</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
