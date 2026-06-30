'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Map, Search, Radio, Wifi } from 'lucide-react';

export default function LiveViewportRenderingPage() {
  return (
    <div className="space-y-8 py-10 max-w-4xl mx-auto font-sans select-none">
      {/* Back button */}
      <Link href="/" className="inline-flex items-center gap-2 text-xs font-semibold text-editorial-accent hover:underline">
        <ArrowLeft className="w-4 h-4" /> Back to Terminal Hub
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 border-b border-editorial-border pb-6">
        <div className="w-14 h-14 rounded-2xl bg-editorial-dark flex items-center justify-center shadow-lg">
          <Map className="w-6 h-6 text-editorial-bg" />
        </div>
        <div>
          <h1 className="text-3xl md:text-5xl font-serif text-editorial-dark">Live Viewport Rendering</h1>
          <p className="text-sm text-slate-500 mt-1">Global Geocoding & High-Frequency GPS Tracking Engine</p>
        </div>
      </div>

      {/* Deep-dive content */}
      <div className="grid md:grid-cols-12 gap-8">
        
        {/* Left main text column */}
        <div className="md:col-span-8 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Radio className="w-5 h-5 text-editorial-accent" />
              1. Continuous GPS Tracking (watchPosition)
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              Unlike static maps that check user coordinates once, Community Hero AI employs high-frequency geotracking. The browser's Geolocation API watches position telemetry continuously. If the citizen moves, coordinates and GPS accuracy radius parameters sync immediately, prompting smooth animated map transitions.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Search className="w-5 h-5 text-editorial-accent" />
              2. OpenStreetMap Nominatim Geocoding
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              To support global problem tracking, the search HUD accesses OpenStreetMap's Nominatim geocoding index. Input queries (cities, streets, or landmarks) are translated into latitude and longitude values dynamically, relocating the Leaflet map center to that region instantly.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-editorial-border space-y-4 shadow-editorial">
            <h2 className="text-xl font-serif font-bold text-editorial-dark flex items-center gap-2">
              <Wifi className="w-5 h-5 text-editorial-alert" />
              3. Viewport-Based Complaint Loading & Sockets
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              As the user pans the map, a viewport boundary listener fetches current map boundaries (`map.getBounds()`). Mock issues and heatmaps re-generate inside those exact coordinates instantly, simulating live neighborhood reports anywhere in the world. When a real issue is filed, Socket.IO broadcasts a WebSockets event to sync all maps.
            </p>
          </div>
        </div>

        {/* Right HUD column */}
        <div className="md:col-span-4 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-editorial-border bg-slate-50 font-mono text-[9px] space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2 text-editorial-accent font-bold">
              <span>📡 geolocation_watch_config</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p className="text-slate-400">// Continuous geotracking params</p>
              <p>enableHighAccuracy: true</p>
              <p>maximumAge: 0</p>
              <p>timeout: 15000</p>
              <p className="text-editorial-accent font-bold mt-2">Status: POLLING_GPS_ACTIVE</p>
            </div>
          </div>

          <div className="glass-panel p-5 rounded-2xl border border-editorial-border bg-slate-50 font-mono text-[9px] space-y-3">
            <div className="flex items-center justify-between border-b border-editorial-border pb-2 text-editorial-alert font-bold">
              <span>🔌 socket_io_payload</span>
            </div>
            <div className="space-y-1 text-slate-500">
              <p className="text-slate-400">// WebSockets event emit</p>
              <p>io.emit('new_complaint', &#123;</p>
              <p className="pl-3">id: "complaint_101",</p>
              <p className="pl-3">coords: [37.7799, -122.4194],</p>
              <p className="pl-3">severity: "Critical"</p>
              <p>&#125;)</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
