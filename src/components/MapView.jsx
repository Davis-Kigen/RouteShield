import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Crosshair, Loader2 } from 'lucide-react';
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

const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="position:relative; width:22px; height:22px; transform: translate(-50%, -50%); display:flex; align-items:center; justify-content:center;">
        <div style="position:absolute; width:22px; height:22px; border-radius:50%; background:#000000; opacity:0.25; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="width:14px; height:14px; border-radius:50%; background:#000000; border:3px solid #facc15; box-shadow:0 0 10px rgba(0,0,0,0.5);"></div>
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
  const [userLocation, setUserLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);

  const currentCenter = userLocation || focusedLocation || (
    selectedRoute ? [selectedRoute.cbd_lat, selectedRoute.cbd_lng] : defaultCenter
  );

  const markerRefs = useRef({});

  useEffect(() => {
    if (selectedRoute && markerRefs.current[selectedRoute.id]) {
      markerRefs.current[selectedRoute.id].openPopup();
    }
  }, [selectedRoute, focusedLocation]);

  const handleLocateMe = () => {
    setIsLocating(true);
    setLocationError(null);

    const applyLocation = (coords, isSimulated = false) => {
      setUserLocation(coords);
      setIsLocating(false);

      let nearest = null;
      let minDistance = Infinity;

      routes.forEach((r) => {
        if (r.cbd_lat && r.cbd_lng) {
          const d = Math.hypot(r.cbd_lat - coords[0], r.cbd_lng - coords[1]);
          if (d < minDistance) {
            minDistance = d;
            nearest = r;
          }
        }
      });

      if (nearest && onSelectRoute) {
        onSelectRoute(nearest);
      }

      if (isSimulated) {
        setLocationError('Set to Nairobi CBD center (Railways/Kencom)');
        setTimeout(() => setLocationError(null), 4000);
      }
    };

    if (!navigator.geolocation) {
      applyLocation([-1.286389, 36.823611], true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyLocation([pos.coords.latitude, pos.coords.longitude], false);
      },
      (err) => {
        console.warn('GPS unavailable, using CBD baseline:', err.message);
        // Fallback to central CBD commuter anchor
        applyLocation([-1.286389, 36.823611], true);
      },
      { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
    );
  };

  return (
    <div className="relative w-full h-[540px] lg:h-[580px] rounded-2xl overflow-hidden border-2 border-black shadow-xl bg-zinc-100">
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
        className="w-full h-full z-10"
      >
        <MapController targetCenter={currentCenter} targetZoom={userLocation ? 16 : (focusedLocation ? 16 : 15)} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />

        {/* Current User GPS Marker */}
        {userLocation && (
          <>
            <Marker position={userLocation} icon={createUserLocationIcon()}>
              <Popup>
                <div className="p-1 font-sans text-xs">
                  <strong className="text-black block mb-0.5 font-black">Your Current Location</strong>
                  <span className="text-zinc-600">Showing nearest transit corridor & lit stage</span>
                </div>
              </Popup>
            </Marker>
            <Circle
              center={userLocation}
              radius={80}
              pathOptions={{
                color: '#000000',
                fillColor: '#facc15',
                fillOpacity: 0.15,
                weight: 1.5,
                dashArray: '3, 3'
              }}
            />
          </>
        )}

        {routes.map((route) => {
          const isSelected = selectedRoute?.id === route.id;
          const hasBothCoords =
            route.cbd_lat && route.cbd_lng && route.safe_zone_lat && route.safe_zone_lng;

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

              {/* Lit Safe Stage Marker */}
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
                        <span>VERIFIED LIT SAFE STAGE</span>
                      </div>
                      <h4 className="text-sm font-black text-black mb-1">{route.safe_zone}</h4>
                      <p className="text-xs text-zinc-600 mb-2">
                        Lit boarding and refuge zone for {route.route_name} commuters.
                      </p>
                      <div className="text-[11px] text-zinc-700 space-y-1 border-t border-zinc-200 pt-2 font-semibold">
                        <div>✓ High-Mast Streetlight Coverage</div>
                        <div>✓ Patrol Post Proximity</div>
                        <div>✓ Continuous 24/7 Foot Traffic</div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Connected Corridor Path & Radial Zone */}
              {isSelected && hasBothCoords && (
                <>
                  <Polyline
                    positions={[
                      [route.cbd_lat, route.cbd_lng],
                      [route.safe_zone_lat, route.safe_zone_lng]
                    ]}
                    pathOptions={{
                      color: '#000000',
                      weight: 6,
                      opacity: 0.85
                    }}
                  />
                  <Polyline
                    positions={[
                      [route.cbd_lat, route.cbd_lng],
                      [route.safe_zone_lat, route.safe_zone_lng]
                    ]}
                    pathOptions={{
                      color: '#facc15',
                      weight: 4,
                      opacity: 1,
                      dashArray: '8, 8'
                    }}
                  >
                    <Tooltip sticky direction="top" className="font-mono text-xs font-bold">
                      Safe Lit Transit Walkway
                    </Tooltip>
                  </Polyline>
                  <Circle
                    center={[route.safe_zone_lat, route.safe_zone_lng]}
                    radius={160}
                    pathOptions={{
                      color: '#000000',
                      fillColor: '#facc15',
                      fillOpacity: 0.25,
                      weight: 2,
                      dashArray: '4, 4'
                    }}
                  />
                </>
              )}
            </React.Fragment>
          );
        })}
      </MapContainer>

      {/* Floating GPS 'Locate Me' Button */}
      <div className="absolute top-4 right-4 z-[400] flex flex-col items-end gap-2">
        <button
          onClick={handleLocateMe}
          disabled={isLocating}
          className="flex items-center gap-2 bg-white hover:bg-zinc-100 text-black font-black text-xs px-3.5 py-2.5 rounded-xl border-2 border-black shadow-lg transition active:scale-95 disabled:opacity-75"
          title="Find nearest safe stage using current GPS"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Crosshair className="w-4 h-4 text-black stroke-[2.5]" />
          )}
          <span>{isLocating ? 'Locating...' : 'Locate Me'}</span>
        </button>

        {locationError && (
          <div className="bg-black text-white text-[10px] px-2.5 py-1 rounded-lg border border-yellow-400 max-w-[200px] text-right font-medium">
            {locationError}
          </div>
        )}
      </div>

      {/* Floating High-Contrast Legend */}
      <div className="absolute bottom-4 left-4 z-[400] bg-white/95 backdrop-blur-md border-2 border-black rounded-xl px-4 py-2.5 text-xs shadow-lg flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-black"></span>
          <span className="text-black font-black">CBD Stage</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></span>
          <span className="text-black font-black">Lit Stage</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 border-l border-zinc-300 pl-3">
          <span className="w-5 h-0.5 border-t-2 border-dashed border-black"></span>
          <span className="text-zinc-700 font-bold">Safe Walkway</span>
        </div>
      </div>
    </div>
  );
}
