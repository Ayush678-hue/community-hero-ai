'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { Navigation, Search, Loader2, AlertCircle } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap({ complaints = [], heatmapMode = false, onViewportChange }) {
  const { userCoords, setUserCoords, locationAccuracy, setLocationAccuracy } = useStore();
  const [L, setL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [geoError, setGeoError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  
  const mapRef = useRef(null);
  const userMarkerRef = useRef(null);
  const accuracyCircleRef = useRef(null);
  const watchIdRef = useRef(null);
  const circlesRef = useRef([]);
  const markersRef = useRef([]);

  
  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet.default);
      
      delete leaflet.default.Icon.Default.prototype._getIconUrl;
      leaflet.default.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
    });

    return () => {
      if (watchIdRef.current && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  
  const startWatchingLocation = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      setUserCoords([0, 0]); 
      return;
    }

    setLoading(true);
    setGeoError(null);

    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = [position.coords.latitude, position.coords.longitude];
        setUserCoords(coords);
        setLocationAccuracy(position.coords.accuracy);
        setLoading(false);
      },
      (error) => {
        console.warn('⚠️ Geolocation error:', error.message);
        setGeoError(`GPS Offline: ${error.message}. Fallback to dynamic search.`);
        setLoading(false);
        
        if (!userCoords) {
          setUserCoords([0, 0]);
        }
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 15000
      }
    );

    watchIdRef.current = watchId;
  };

  useEffect(() => {
    if (!userCoords && L) {
      startWatchingLocation();
    }
  }, [userCoords, L]);

  
  useEffect(() => {
    if (!L || mapRef.current) return;

    const initialCenter = userCoords || [0, 0];

    const container = L.DomUtil.get('leaflet-map-element');
    if (container) {
      container._leaflet_id = null;
    }

    const map = L.map('leaflet-map-element', {
      center: initialCenter,
      zoom: userCoords ? 14 : 2, 
      zoomControl: false,
    });
    
    mapRef.current = map;

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CartoDB',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    
    const triggerViewportCallback = () => {
      if (onViewportChange && mapRef.current) {
        const bounds = mapRef.current.getBounds();
        const center = mapRef.current.getCenter();
        onViewportChange(bounds, [center.lat, center.lng]);
      }
    };

    map.on('moveend', triggerViewportCallback);
    map.on('zoomend', triggerViewportCallback);

    
    setTimeout(triggerViewportCallback, 500);

    
    const pulseIcon = L.divIcon({
      className: 'custom-pulse-marker',
      html: `<div class="relative w-6 h-6 flex items-center justify-center">
               <div class="absolute w-6 h-6 bg-blue-500 rounded-full opacity-35 animate-ping"></div>
               <div class="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-glow"></div>
             </div>`,
      iconSize: [24, 24],
    });
    userMarkerRef.current = L.marker(initialCenter, { icon: pulseIcon }).addTo(map)
      .bindPopup('<b class="text-blue-400">Your Current Position</b><br/>Global geotracking active.');

    return () => {
      if (mapRef.current) {
        mapRef.current.off('moveend');
        mapRef.current.off('zoomend');
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [L]);

  
  useEffect(() => {
    if (!L || !mapRef.current || !userCoords) return;

    mapRef.current.flyTo(userCoords, mapRef.current.getZoom() < 8 ? 14 : mapRef.current.getZoom(), {
      animate: true,
      duration: 1.5
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(userCoords);
    }

    
    if (accuracyCircleRef.current) {
      mapRef.current.removeLayer(accuracyCircleRef.current);
    }

    accuracyCircleRef.current = L.circle(userCoords, {
      radius: locationAccuracy || 25,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.1,
      weight: 1
    }).addTo(mapRef.current);
  }, [L, userCoords, locationAccuracy]);

  
  useEffect(() => {
    if (!L || !mapRef.current) return;

    circlesRef.current.forEach(c => mapRef.current.removeLayer(c));
    markersRef.current.forEach(m => mapRef.current.removeLayer(m));
    circlesRef.current = [];
    markersRef.current = [];

    if (heatmapMode) {
      complaints.forEach((comp) => {
        const coords = comp.location?.coordinates || [0, 0];
        const lat = coords[1];
        const lng = coords[0];

        if (lat && lng) {
          let color = '#3498db';
          if (comp.severity === 'Medium') color = '#f39c12';
          if (comp.severity === 'High') color = '#e67e22';
          if (comp.severity === 'Critical') color = '#ff3366';

          const circle = L.circle([lat, lng], {
            color: color,
            fillColor: color,
            fillOpacity: 0.28,
            radius: 180,
            weight: 1
          }).addTo(mapRef.current).bindPopup(`
            <div style="font-family: var(--font-sans); padding: 5px;">
              <strong style="color: ${color};">${comp.issueType}</strong><br/>
              <span>Severity: ${comp.severity}</span><br/>
              <span>Status: ${comp.status}</span>
            </div>
          `);
          circlesRef.current.push(circle);
        }
      });
    } else {
      complaints.forEach((comp) => {
        const coords = comp.location?.coordinates || [0, 0];
        const lat = coords[1];
        const lng = coords[0];

        if (lat && lng) {
          let severityColor = 'bg-cyber-accent border-cyber-accent';
          if (comp.severity === 'Medium') severityColor = 'bg-yellow-500 border-yellow-500';
          if (comp.severity === 'High') severityColor = 'bg-orange-500 border-orange-500';
          if (comp.severity === 'Critical') severityColor = 'bg-cyber-danger border-cyber-danger';

          const pinIcon = L.divIcon({
            className: 'custom-pin-marker',
            html: `<div class="relative w-8 h-8 flex items-center justify-center">
                     <div class="absolute w-8 h-8 ${severityColor} rounded-full opacity-20 animate-pulse"></div>
                     <div class="w-4 h-4 ${severityColor} rounded-full border border-white shadow-lg"></div>
                   </div>`,
            iconSize: [32, 32],
          });

          const popupContent = `
            <div style="font-family: var(--font-sans); color: #fff; min-width: 190px;">
              <h4 style="margin: 0 0 5px; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 3px;">
                ${comp.issueType}
              </h4>
              <p style="margin: 0 0 8px; font-size: 11px; color: #cbd5e1;">${comp.description || 'No description'}</p>
              <div style="display: flex; justify-between; font-size: 10px; margin-bottom: 8px;">
                <span style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">
                  ${comp.status}
                </span>
                <span style="background: rgba(255,51,102,0.15); color: #ff3366; padding: 2px 6px; border-radius: 4px; font-weight: bold; margin-left: 5px;">
                  ${comp.severity}
                </span>
              </div>
              ${comp.imageUrl ? `<img src="${comp.imageUrl}" style="width:100%; border-radius:6px; margin-bottom:4px; max-height:85px; object-fit:cover;" />` : ''}
            </div>
          `;

          const marker = L.marker([lat, lng], { icon: pinIcon })
            .addTo(mapRef.current)
            .bindPopup(popupContent);
            
          markersRef.current.push(marker);
        }
      });
    }
  }, [L, complaints, heatmapMode]);

  
  const handleGeocodeSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setGeoError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const firstMatch = data[0];
        const lat = parseFloat(firstMatch.lat);
        const lng = parseFloat(firstMatch.lon);
        
        
        setUserCoords([lat, lng]);
        setLocationAccuracy(null); 
      } else {
        setGeoError('No location matches found. Please try another search query.');
      }
    } catch (err) {
      console.error(err);
      setGeoError('Network error checking geocoding index.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-cyber-border/60 shadow-inner">
      <div id="leaflet-map-element" className="w-full h-full min-h-[400px]"></div>
      
      {}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
        <div className="bg-slate-950/85 px-4 py-2 rounded-xl border border-cyber-border/70 backdrop-blur-md">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyber-accent glow-text-cyan">
            {heatmapMode ? 'AI Hotspot Density Map' : 'Real-Time Civic Map'}
          </span>
        </div>

        {userCoords && (
          <div className="bg-slate-950/85 px-3 py-1.5 rounded-lg border border-cyber-border/40 backdrop-blur-sm text-[10px] text-slate-400 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${locationAccuracy && locationAccuracy < 40 ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            <span>
              {locationAccuracy ? `GPS Tracker: ±${locationAccuracy.toFixed(1)}m` : 'Searched Coordinates'}
            </span>
          </div>
        )}
      </div>

      {}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2 max-w-[80%] sm:max-w-xs">
        <form onSubmit={handleGeocodeSearch} className="flex bg-slate-950/90 border border-cyber-border/80 rounded-xl p-1.5 backdrop-blur-md shadow-lg w-full">
          <input
            type="text"
            placeholder="Search city, street or country..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs text-white border-0 outline-none px-2 py-1.5 w-full placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={searching}
            className="bg-cyber-primary hover:bg-cyber-primary/95 text-white p-1.5 rounded-lg flex items-center justify-center transition-all min-w-[28px]"
          >
            {searching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Search className="w-3.5 h-3.5" />
            )}
          </button>
        </form>

        {}
        <button
          onClick={startWatchingLocation}
          disabled={loading}
          className="bg-slate-950/95 border border-cyber-border hover:border-cyber-accent/80 hover:text-cyber-accent p-3 rounded-xl transition-all shadow-glow hover:shadow-2xl flex items-center justify-center text-white self-end"
          title="Track Location Live (watchPosition)"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin text-cyber-accent" />
          ) : (
            <Navigation className="w-4 h-4 text-blue-400" />
          )}
        </button>
      </div>

      {}
      {geoError && (
        <div className="absolute bottom-4 left-4 right-16 z-[400] bg-cyber-danger/10 border border-cyber-danger/30 p-2.5 rounded-xl backdrop-blur-md text-[11px] text-cyber-danger flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-cyber-danger flex-shrink-0" />
          <span>{geoError}</span>
        </div>
      )}
    </div>
  );
}
