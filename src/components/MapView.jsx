import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, MapPin, Eye, Compass, Layers } from 'lucide-react';
import { DEMO_CORRIDOR } from '../data/demoCorridor';
import 'leaflet/dist/leaflet.css';

// Custom Landmark Icon
const createLandmarkIcon = (emoji, label, isCaution = false) => {
  const bg = isCaution ? '#000000' : '#ffffff';
  const text = isCaution ? '#facc15' : '#000000';
  const border = '#000000';

  return L.divIcon({
    className: 'custom-landmark-pin',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:${bg}; color:${text}; border:2px solid ${border}; border-radius:8px; padding:3px 7px; font-weight:800; font-size:11px; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.25); display:flex; align-items:center; gap:4px;">
          <span style="font-size:12px;">${emoji}</span>
          <span style="font-family:ui-monospace, monospace;">${label}</span>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #000000;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

function MapController({ targetCenter, targetZoom }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (targetCenter) {
      map.flyTo(targetCenter, targetZoom || 14, { duration: 1.0 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

export default function MapView({ onSelectLandmark }) {
  const [selectedRouteId, setSelectedRouteId] = useState('all');
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [selectedSacco, setSelectedSacco] = useState(null);

  const defaultCenter = [-1.3250, 36.7850]; // Center around Langata corridor

  const handleLandmarkClick = (lm) => {
    setFocusedLocation(lm.coords);
    if (onSelectLandmark) onSelectLandmark(lm);
  };

  const handleLocateMe = () => {
    // Default to Bomas landmark for demoway wayfinding demonstration
    setFocusedLocation([-1.3392, 36.7698]);
  };

  return (
    <div className="relative w-full h-[600px] lg:h-[640px] rounded-3xl overflow-hidden border-2 border-black shadow-2xl bg-zinc-100 flex flex-col">
      {/* Top Corridor Status Bar */}
      <div className="bg-white border-b-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-[400]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black animate-pulse"></span>
            <span className="text-xs font-mono font-black uppercase text-black">
              Demo Corridor: {DEMO_CORRIDOR.name}
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">
            Operating SACCOs: <strong>Naboka Sacco</strong> (CUK/Railways) & <strong>G-City</strong> (Karen/Ambassador)
          </p>
        </div>

        {/* Route Variant Filter */}
        <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-xl border border-zinc-300 text-xs font-bold">
          <button
            onClick={() => setSelectedRouteId('all')}
            className={`px-2.5 py-1 rounded-lg transition ${
              selectedRouteId === 'all' ? 'bg-black text-yellow-400 font-black' : 'text-zinc-700 hover:text-black'
            }`}
          >
            All Corridors
          </button>
          <button
            onClick={() => setSelectedRouteId('main')}
            className={`px-2.5 py-1 rounded-lg transition ${
              selectedRouteId === 'main' ? 'bg-black text-yellow-400 font-black' : 'text-zinc-700 hover:text-black'
            }`}
          >
            Lang'ata Rd (Direct)
          </button>
          <button
            onClick={() => setSelectedRouteId('diversion')}
            className={`px-2.5 py-1 rounded-lg transition ${
              selectedRouteId === 'diversion' ? 'bg-black text-yellow-400 font-black' : 'text-zinc-700 hover:text-black'
            }`}
          >
            Mbagathi Bypass
          </button>
        </div>
      </div>

      {/* Map Body */}
      <div className="relative flex-1 w-full h-full">
        <MapContainer
          center={defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
          className="w-full h-full z-10"
        >
          <MapController targetCenter={focusedLocation || defaultCenter} targetZoom={focusedLocation ? 15 : 13} />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Render Route Polylines */}
          {DEMO_CORRIDOR.routes.map((rt) => {
            if (selectedRouteId !== 'all' && selectedRouteId !== rt.id) return null;

            return (
              <React.Fragment key={rt.id}>
                {/* Outliner stroke */}
                <Polyline
                  positions={rt.coordinates}
                  pathOptions={{
                    color: '#ffffff',
                    weight: rt.weight + 4,
                    opacity: 0.9
                  }}
                />
                {/* Main line */}
                <Polyline
                  positions={rt.coordinates}
                  pathOptions={{
                    color: rt.color,
                    weight: rt.weight,
                    dashArray: rt.dashArray
                  }}
                >
                  <Tooltip sticky direction="top" className="font-mono text-xs font-bold">
                    {rt.name}
                  </Tooltip>
                </Polyline>
              </React.Fragment>
            );
          })}

          {/* Render Landmarks & Waypoints */}
          {DEMO_CORRIDOR.landmarks.map((lm) => {
            const isCaution = lm.id === 'cemetery';
            return (
              <Marker
                key={lm.id}
                position={lm.coords}
                icon={createLandmarkIcon(lm.icon, lm.name.split(' ')[0], isCaution)}
                eventHandlers={{ click: () => handleLandmarkClick(lm) }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px] font-sans">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-black">
                        {lm.type}
                      </span>
                      <span className="text-base">{lm.icon}</span>
                    </div>
                    <h4 className="text-sm font-black text-black mb-1">{lm.name}</h4>
                    <p className="text-xs text-zinc-600 mb-2 leading-relaxed">{lm.hint}</p>
                    <div className="text-[11px] bg-yellow-50 border border-yellow-300 p-2 rounded-lg font-bold text-black">
                      Wayfinding Indicator: Matches Naboka & G-City transit tracking.
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Controls: Locate Me */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <button
            onClick={handleLocateMe}
            className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-black shadow-lg transition active:scale-95"
            title="Locate demo at Bomas landmark"
          >
            <Compass className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Test Waypoint (Bomas)</span>
          </button>
        </div>

        {/* Sacco Comparison Overlay Card (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-[400] max-w-sm w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-3.5 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black tracking-wider uppercase bg-black text-yellow-400 px-2 py-0.5 rounded-md">
              Corridor Operators
            </span>
            <span className="text-[10px] text-zinc-500 font-bold">CUK ➔ Nairobi CBD</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {DEMO_CORRIDOR.saccos.map((sacco) => (
              <div
                key={sacco.id}
                onClick={() => setSelectedSacco(sacco)}
                className="cursor-pointer p-2.5 rounded-xl border border-zinc-300 hover:border-black bg-zinc-50 transition"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-black text-black text-xs">{sacco.name}</span>
                </div>
                <div className="text-[11px] text-zinc-600 font-semibold mb-1 truncate">
                  {sacco.tagline}
                </div>
                <div className="text-[11px] font-mono font-bold text-black bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400">
                  Peak: {sacco.peak_ceiling}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-2.5 pt-2 border-t border-zinc-200 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-black">
              <span className="w-4 h-1 bg-black inline-block rounded"></span>
              Direct Lang'ata Rd
            </span>
            <span className="flex items-center gap-1.5 font-bold text-zinc-800">
              <span className="w-4 h-0.5 border-t-2 border-dashed border-yellow-500 inline-block"></span>
              Mbagathi Bypass
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
