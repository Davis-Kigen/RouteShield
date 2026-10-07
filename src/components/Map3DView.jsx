import React, { useEffect, useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Circle, 
  Polyline, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  LocateFixed, 
  Compass, 
  Shield, 
  Layers,
  Maximize2,
  Navigation,
  Eye,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

// Custom DivIcons with 3D elevation aesthetic
const create3DStageIcon = (label, isSelected) => {
  const bg = isSelected ? '#10b981' : '#0284c7';
  const border = isSelected ? '#34d399' : '#38bdf8';
  return L.divIcon({
    className: 'custom-stage-marker-3d',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:pointer;">
        <div style="background:${bg}; color:#fff; border:2px solid ${border}; border-radius:12px; padding:5px 9px; font-weight:800; font-size:11px; white-space:nowrap; box-shadow:0 10px 25px -5px rgba(0,0,0,0.8), 0 0 15px ${bg}88; display:flex; align-items:center; gap:5px; transition:transform 0.2s;">
          <span style="font-size:12px;">🚏</span>
          <span>${label}</span>
        </div>
        <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${bg};"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const create3DSafeZoneIcon = (label, isEmergency) => {
  const bg = isEmergency ? '#ef4444' : '#059669';
  const border = isEmergency ? '#fca5a5' : '#34d399';
  return L.divIcon({
    className: 'custom-safe-marker-3d',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:pointer;">
        <div style="background:${bg}; color:#fff; border:2px solid ${border}; border-radius:12px; padding:5px 10px; font-weight:800; font-size:11px; white-space:nowrap; box-shadow:0 10px 25px -5px rgba(0,0,0,0.8), 0 0 18px ${bg}aa; display:flex; align-items:center; gap:5px; animation:${isEmergency ? 'pulse 1.2s infinite' : 'none'};">
          <span style="font-size:12px;">🛡️</span>
          <span>SAFE: ${label}</span>
        </div>
        <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:7px solid ${bg};"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const create3DLandmarkIcon = (name, category) => {
  return L.divIcon({
    className: 'custom-landmark-marker-3d',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%); cursor:pointer;">
        <div style="background:#1e293b; color:#e2e8f0; border:1.5px solid #64748b; border-radius:10px; padding:3px 7px; font-weight:700; font-size:10px; white-space:nowrap; box-shadow:0 6px 14px rgba(0,0,0,0.6); display:flex; align-items:center; gap:4px;">
          <span>🏛️</span>
          <span>${name}</span>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:5px solid #1e293b;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const createUser3DIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker-3d',
    html: `
      <div style="position:relative; width:24px; height:24px; transform: translate(-50%, -50%);">
        <div style="position:absolute; width:100%; height:100%; border-radius:50%; background:#3b82f6; opacity:0.75; animation:pulse-ring 2s infinite;"></div>
        <div style="position:absolute; top:4px; left:4px; width:16px; height:16px; border-radius:50%; background:#2563eb; border:2.5px solid #ffffff; box-shadow:0 0 15px #3b82f6;"></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

function Map3DController({ targetCenter, targetZoom }) {
  const map = useMap();

  useEffect(() => {
    if (targetCenter && targetCenter[0] && targetCenter[1]) {
      map.flyTo(targetCenter, targetZoom || 15, {
        duration: 1.2,
        easeLinearity: 0.25
      });
    }
  }, [targetCenter, targetZoom, map]);

  return null;
}

export default function Map3DView({
  routes = [],
  landmarks = [],
  activeRoute,
  onSelectRoute,
  focusedLocation,
  emergencyActive,
  userLocation,
  isMobileFullBleed = false,
  showLandmarks = true
}) {
  const defaultCenter = [-1.286389, 36.823611]; // Nairobi CBD Kencom / City Hall
  const [is3DMode, setIs3DMode] = useState(false);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [mapTarget, setMapTarget] = useState(null);
  const [targetZoom, setTargetZoom] = useState(15);

  const currentCenter = focusedLocation || (
    activeRoute ? [activeRoute.cbd_lat, activeRoute.cbd_lng] : defaultCenter
  );

  const handleRecenterCBD = () => {
    setMapTarget(defaultCenter);
    setTargetZoom(14);
  };

  const handleLocateMe = () => {
    if (userLocation && userLocation.lat && userLocation.lng) {
      setMapTarget([userLocation.lat, userLocation.lng]);
      setTargetZoom(16);
    } else if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setMapTarget([pos.coords.latitude, pos.coords.longitude]);
          setTargetZoom(16);
        },
        () => alert('Please enable GPS to locate your current position.')
      );
    }
  };

  return (
    <div className={`relative w-full ${isMobileFullBleed ? 'h-full' : 'h-[460px] sm:h-[600px] lg:h-[720px] rounded-3xl border border-zinc-800 shadow-2xl'} overflow-hidden bg-black`}>
      
      {/* 3D Perspective Tilt Wrapper */}
      <div 
        className="w-full h-full transition-transform duration-700 ease-out origin-bottom"
        style={is3DMode ? {
          transform: 'perspective(1100px) rotateX(25deg) scale(1.04)',
          transformStyle: 'preserve-3d'
        } : undefined}
      >
        <MapContainer
          center={defaultCenter}
          zoom={14}
          scrollWheelZoom={true}
          className="w-full h-full z-10"
          zoomControl={false}
        >
          <Map3DController 
            targetCenter={mapTarget || currentCenter} 
            targetZoom={targetZoom} 
          />

          {/* OpenStreetMap Tile Layer */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
          />

          {/* GPS User Marker */}
          {userLocation && (
            <Marker
              position={[userLocation.lat, userLocation.lng]}
              icon={createUser3DIcon()}
            >
              <Popup>
                <div className="p-1 text-xs">
                  <strong className="text-blue-400">Your Real-Time Location</strong>
                  <p className="text-[11px] text-zinc-300 mt-0.5">RouteShield 3D Spatial Radar Active</p>
                </div>
              </Popup>
            </Marker>
          )}

          {/* Active Route Transit Polyline */}
          {activeRoute && activeRoute.path_coords && activeRoute.path_coords.length > 1 && (
            <>
              {/* Outer Neon Glow Stroke */}
              <Polyline
                positions={activeRoute.path_coords}
                pathOptions={{
                  color: '#10b981',
                  weight: 12,
                  opacity: 0.35,
                  lineCap: 'round',
                  lineJoin: 'round'
                }}
              />
              {/* Core Transit Stroke */}
              <Polyline
                positions={activeRoute.path_coords}
                pathOptions={{
                  color: '#10b981',
                  weight: 5,
                  opacity: 0.95,
                  dashArray: '8, 8',
                  className: 'corridor-dash-active'
                }}
              />
            </>
          )}

          {/* Emergency SOS Evacuation Polyline */}
          {emergencyActive && activeRoute && activeRoute.emergency_path && (
            <>
              <Polyline
                positions={activeRoute.emergency_path}
                pathOptions={{
                  color: '#ef4444',
                  weight: 6,
                  opacity: 0.9,
                  dashArray: '6, 8',
                  className: 'corridor-dash-active'
                }}
              />
              <Circle
                center={[activeRoute.safe_zone_lat, activeRoute.safe_zone_lng]}
                radius={160}
                pathOptions={{
                  color: '#ef4444',
                  fillColor: '#ef4444',
                  fillOpacity: 0.25,
                  weight: 2
                }}
              />
            </>
          )}

          {/* Render Visual Landmarks (Offline & Online 3D Points) */}
          {showLandmarks && landmarks.map((lm) => (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={create3DLandmarkIcon(lm.name, lm.category)}
            >
              <Popup>
                <div className="p-1.5 min-w-[210px] text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-400 text-[10px] font-bold uppercase mb-1">
                    <span>🏛️</span>
                    <span>{lm.category}</span>
                  </div>
                  <h4 className="text-sm font-black text-white">{lm.name}</h4>
                  <p className="text-zinc-300 text-xs mt-0.5">{lm.cbd_area}</p>
                  
                  <div className="mt-2 pt-2 border-t border-zinc-800 space-y-1 text-[11px]">
                    <div className="text-emerald-300">
                      <strong>Safe Haven:</strong> {lm.nearest_safe_zone}
                    </div>
                    <div className="text-cyan-300">
                      <strong>Boarding Stage:</strong> {lm.nearest_stage}
                    </div>
                  </div>

                  {lm.advisory && (
                    <p className="mt-2 text-[10px] text-amber-300 italic">
                      ⚠️ {lm.advisory}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Stages & Safe Zones */}
          {routes.map((route) => {
            const isSelected = activeRoute?.id === route.id;

            return (
              <React.Fragment key={`markers-${route.id}`}>
                {/* CBD Boarding Stage Marker */}
                {route.cbd_lat && route.cbd_lng && (
                  <Marker
                    position={[route.cbd_lat, route.cbd_lng]}
                    icon={create3DStageIcon(route.route_name, isSelected)}
                    eventHandlers={{
                      click: () => onSelectRoute && onSelectRoute(route)
                    }}
                  >
                    <Popup>
                      <div className="p-1.5 min-w-[220px]">
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                            {route.route_name}
                          </span>
                          <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-600/40">
                            Boarding Bay
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-tight">
                          {route.cbd_stage}
                        </h4>
                        <p className="text-xs text-zinc-300 mt-1">
                          {route.corridor}
                        </p>
                        
                        {/* Quick Sacco details */}
                        {route.saccos && route.saccos.length > 0 && (
                          <div className="my-2 p-2 rounded-lg bg-black/70 border border-zinc-800 text-[11px] text-zinc-300">
                            <strong>Active Saccos:</strong> {route.saccos.map(s => s.name).join(', ')}
                          </div>
                        )}

                        <div className="text-[11px] flex justify-between text-zinc-400">
                          <span>Off-Peak: <b className="text-white">KES {route.off_peak_min}-{route.off_peak_max}</b></span>
                          <span>Peak: <b className="text-amber-400">KES {route.peak_min}-{route.peak_max}</b></span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Safe Zone Marker */}
                {showSafeZones && route.safe_zone_lat && route.safe_zone_lng && (
                  <Marker
                    position={[route.safe_zone_lat, route.safe_zone_lng]}
                    icon={create3DSafeZoneIcon(route.route_name, emergencyActive && isSelected)}
                  >
                    <Popup>
                      <div className="p-1.5 min-w-[220px]">
                        <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold mb-1">
                          <span>🛡️</span>
                          <span>24/7 VERIFIED SAFE HAVEN</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-1">
                          {route.safe_zone}
                        </h4>
                        <div className="text-[11px] text-emerald-300 space-y-0.5 mt-1">
                          <div>✓ Armed Security & Police Detachment</div>
                          <div>✓ High-Mast Floodlight Illumination</div>
                          <div>✓ 24-Hour Public CCTV Net</div>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Glowing Circle for Selected Safe Zone */}
                {isSelected && showSafeZones && route.safe_zone_lat && route.safe_zone_lng && (
                  <Circle
                    center={[route.safe_zone_lat, route.safe_zone_lng]}
                    radius={180}
                    pathOptions={{
                      color: emergencyActive ? '#ef4444' : '#10b981',
                      fillColor: emergencyActive ? '#ef4444' : '#10b981',
                      fillOpacity: 0.16,
                      weight: 2,
                      dashArray: '4, 8'
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>

      {/* Floating HUD Controls (Top Right) */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2.5">
        
        {/* Apple Maps 3D View Toggle */}
        <button
          onClick={() => setIs3DMode(!is3DMode)}
          className={`px-3 py-2 rounded-2xl shadow-2xl backdrop-blur-xl border font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer ${
            is3DMode 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 border-emerald-400 font-black shadow-emerald-950' 
              : 'bg-[#09090b]/90 text-zinc-200 border-zinc-700 hover:bg-[#18181b]'
          }`}
          title="Toggle Apple Maps 3D Perspective Tilt"
        >
          <Layers className="w-4 h-4" />
          <span>{is3DMode ? '3D Active' : '3D View'}</span>
        </button>

        {/* Locate Me GPS */}
        <button
          onClick={handleLocateMe}
          className="p-3 rounded-2xl bg-[#09090b]/90 hover:bg-[#18181b] text-emerald-400 border border-zinc-700 shadow-2xl backdrop-blur-xl transition active:scale-95 cursor-pointer"
          title="Center GPS Location"
        >
          <LocateFixed className="w-4 h-4" />
        </button>

        {/* Recenter CBD */}
        <button
          onClick={handleRecenterCBD}
          className="p-3 rounded-2xl bg-[#09090b]/90 hover:bg-[#18181b] text-cyan-400 border border-zinc-700 shadow-2xl backdrop-blur-xl transition active:scale-95 cursor-pointer"
          title="Recenter to Nairobi CBD"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Toggle Safe Zones */}
        <button
          onClick={() => setShowSafeZones(!showSafeZones)}
          className={`p-3 rounded-2xl border shadow-2xl backdrop-blur-xl transition active:scale-95 cursor-pointer ${
            showSafeZones 
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-600/50' 
              : 'bg-[#09090b]/90 text-zinc-400 border-zinc-700'
          }`}
          title="Toggle 24/7 Lit Safe Zones"
        >
          <Shield className="w-4 h-4" />
        </button>
      </div>

      {/* Floating Legend Bar (Bottom Left) */}
      <div className="absolute bottom-4 left-4 z-[400] bg-[#09090b]/95 backdrop-blur-xl border border-zinc-700/80 rounded-2xl px-3.5 py-2 text-[11px] shadow-2xl flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm shadow-sky-500/50"></span>
          <span className="text-zinc-200 font-semibold">Boarding Stage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
          <span className="text-zinc-200 font-semibold">Safe Haven</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
          <span className="text-zinc-300 font-medium">3D Landmark</span>
        </div>
      </div>

    </div>
  );
}
