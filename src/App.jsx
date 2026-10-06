import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import EmergencyCard from './components/EmergencyCard';
import RouteCard from './components/RouteCard';
import MapView from './components/MapView';
import FareReportModal from './components/FareReportModal';
import UssdSimulatorModal from './components/UssdSimulatorModal';
import fallbackRoutes from './data/routes.json';
import { 
  Search, 
  MapPin, 
  Shield, 
  Bus, 
  RefreshCw, 
  AlertTriangle, 
  Radio, 
  ExternalLink,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

export default function App() {
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState(fallbackRoutes[0]?.id || '125');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Monitor network connectivity
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      fetchLiveRoutes();
      syncPendingReports();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial fetch from backend
    fetchLiveRoutes();

    // Try geolocation to aid safe zone proximity calculation
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (err) => console.log('Geolocation not provided or blocked:', err.message),
        { timeout: 8000 }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch routes from Express backend
  const fetchLiveRoutes = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/routes');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setRoutes(data);
          setIsOnline(true);
        }
      } else {
        console.warn('Backend responded with non-200, retaining local dataset.');
      }
    } catch (err) {
      console.warn('Network unreachable, utilizing offline cached dataset:', err.message);
      setIsOnline(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sync offline queued fare reports when network is restored
  const syncPendingReports = async () => {
    try {
      const pending = JSON.parse(localStorage.getItem('routeshield_pending_fares') || '[]');
      if (pending.length === 0) return;

      console.log(`Syncing ${pending.length} pending offline fare reports...`);
      for (const item of pending) {
        await fetch('/api/fares/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        });
      }
      localStorage.removeItem('routeshield_pending_fares');
      fetchLiveRoutes();
    } catch (e) {
      console.error('Error syncing offline reports:', e);
    }
  };

  // Filter routes by corridor name, route number, or CBD stage
  const filteredRoutes = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return routes;
    return routes.filter((r) => 
      r.id.toLowerCase().includes(q) ||
      r.route_name.toLowerCase().includes(q) ||
      r.corridor.toLowerCase().includes(q) ||
      r.cbd_stage.toLowerCase().includes(q) ||
      r.safe_zone.toLowerCase().includes(q)
    );
  }, [routes, searchQuery]);

  const selectedRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  const handleSelectRoute = (route) => {
    setSelectedRouteId(route.id);
    if (route.cbd_lat && route.cbd_lng) {
      setFocusedLocation([route.cbd_lat, route.cbd_lng]);
    }
  };

  const handleFocusSafeZone = () => {
    if (selectedRoute?.safe_zone_lat && selectedRoute?.safe_zone_lng) {
      setFocusedLocation([selectedRoute.safe_zone_lat, selectedRoute.safe_zone_lng]);
    }
  };

  const handleFareReported = (routeId, newFare, avgFare) => {
    setRoutes((prev) =>
      prev.map((r) => {
        if (r.id === routeId) {
          const count = (r.crowdsourced?.reportCount || 0) + 1;
          const calculatedAvg = avgFare || Math.round(((r.crowdsourced?.avgFare || newFare) + newFare) / 2);
          return {
            ...r,
            crowdsourced: {
              ...r.crowdsourced,
              reportCount: count,
              avgFare: calculatedAvg,
              lastReportTime: 'Just now'
            }
          };
        }
        return r;
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white pb-12">
      {/* Top Navbar */}
      <Navbar
        isOnline={isOnline}
        emergencyActive={emergencyActive}
        onToggleEmergency={() => setEmergencyActive(!emergencyActive)}
        onOpenUssd={() => setIsUssdModalOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 sm:py-6 space-y-6">
        {/* Offline Banner Indicator if offline */}
        {!isOnline && (
          <div className="bg-amber-950/70 border border-amber-500/50 rounded-xl p-3 flex items-center justify-between text-xs sm:text-sm text-amber-200">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>
                <strong>Offline Mode Active:</strong> Showing verified offline cached stages & safe zones. Fares reported will sync once connected.
              </span>
            </div>
            <button
              onClick={fetchLiveRoutes}
              className="text-xs px-2.5 py-1 rounded bg-amber-900/60 hover:bg-amber-800 text-amber-100 border border-amber-600/50 font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {/* Emergency SOS Mode Panel */}
        {emergencyActive && (
          <EmergencyCard
            currentRoute={selectedRoute}
            userCoords={userLocation}
            onClose={() => setEmergencyActive(false)}
            onFocusSafeZone={handleFocusSafeZone}
          />
        )}

        {/* Search Bar & USSD Quick Dial Bar */}
        <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search corridor or route (e.g., '125', 'Rongai', '45', 'Thika', '105', 'Waiyaki')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Refresh & USSD Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={fetchLiveRoutes}
                disabled={isRefreshing}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="Refresh routes and fare telemetry"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
              </button>

              <button
                onClick={() => setIsUssdModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">USSD Dialer:</span>
                <span className="font-mono font-bold">*384*123#</span>
              </button>
            </div>
          </div>

          {/* Route Selection Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap pl-1">
              Corridors:
            </span>
            {routes.map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50 ring-2 ring-emerald-400'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                  }`}
                >
                  <span className="font-mono">{route.route_name}</span>
                  <span className="opacity-75 hidden xs:inline">({route.corridor.split('(')[0].replace('CBD to ', '')})</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main Content Grid: Route Detail Card & Leaflet Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Selected Route Details */}
          <div className="lg:col-span-6 space-y-4">
            <RouteCard
              route={selectedRoute}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onFocusMap={() => {
                if (selectedRoute?.cbd_lat && selectedRoute?.cbd_lng) {
                  setFocusedLocation([selectedRoute.cbd_lat, selectedRoute.cbd_lng]);
                }
              }}
              isOnline={isOnline}
            />

            {/* Commuter Safety Checklist Quick Widget */}
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-xs">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold mb-2">
                <Shield className="w-4 h-4" />
                <span>Nairobi Commuter Safety Shield Protocol</span>
              </div>
              <ul className="space-y-1.5 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Railways Stage:</strong> Access via pedestrian overpass; avoid crossing railway tracks after dark.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Odeon / Ronald Ngala:</strong> Stand inside designated queue barricades with bags held forward.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span><strong>Kencom / City Hall:</strong> 24-hour illuminated zone with police reserve post at Supreme Court.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Interactive Map */}
          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>Interactive Nairobi CBD Safe Transit Map</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Click pins to inspect stages
              </span>
            </div>

            <MapView
              routes={filteredRoutes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              focusedLocation={focusedLocation}
              emergencyActive={emergencyActive}
            />
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="max-w-6xl mx-auto px-4 mt-8 pt-4 border-t border-slate-800/80 text-center text-xs text-slate-500">
        <div className="flex flex-wrap items-center justify-center gap-4 mb-2">
          <span>RouteShield Nairobi Transit</span>
          <span>•</span>
          <span>USSD Gateway: <b className="text-emerald-400 font-mono">*384*123#</b></span>
          <span>•</span>
          <span>Police Helpline: <b className="text-rose-400">999 / 112</b></span>
          <span>•</span>
          <span>Nairobi County Emergency: <b>020 2222181</b></span>
        </div>
        <p className="text-[11px]">
          Designed for Nairobi Commuters. Offline-ready PWA with OpenStreetMap tile caching and Africa's Talking USSD protocol.
        </p>
      </footer>

      {/* Crowdsourced Fare Report Modal */}
      <FareReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        route={selectedRoute}
        routes={routes}
        onFareReported={handleFareReported}
      />

      {/* Africa's Talking USSD Simulator Modal */}
      <UssdSimulatorModal
        isOpen={isUssdModalOpen}
        onClose={() => setIsUssdModalOpen(false)}
      />
    </div>
  );
}

