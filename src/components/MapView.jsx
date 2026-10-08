import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Compass, Eye, ExternalLink, X, AlertTriangle, ShieldCheck, Camera, Layers, MapPin } from 'lucide-react';
import { DEMO_CORRIDOR } from '../data/demoCorridor';
import 'leaflet/dist/leaflet.css';

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
  const [activeInspectLandmark, setActiveInspectLandmark] = useState(null);
  const [viewMode, setViewMode] = useState('satellite'); // 'satellite' or 'photo'

  const defaultCenter = [-1.3250, 36.7850];

  const handleLandmarkClick = (lm) => {
    setFocusedLocation(lm.coords);
    if (onSelectLandmark) onSelectLandmark(lm);
  };

  const handleOpenInspection = (e, lm) => {
    e.stopPropagation();
    setActiveInspectLandmark(lm);
  };

  return (
    <div className="relative w-full h-[620px] lg:h-[660px] rounded-3xl overflow-hidden border-2 border-black shadow-2xl bg-zinc-100 flex flex-col">
      {/* Top Corridor Status Bar */}
      <div className="bg-white border-b-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-[400]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black animate-pulse"></span>
            <span className="text-xs font-mono font-black uppercase text-black">
              Corridor Ground Truth: {DEMO_CORRIDOR.name}
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">
            Naboka Sacco & G-City Sacco live waypoints with High-Res Ground Inspection
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
            Lang'ata Rd Direct
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
                <Polyline
                  positions={rt.coordinates}
                  pathOptions={{
                    color: '#ffffff',
                    weight: rt.weight + 4,
                    opacity: 0.9
                  }}
                />
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
                  <div className="p-1 min-w-[240px] font-sans">
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-black">
                        {lm.type}
                      </span>
                      <span className="text-base">{lm.icon}</span>
                    </div>

                    <h4 className="text-sm font-black text-black mb-1">{lm.name}</h4>
                    <p className="text-xs text-zinc-600 mb-2 leading-relaxed">{lm.hint}</p>

                    <div className="text-[11px] bg-zinc-50 border border-zinc-200 p-2 rounded-lg mb-2">
                      <strong className="text-black block mb-0.5">Physical Visual Cue:</strong>
                      <span className="text-zinc-700">{lm.visual_cue}</span>
                    </div>

                    <button
                      onClick={(e) => handleOpenInspection(e, lm)}
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs border border-black shadow transition active:scale-95"
                    >
                      <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Inspect Ground View</span>
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Floating Controls: Quick Landmark Jump */}
        <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
          <button
            onClick={() => {
              const bomas = DEMO_CORRIDOR.landmarks.find(l => l.id === 'bomas');
              setActiveInspectLandmark(bomas);
            }}
            className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-black shadow-lg transition active:scale-95"
          >
            <Camera className="w-4 h-4 text-black stroke-[2.5]" />
            <span>Ground View (Bomas)</span>
          </button>
        </div>

        {/* Corridor Sacco Comparison Drawer (Bottom-Left) */}
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
                className="p-2.5 rounded-xl border border-zinc-300 bg-zinc-50"
              >
                <span className="font-black text-black text-xs block mb-0.5">{sacco.name}</span>
                <div className="text-[10px] text-zinc-600 font-semibold mb-1 truncate">
                  {sacco.tagline}
                </div>
                <div className="text-[11px] font-mono font-bold text-black bg-yellow-400/30 px-1.5 py-0.5 rounded border border-yellow-400">
                  Peak: {sacco.peak_ceiling}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ground Inspection Modal */}
      {activeInspectLandmark && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{activeInspectLandmark.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-yellow-400 text-black">
                      GROUND INSPECTION
                    </span>
                    <span className="text-xs text-zinc-300 font-bold">{activeInspectLandmark.type}</span>
                  </div>
                  <h3 className="text-base font-black text-white">{activeInspectLandmark.name}</h3>
                </div>
              </div>
              <button
                onClick={() => setActiveInspectLandmark(null)}
                className="p-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Tabs */}
            <div className="bg-zinc-100 border-b border-zinc-300 px-4 py-2 flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-zinc-600">
                Coords: {activeInspectLandmark.map_query}
              </span>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setViewMode('satellite')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'satellite' ? 'bg-black text-yellow-400' : 'bg-white text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  High-Res Ground Map
                </button>
                <button
                  onClick={() => setViewMode('photo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                    viewMode === 'photo' ? 'bg-black text-yellow-400' : 'bg-white text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  Waypoint Snapshot
                </button>
              </div>
            </div>

            {/* Visual Panel */}
            <div className="relative w-full h-[320px] sm:h-[380px] bg-zinc-900">
              {viewMode === 'satellite' ? (
                <iframe
                  title={`Ground View for ${activeInspectLandmark.name}`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://maps.google.com/maps?q=${activeInspectLandmark.map_query}&t=k&z=17&ie=UTF8&iwloc=&output=embed`}
                />
              ) : (
                <div className="w-full h-full relative">
                  <img
                    src={activeInspectLandmark.image_url}
                    alt={activeInspectLandmark.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-white text-xs font-bold">
                      {activeInspectLandmark.visual_cue}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Ground Truth Safety Cues */}
            <div className="p-4 sm:p-5 bg-zinc-50 border-t-2 border-black flex flex-col gap-3">
              <div className="flex items-start gap-3">
                {activeInspectLandmark.id === 'cemetery' ? (
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5 stroke-[2.5]" />
                ) : (
                  <ShieldCheck className="w-5 h-5 text-black shrink-0 mt-0.5 stroke-[2.5]" />
                )}
                <div>
                  <h4 className="text-xs font-black text-black uppercase tracking-wider">
                    Physical Ground Cue:
                  </h4>
                  <p className="text-xs text-zinc-700 font-bold mt-0.5">
                    {activeInspectLandmark.visual_cue}
                  </p>
                  <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                    {activeInspectLandmark.hint}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 pt-3 border-t border-zinc-200">
                <a
                  href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${activeInspectLandmark.map_query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-zinc-700 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open 360° Street View in Google Maps</span>
                </a>

                <button
                  onClick={() => setActiveInspectLandmark(null)}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-yellow-400 font-black text-xs transition"
                >
                  Back to Route Map
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
