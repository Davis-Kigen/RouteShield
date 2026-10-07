import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const createStageIcon = (label) => {
  return L.divIcon({
    className: 'custom-stage-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#000000; color:#ffffff; border:2px solid #000000; border-radius:6px; padding:4px 9px; font-weight:800; font-size:11px; font-family:monospace; white-space:nowrap; box-shadow:0 6px 16px rgba(0,0,0,0.25); display:flex; align-items:center; gap:6px;">
          <span style="display:inline-block; width:7px; height:7px; border-radius:50%; background:#facc15;"></span>
          <span>${label}</span>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #000000;"></div>
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
        <div style="background:#facc15; color:#000000; border:2px solid #000000; border-radius:6px; padding:4px 9px; font-weight:900; font-size:11px; font-family:monospace; white-space:nowrap; box-shadow:0 6px 16px rgba(250,204,21,0.35); display:flex; align-items:center; gap:5px;">
          <span>★</span>
          <span>SAFE: ${label}</span>
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
    if (targetCenter && targetCenter[0] && targetCenter[1]) {
      map.flyTo(targetCenter, targetZoom || 16, {
        duration: 1.0,
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
  focusedLocation
}) {
  const defaultCenter = [-1.286389, 36.823611];
  const currentCenter = focusedLocation || (
    selectedRoute ? [selectedRoute.cbd_lat, selectedRoute.cbd_lng] : defaultCenter
  );

  const markerRefs = useRef({});

  // Auto-open active route stage popup when focused
  useEffect(() => {
    if (selectedRoute && markerRefs.current[selectedRoute.id]) {
      markerRefs.current[selectedRoute.id].openPopup();
    }
  }, [selectedRoute, focusedLocation]);

  return (
    <div className="relative w-full h-[540px] lg:h-[580px] rounded-2xl overflow-hidden border-2 border-zinc-900 shadow-xl bg-zinc-100">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full z-10"
      >
        <MapController targetCenter={currentCenter} targetZoom={focusedLocation ? 16 : 15} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;

          return (
            <React.Fragment key={route.id}>
              {/* CBD Boarding Stage Marker */}
              {route.cbd_lat && route.cbd_lng && (
                <Marker
                  ref={(ref) => {
                    if (ref) markerRefs.current[route.id] = ref;
                  }}
                  position={[route.cbd_lat, route.cbd_lng]}
                  icon={createStageIcon(route.route_name)}
                  eventHandlers={{ click: () => onSelectRoute(route) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[210px] bg-white text-zinc-900 font-sans">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono font-black text-black bg-yellow-400 px-1.5 py-0.5 rounded">
                          {route.route_name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-800 font-bold border border-zinc-300">
                          CBD Pickup
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-black mb-1">{route.cbd_stage}</h4>
                      <p className="text-xs text-zinc-600 mb-2">{route.corridor}</p>
                      <div className="text-xs bg-zinc-100 border border-zinc-300 p-2.5 rounded-lg mb-2 space-y-1">
                        <div className="text-zinc-700 flex justify-between">
                          <span>Off-Peak:</span>
                          <b className="text-black">KES {route.off_peak_min}–{route.off_peak_max}</b>
                        </div>
                        <div className="text-zinc-950 flex justify-between font-bold">
                          <span>Peak Ceiling:</span>
                          <b className="text-black">KES {route.peak_min}–{route.peak_max}</b>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectRoute(route)}
                        className="w-full py-1.5 text-xs bg-black hover:bg-zinc-800 text-yellow-400 font-black rounded-md transition shadow"
                      >
                        Active Corridor
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Safe Boarding Point Marker */}
              {route.safe_zone_lat && route.safe_zone_lng && (
                <Marker
                  position={[route.safe_zone_lat, route.safe_zone_lng]}
                  icon={createSafeZoneIcon(route.route_name)}
                  eventHandlers={{ click: () => onSelectRoute(route) }}
                >
                  <Popup>
                    <div className="p-1 min-w-[220px] bg-white text-zinc-900 font-sans">
                      <div className="flex items-center space-x-1.5 text-black text-xs font-black mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black"></span>
                        <span>VERIFIED SAFE BOARDING POINT</span>
                      </div>
                      <h4 className="text-sm font-black text-black mb-1">{route.safe_zone}</h4>
                      <p className="text-xs text-zinc-600 mb-2">
                        Designated refuge zone for {route.route_name} commuters.
                      </p>
                      <div className="text-[11px] text-zinc-700 space-y-1 border-t border-zinc-200 pt-2 font-semibold">
                        <div>✓ High-Mast Floodlight Coverage</div>
                        <div>✓ Active Police / Patrol Point</div>
                        <div>✓ 24-Hour Public Visibility</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {isSelected && route.safe_zone_lat && route.safe_zone_lng && (
                <Circle
                  center={[route.safe_zone_lat, route.safe_zone_lng]}
                  radius={180}
                  pathOptions={{
                    color: '#000000',
                    fillColor: '#facc15',
                    fillOpacity: 0.25,
                    weight: 2,
                    dashArray: '5, 5'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating High-Contrast Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2 text-xs shadow-lg flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black"></span>
          <span className="text-black font-black">CBD Stage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span>
          <span className="text-black font-black">Safe Stage</span>
        </div>
      </div>
    </div>
  );
}
