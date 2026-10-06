import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

// Create custom HTML DivIcons to avoid broken asset URL issues and provide custom styling
const createStageIcon = (label) => {
  return L.divIcon({
    className: 'custom-stage-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#0284c7; color:#fff; border:2px solid #38bdf8; border-radius:8px; padding:4px 8px; font-weight:bold; font-size:11px; white-space:nowrap; box-shadow:0 4px 12px rgba(0,0,0,0.5); display:flex; align-items:center; gap:4px;">
          <span>🚌</span>
          <span>${label}</span>
        </div>
        <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid #0284c7;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

const createSafeZoneIcon = (label) => {
  return L.divIcon({
    className: 'custom-safe-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#059669; color:#fff; border:2px solid #34d399; border-radius:8px; padding:4px 8px; font-weight:bold; font-size:11px; white-space:nowrap; box-shadow:0 4px 14px rgba(16,185,129,0.5); display:flex; align-items:center; gap:4px;">
          <span>🛡️</span>
          <span>SAFE: ${label}</span>
        </div>
        <div style="width:0; height:0; border-left:6px solid transparent; border-right:6px solid transparent; border-top:6px solid #059669;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

// Component to handle smooth zooming and panning when route changes or safe zone is focused
function MapController({ targetCenter, targetZoom }) {
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

export default function MapView({
  routes,
  selectedRoute,
  onSelectRoute,
  focusedLocation,
  emergencyActive
}) {
  const defaultCenter = [-1.286389, 36.823611]; // Nairobi CBD Kencom / City Hall
  const currentCenter = focusedLocation || (
    selectedRoute ? [selectedRoute.cbd_lat, selectedRoute.cbd_lng] : defaultCenter
  );

  return (
    <div className="relative w-full h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <MapController targetCenter={currentCenter} targetZoom={focusedLocation ? 16 : 15} />

        {/* OpenStreetMap Tile Layer - cached offline by Workbox */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Render CBD Stages & Safe Zones */}
        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;

          return (
            <React.Fragment key={route.id}>
              {/* CBD Boarding Stage Marker */}
              {route.cbd_lat && route.cbd_lng && (
                <Marker
                  position={[route.cbd_lat, route.cbd_lng]}
                  icon={createStageIcon(route.route_name)}
                  eventHandlers={{
                    click: () => onSelectRoute(route)
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px]">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-emerald-400 font-mono">
                          {route.route_name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          CBD Stage
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {route.cbd_stage}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2">
                        {route.corridor}
                      </p>
                      <div className="text-xs bg-slate-800 p-2 rounded mb-2">
                        <div className="text-slate-300">Off-Peak: <b className="text-white">KES {route.off_peak_min}-{route.off_peak_max}</b></div>
                        <div className="text-amber-400">Peak Surge: <b>KES {route.peak_min}-{route.peak_max}</b></div>
                      </div>
                      <button
                        onClick={() => onSelectRoute(route)}
                        className="w-full py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded"
                      >
                        Inspect Route Details
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Safe Zone Marker */}
              {route.safe_zone_lat && route.safe_zone_lng && (
                <Marker
                  position={[route.safe_zone_lat, route.safe_zone_lng]}
                  icon={createSafeZoneIcon(route.route_name)}
                >
                  <Popup>
                    <div className="p-1 min-w-[210px]">
                      <div className="flex items-center space-x-1.5 text-emerald-400 text-xs font-bold mb-1">
                        <span>🛡️</span>
                        <span>VERIFIED 24/7 SAFE ZONE</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {route.safe_zone}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2">
                        Monitored refuge point for {route.route_name} commuters.
                      </p>
                      <div className="text-[11px] text-emerald-300 font-medium">
                        ✓ High-Mast Floodlit<br />
                        ✓ Active Police / Security Patrol<br />
                        ✓ Continuous Public CCTV
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Glowing Safe Circle around selected safe zone */}
              {isSelected && route.safe_zone_lat && route.safe_zone_lng && (
                <Circle
                  center={[route.safe_zone_lat, route.safe_zone_lng]}
                  radius={180}
                  pathOptions={{
                    color: '#10b981',
                    fillColor: '#10b981',
                    fillOpacity: 0.15,
                    weight: 2,
                    dashArray: '4, 8'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3 py-2 text-[11px] shadow-lg flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
          <span className="text-slate-300 font-medium">CBD Stage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span className="text-slate-300 font-medium">Safe Zone</span>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
          <span>•</span>
          <span>OpenStreetMap Offline-Cached</span>
        </div>
      </div>
    </div>
  );
}

