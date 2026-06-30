'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Copy, Check } from 'lucide-react';

const MARKDOWN_CONTENT = `# Hackathon Submission: CommunityHero AI Platform
**Tagline**: *Transforming Neighborhoods Through Real-Time AI, Civic Collaboration, and Transparent Community Action.*

---

## 1. Project Overview

### The Problem
Municipal infrastructure management is notoriously slow, non-transparent, and disconnected from the everyday experiences of citizens. When local hazards—such as dangerous potholes, overflowing garbage containers, sewage leaks, or broken streetlights—go unreported, they lead to safety risks, environmental degradation, and neighborhood decline. Traditional reporting portals are cumbersome, lack user engagement, and provide no real-time progress indicators, resulting in low resident participation.

### The Solution: CommunityHero AI
CommunityHero AI turns city operations into an **intelligent civic operating system**. It is a modern full-stack platform that empowers citizens to act as "first responders" for their communities. 
* **Snap & Analyze**: Citizens upload a photo of a hazard. An AI Computer Vision engine (YOLOv8) automatically identifies the category, confidence rate, and severity level.
* **Neighborhood Verification**: To prevent spam and abuse, nearby residents verify reports on an interactive map. Once a verification threshold is met, the issue is promoted to the authorities.
* **Workforce Dispatch**: Public works authorities receive auto-prioritized queues, assign teams, and dispatch repairs.
* **Closed-Loop AI Verification**: Authorities upload a photo of the completed repair. The system uses OpenCV visual similarity checks (SSIM) to confirm the hazard is cleared before updating status to "Resolved" and releasing citizen rewards.
* **Gamified Engagement**: Users earn Hero Points and unlock persistent profile achievements ("Civic Initiator", "Community Hero") to incentivize active neighborhood improvement.

---

## 2. Technical Architecture & Tech Stack

The platform is designed as a modular monorepo consisting of three independent, highly-optimized services:

1. **Frontend UI (Next.js 14 App Router)**:
   * Styled with a premium, luxury editorial color system (warm cream backgrounds, charcoal text, and cyan highlights).
   * Fully responsive, mobile-first design utilizing Tailwind CSS and Framer Motion microinteractions.
   * Leverages Leaflet Maps for live, boundaries-based viewport issue populating.
   * State managed via lightweight Zustand stores.
2. **Backend Gateway (Express Node.js)**:
   * Controls REST routing, JWT authentication, and MongoDB queries.
   * Employs MongoDB \`2dsphere\` indexes to execute spatial queries (radius searches) for nearby hazards.
   * Manages duplex Socket.IO WebSockets to push real-time alerts across active clients.
3. **AI Microservice (FastAPI + Python 3.10)**:
   * runs YOLOv8 object detection modules for instant class scoring.
   * Implements custom grayscale preprocessing and OpenCV Structural Similarity Index (SSIM) checks for before/after resolution checks.
   * NLP parsing engine filters description texts to auto-escalate priority zones (e.g. school districts or hospital lanes).

---

## 3. Core Innovation Points

* **YOLOv8 Computer Vision**: Moves civic reporting away from manual entry to instant, AI-assisted telemetry.
* **Spam-Resistant Verification**: Coordinates upvoting rules ensure only real, citizen-validated issues reach municipal queues, saving city dispatch budgets.
* **Closed-Loop Resolution Audit**: The before/after image similarity matching ensures that issues cannot be marked "Resolved" by contractors or workers without visual proof of repair.
* **Global Location Support**: Integrated OpenStreetMap Nominatim APIs allow users to search and pan the map to any street worldwide, automatically generating dynamic viewport mock metrics.
`;

export default function ProjectDescriptionPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MARKDOWN_CONTENT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto font-sans select-none">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-editorial-accent hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-editorial-border pb-6">
        <div>
          <h1 className="text-3xl font-serif text-editorial-dark">Project Document</h1>
          <p className="text-sm text-slate-500 mt-1">Copy and paste this document directly into your Google Docs workspace.</p>
        </div>
        <button
          onClick={handleCopy}
          className="glow-btn px-5 py-2.5 rounded-full text-editorial-bg text-xs font-bold uppercase tracking-wider flex items-center gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-green-400" /> Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" /> Copy Markdown
            </>
          )}
        </button>
      </div>

      {/* Document Content Render */}
      <div className="glass-panel p-8 rounded-3xl border border-editorial-border shadow-editorial prose prose-slate max-w-none text-left">
        <h2 className="text-2xl font-serif font-bold text-editorial-dark border-b border-editorial-border pb-2">
          Hackathon Submission: CommunityHero AI Platform
        </h2>
        <p className="text-xs text-editorial-accent font-bold uppercase mt-2">
          Tagline: Transforming Neighborhoods Through Real-Time AI, Civic Action, and Collaboration.
        </p>

        <h3 className="text-lg font-serif font-bold text-editorial-dark mt-6">1. Project Overview</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          Municipal infrastructure management is notoriously slow, non-transparent, and disconnected from the everyday experiences of citizens. When local hazards—such as dangerous potholes, overflowing garbage containers, sewage leaks, or broken streetlights—go unreported, they lead to safety risks, environmental degradation, and neighborhood decline.
        </p>

        <h4 className="font-bold text-xs text-editorial-dark mt-4">The Solution: CommunityHero AI</h4>
        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
          CommunityHero AI turns city operations into an intelligent civic operating system. It is a full-stack platform that empowers citizens to act as "first responders". YOLOv8 models analyze inputs, local coordinates are verified by neighbors to prevent spam, and public authorities manage dispatches and verify repairs using before/after visual similarity checks.
        </p>

        <h3 className="text-lg font-serif font-bold text-editorial-dark mt-6">2. Technical Architecture & Tech Stack</h3>
        <ul className="list-disc pl-5 text-xs text-slate-500 space-y-2 mt-2">
          <li><strong>Next.js Client (Frontend)</strong>: Editorial design system tokens, Leaflet Map tracking, and Zustand global stores.</li>
          <li><strong>Express Gateway (Backend)</strong>: Rest API endpoints, JWT authentication rules, MongoDB 2dsphere indexes, and real-time Socket.IO alerts.</li>
          <li><strong>FastAPI Service (AI Engine)</strong>: Python computer vision (YOLOv8) and OpenCV Structural Similarity (SSIM) check logic.</li>
        </ul>

        <h3 className="text-lg font-serif font-bold text-editorial-dark mt-6">3. Key Core Innovation Points</h3>
        <p className="text-xs text-slate-500 mt-2 leading-relaxed">
          The platform moves civic reporting away from manual entry to instant, AI-assisted telemetry. Spam-resistant verification rules ensure only real, citizen-validated issues reach municipal queues, saving city dispatch budgets.
        </p>
      </div>
    </div>
  );
}
