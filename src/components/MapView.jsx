import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';

const createStageIcon = (label) => {
  return L.divIcon({
    className: 'custom-stage-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background:#18191f; color:#ffffff; border:1px solid #3f3f46; border-radius:6px; padding:3px 8px; font-weight:700; font-size:11px; font-family:system-ui, sans-serif; white-space:nowrap; box-shadow:0 6px 20px rgba(0,0,0,0.85); display:flex; align-items:center; gap:5px;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#ffffff;"></span>
          <span>${label}</span>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #3f3f46;"></div>
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
        <div style="background:#18191f; color:#fbbf24; border:1px solid #d97706; border-radius:6px; padding:3px 8px; font-weight:700; font-size:11px; font-family:system-ui, sans-serif; white-space:nowrap; box-shadow:0 6px 20px rgba(0,0,0,0.85); display:flex; align-items:center; gap:5px;">
          <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:#fbbf24;"></span>
          <span>HAVEN: ${label}</span>
        </div>
        <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #d97706;"></div>
      </div>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0]
  });
};

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
  focusedLocation
}) {
  const defaultCenter = [-1.286389, 36.823611];
  const currentCenter = focusedLocation || (
    selectedRoute ? [selectedRoute.cbd_lat, selectedRoute.cbd_lng] : defaultCenter
  );

  return (
    <div className="relative w-full h-[520px] lg:h-[580px] rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl bg-[#0d0e12]">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <MapController targetCenter={currentCenter} targetZoom={focusedLocation ? 16 : 15} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          maxZoom={19}
        />

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
                    <div className="p-1 min-w-[210px] bg-[#18191f] text-zinc-100 rounded-lg">
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-mono font-bold text-white">
                          {route.route_name}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-semibold">
                          CBD Pickup
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {route.cbd_stage}
                      </h4>
                      <p className="text-xs text-zinc-400 mb-2">
                        {route.corridor}
                      </p>
                      <div className="text-xs bg-zinc-900 border border-zinc-800 p-2.5 rounded-lg mb-2 space-y-1">
                        <div className="text-zinc-400 flex justify-between">
                          <span>Off-Peak:</span>
                          <b className="text-white">KES {route.off_peak_min}–{route.off_peak_max}</b>
                        </div>
                        <div className="text-amber-400 flex justify-between">
                          <span>Peak Ceiling:</span>
                          <b>KES {route.peak_min}–{route.peak_max}</b>
                        </div>
                      </div>
                      <button
                        onClick={() => onSelectRoute(route)}
                        className="w-full py-1.5 text-xs bg-white hover:bg-zinc-100 text-zinc-950 font-bold rounded-md transition shadow"
                      >
                        Select Corridor
                      </button>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Safe Haven Marker */}
              {route.safe_zone_lat && route.safe_zone_lng && (
                <Marker
                  position={[route.safe_zone_lat, route.safe_zone_lng]}
                  icon={createSafeZoneIcon(route.route_name)}
                  eventHandlers={{
                    click: () => onSelectRoute(route)
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[220px] bg-[#18191f] text-zinc-100 rounded-lg">
                      <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-mono font-bold mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>MONITORED SAFE HAVEN</span>
                      </div>
                      <h4 className="text-sm font-bold text-white mb-1">
                        {route.safe_zone}
                      </h4>
                      <p className="text-xs text-zinc-400 mb-2">
                        Designated refuge zone for {route.route_name} commuters.
                      </p>
                      <div className="text-[11px] text-zinc-400 space-y-1 border-t border-zinc-800 pt-2 font-medium">
                        <div>✓ 24/7 Floodlight Lighting</div>
                        <div>✓ Proximity to Active Patrol Post</div>
                        <div>✓ Public Street Surveillance</div>
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
                    color: '#f59e0b',
                    fillColor: '#f59e0b',
                    fillOpacity: 0.12,
                    weight: 1.5,
                    dashArray: '4, 6'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating Legend */}
      <div className="absolute bottom-3 left-3 z-[400] bg-[#14151a]/95 backdrop-blur-md border border-zinc-800/90 rounded-xl px-3.5 py-2 text-xs shadow-2xl flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-white"></span>
          <span className="text-zinc-200 font-medium">CBD Stage</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <span className="text-zinc-200 font-medium">Safe Haven</span>
        </div>
      </div>
    </div>
  );
}
