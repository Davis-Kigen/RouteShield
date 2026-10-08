import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Compass, 
  Camera, 
  Play, 
  Pause, 
  RotateCcw, 
  AlertTriangle, 
  ShieldCheck, 
  Bus, 
  CheckCircle2, 
  ExternalLink, 
  X,
  Navigation
} from 'lucide-react';
import { DEMO_CORRIDOR } from '../data/demoCorridor';
import 'leaflet/dist/leaflet.css';

// Custom Landmark Pin
const createLandmarkIcon = (emoji, label, isCaution = false) => {
  const bg = isCaution ? '#000000' : '#ffffff';
  const text = isCaution ? '#facc15' : '#000000';

  return L.divIcon({
    className: 'custom-landmark-pin',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:${bg}; color:${text}; border:2px solid #000000; border-radius:8px; padding:3px 7px; font-weight:800; font-size:11px; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.25); display:flex; align-items:center; gap:4px;">
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

// Animated Matatu Pin
const createMatatuIcon = (saccoName) => {
  return L.divIcon({
    className: 'custom-matatu-pin',
    html: `
      <div style="position:relative; display:flex; align-items:center; justify-content:center; transform: translate(-50%, -50%);">
        <div style="position:absolute; width:44px; height:44px; background:rgba(250,204,21,0.4); border-radius:50%; animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
        <div style="position:relative; background:#facc15; border:2px solid #000000; color:#000000; width:34px; height:34px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; box-shadow:0 6px 16px rgba(0,0,0,0.4);">
          🚐
        </div>
        <div style="position:absolute; top:-22px; background:#000000; color:#facc15; font-size:10px; font-weight:900; padding:2px 6px; border-radius:4px; border:1px solid #facc15; white-space:nowrap;">
          ${saccoName}
        </div>
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
      map.flyTo(targetCenter, targetZoom || 14, { duration: 0.8 });
    }
  }, [targetCenter, targetZoom, map]);
  return null;
}

export default function MapView({ onSelectLandmark }) {
  const [selectedRouteId, setSelectedRouteId] = useState('main');
  const [activeInspectLandmark, setActiveInspectLandmark] = useState(null);
  const [viewMode, setViewMode] = useState('photo');

  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStepIndex, setSimStepIndex] = useState(0);
  const [activeSacco, setActiveSacco] = useState('Naboka Sacco');
  const [simAlert, setSimAlert] = useState(null);

  const defaultCenter = [-1.3250, 36.7850];

  const currentRouteData = DEMO_CORRIDOR.routes.find(r => r.id === selectedRouteId) || DEMO_CORRIDOR.routes[0];
  const routePoints = currentRouteData.coordinates;

  // Real-time waypoint notifications along the path
  const stepFeedback = [
    {
      step: 0,
      title: "Boarding at CUK Main Gate",
      desc: "Naboka Sacco 33-seater boarded. Regulated fare locked: KES 70.",
      alertType: "info"
    },
    {
      step: 1,
      title: "Passing Galleria Junction",
      desc: "Smooth traffic flow towards Bomas dual carriageway.",
      alertType: "info"
    },
    {
      step: 2,
      title: "Landmark Verified: Bomas of Kenya",
      desc: "Wayfinding confirmed: Matatu is strictly adhering to Lang'ata Road spine.",
      alertType: "success"
    },
    {
      step: 4,
      title: "CAUTION ZONE: Lang'ata Cemetery",
      desc: "Unlit stretch detected. Commuter guidance: remain seated, doors secure, avoid shoulder alighting.",
      alertType: "warning"
    },
    {
      step: 6,
      title: "Decision Node: T-Mall / Mbagathi",
      desc: "Driver confirms standard Lang'ata route towards Nyayo (No detour necessary).",
      alertType: "info"
    },
    {
      step: 7,
      title: "Approaching Nyayo Roundabout",
      desc: "Entering high-mast floodlit CBD perimeter. Round-the-clock traffic surveillance.",
      alertType: "info"
    },
    {
      step: 9,
      title: "Arrival: Railways Bus Terminal",
      desc: "Lit Safe Haven reached. Direct link to Kenya Railways Police Post & illuminated walkway.",
      alertType: "success"
    }
  ];

  // Simulation timer tick
  useEffect(() => {
    let interval = null;
    if (isSimulating) {
      interval = setInterval(() => {
        setSimStepIndex((prevIndex) => {
          if (prevIndex >= routePoints.length - 1) {
            setIsSimulating(false);
            return prevIndex;
          }
          const nextIndex = prevIndex + 1;
          const match = stepFeedback.find(s => s.step === nextIndex);
          if (match) {
            setSimAlert(match);
          }
          return nextIndex;
        });
      }, 1600);
    }
    return () => clearInterval(interval);
  }, [isSimulating, routePoints.length]);

  const handleStartSim = () => {
    if (simStepIndex >= routePoints.length - 1) {
      setSimStepIndex(0);
      setSimAlert(stepFeedback[0]);
    }
    setIsSimulating(true);
  };

  const handlePauseSim = () => setIsSimulating(false);

  const handleResetSim = () => {
    setIsSimulating(false);
    setSimStepIndex(0);
    setSimAlert(stepFeedback[0]);
  };

  const currentMatatuCoords = routePoints[simStepIndex] || routePoints[0];

  return (
    <div className="relative w-full h-[640px] lg:h-[700px] rounded-3xl overflow-hidden border-2 border-black shadow-2xl bg-zinc-100 flex flex-col">
      {/* Top Header & Simulation Dashboard */}
      <div className="bg-white border-b-2 border-black px-4 py-3 flex flex-wrap items-center justify-between gap-3 z-[400]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black animate-pulse"></span>
            <span className="text-xs font-mono font-black uppercase text-black">
              Corridor Simulation: {DEMO_CORRIDOR.name}
            </span>
          </div>
          <p className="text-[11px] text-zinc-600 font-semibold mt-0.5">
            Active Operator: <strong>{activeSacco}</strong> | Status: <strong>In Transit</strong>
          </p>
        </div>

        {/* Simulator Playback Controls */}
        <div className="flex items-center gap-2">
          {!isSimulating ? (
            <button
              onClick={handleStartSim}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs border-2 border-black shadow transition active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>{simStepIndex === 0 ? 'Simulate Ride' : 'Resume'}</span>
            </button>
          ) : (
            <button
              onClick={handlePauseSim}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black hover:bg-zinc-800 text-yellow-400 font-black text-xs border-2 border-black shadow transition active:scale-95"
            >
              <Pause className="w-3.5 h-3.5 fill-yellow-400" />
              <span>Pause</span>
            </button>
          )}

          <button
            onClick={handleResetSim}
            className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black transition"
            title="Reset Simulation"
          >
            <RotateCcw className="w-4 h-4" />
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
          <MapController 
            targetCenter={isSimulating ? currentMatatuCoords : defaultCenter} 
            targetZoom={isSimulating ? 14 : 13} 
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* Render Route Polylines */}
          {DEMO_CORRIDOR.routes.map((rt) => (
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
          ))}

          {/* Moving Matatu Marker */}
          <Marker
            position={currentMatatuCoords}
            icon={createMatatuIcon(activeSacco.split(' ')[0])}
            zIndexOffset={1000}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <span className="font-black text-black block">{activeSacco} Live Matatu</span>
                <span className="text-zinc-600">Speed: 42 km/h • Fare locked: KES 70</span>
              </div>
            </Popup>
          </Marker>

          {/* Static Landmark Waypoints */}
          {DEMO_CORRIDOR.landmarks.map((lm) => {
            const isCaution = lm.id === 'cemetery';
            return (
              <Marker
                key={lm.id}
                position={lm.coords}
                icon={createLandmarkIcon(lm.icon, lm.name.split(' ')[0], isCaution)}
                eventHandlers={{ click: () => setActiveInspectLandmark(lm) }}
              >
                <Popup>
                  <div className="p-1 min-w-[220px] font-sans">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-zinc-100 border border-zinc-300 text-black">
                        {lm.type}
                      </span>
                      <span>{lm.icon}</span>
                    </div>
                    <h4 className="text-sm font-black text-black mb-1">{lm.name}</h4>
                    <p className="text-xs text-zinc-600 mb-2 leading-relaxed">{lm.hint}</p>
                    <button
                      onClick={() => setActiveInspectLandmark(lm)}
                      className="w-full py-1.5 px-3 rounded-lg bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs border border-black transition"
                    >
                      Inspect Landmark Details
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Live Journey Telemetry & Waypoint Alert Toast (Floating Top-Left) */}
        {simAlert && (
          <div className="absolute top-4 left-4 z-[400] max-w-sm w-[calc(100%-2rem)] bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-3.5 shadow-2xl transition-all">
            <div className="flex items-start gap-2.5">
              {simAlert.alertType === 'warning' ? (
                <div className="p-1.5 bg-yellow-400 border border-black rounded-xl shrink-0 mt-0.5">
                  <AlertTriangle className="w-4 h-4 text-black stroke-[2.5]" />
                </div>
              ) : (
                <div className="p-1.5 bg-black border border-black rounded-xl shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-black uppercase text-zinc-500">
                    Waypoint Telemetry
                  </span>
                  <span className="text-[10px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-300">
                    Step {simStepIndex + 1}/{routePoints.length}
                  </span>
                </div>
                <h4 className="text-xs font-black text-black mt-0.5">{simAlert.title}</h4>
                <p className="text-[11px] text-zinc-600 font-semibold mt-1 leading-snug">
                  {simAlert.desc}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sacco Operator Selector Drawer (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-[400] max-w-xs bg-white/95 backdrop-blur-md border-2 border-black rounded-2xl p-3 shadow-xl">
          <span className="text-[10px] font-black tracking-wider uppercase bg-black text-yellow-400 px-2 py-0.5 rounded-md inline-block mb-2">
            Switch Operator
          </span>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            {DEMO_CORRIDOR.saccos.map((sacco) => (
              <button
                key={sacco.id}
                onClick={() => setActiveSacco(sacco.name)}
                className={`p-2 rounded-xl text-left border transition ${
                  activeSacco.includes(sacco.name.split(' ')[0])
                    ? 'border-black bg-yellow-400 font-black text-black'
                    : 'border-zinc-300 bg-zinc-50 text-zinc-700 hover:border-black'
                }`}
              >
                <div className="text-[11px] font-bold truncate">{sacco.name}</div>
                <div className="text-[10px] opacity-80">{sacco.peak_ceiling}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Ground Inspection Modal */}
      {activeInspectLandmark && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="bg-white border-3 border-black rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            <div className="bg-black text-white px-5 py-3.5 flex items-center justify-between border-b-2 border-black">
              <div className="flex items-center gap-2.5">
                <span className="text-xl">{activeInspectLandmark.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-black uppercase px-1.5 py-0.5 rounded bg-yellow-400 text-black">
                      LANDMARK CUE
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

            <div className="relative w-full h-[280px] sm:h-[340px] bg-zinc-900">
              <img
                src={activeInspectLandmark.image_url}
                alt={activeInspectLandmark.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4">
                <p className="text-white text-xs font-bold leading-relaxed">
                  {activeInspectLandmark.visual_cue}
                </p>
              </div>
            </div>

            <div className="p-4 sm:p-5 bg-zinc-50 border-t-2 border-black flex flex-col gap-3">
              <p className="text-xs text-zinc-700 leading-relaxed">
                {activeInspectLandmark.hint}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activeInspectLandmark.map_query}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-black hover:text-zinc-700 underline"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Coordinates in Google Maps</span>
                </a>
                <button
                  onClick={() => setActiveInspectLandmark(null)}
                  className="px-4 py-2 rounded-xl bg-black hover:bg-zinc-800 text-yellow-400 font-black text-xs transition"
                >
                  Back to Journey
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
