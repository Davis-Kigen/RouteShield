import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import LandingHero from './components/LandingHero';
import EmergencyCard from './components/EmergencyCard';
import RouteCard from './components/RouteCard';
import MapView from './components/MapView';
import FareReportModal from './components/FareReportModal';
import UssdSimulatorModal from './components/UssdSimulatorModal';
import fallbackRoutes from './data/routes.json';
import { Search, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function App() {
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState(fallbackRoutes[0]?.id || '125');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [focusedLocation, setFocusedLocation] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isUssdModalOpen, setIsUssdModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [userLocation, setUserLocation] = useState(null);

  const terminalRef = useRef(null);

  useEffect(() => {
    const handleOnline = () => { setIsOnline(true); syncPendingReports(); };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchLiveRoutes();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.log('Geolocation unavailable:', err.message),
        { timeout: 8000 }
      );
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

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
      }
    } catch (err) {
      setIsOnline(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  const syncPendingReports = async () => {
    try {
      const pending = JSON.parse(localStorage.getItem('routeshield_pending_fares') || '[]');
      if (pending.length === 0) return;
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
      console.error('Error syncing fares:', e);
    }
  };

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

  const scrollToTerminal = () => {
    terminalRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 flex flex-col selection:bg-yellow-400 selection:text-black">
      <Navbar
        emergencyActive={emergencyActive}
        onToggleEmergency={() => setEmergencyActive(!emergencyActive)}
        onOpenUssd={() => setIsUssdModalOpen(true)}
      />

      <LandingHero
        onExplore={scrollToTerminal}
        onOpenUssd={() => setIsUssdModalOpen(true)}
      />

      <main ref={terminalRef} className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 space-y-6">
        {!isOnline && (
          <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-3.5 flex items-center justify-between text-xs sm:text-sm text-yellow-900 shadow-sm">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
              <span>Offline Mode: Displaying cached stages. Reports will sync automatically.</span>
            </div>
            <button
              onClick={fetchLiveRoutes}
              className="text-xs px-2.5 py-1 rounded bg-black hover:bg-zinc-800 text-white font-semibold"
            >
              Retry
            </button>
          </div>
        )}

        {emergencyActive && (
          <EmergencyCard
            currentRoute={selectedRoute}
            userCoords={userLocation}
            onClose={() => setEmergencyActive(false)}
            onFocusSafeZone={handleFocusSafeZone}
          />
        )}

        <section className="bg-white border-2 border-zinc-900 rounded-2xl p-4 sm:p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search corridor or route (e.g., '125', 'Rongai', '45', 'Thika', '111', 'Karen')..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black transition"
              />
            </div>

            <button
              onClick={fetchLiveRoutes}
              disabled={isRefreshing}
              className="p-2.5 rounded-xl bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border border-zinc-200 transition shrink-0"
              title="Refresh routes"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-black' : ''}`} />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1 scrollbar-none">
            <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider whitespace-nowrap pr-1">
              Corridors:
            </span>
            {routes.map((route) => {
              const isSelected = selectedRouteId === route.id;
              return (
                <button
                  key={route.id}
                  onClick={() => handleSelectRoute(route)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-yellow-400 text-black shadow-sm ring-1 ring-yellow-500'
                      : 'bg-zinc-50 text-zinc-600 hover:text-black hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  <span className="font-mono">{route.route_name}</span>
                  <span className="opacity-75 hidden xs:inline">
                    ({route.corridor.split('(')[0].replace('CBD to ', '')})
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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

            <div className="bg-white border border-zinc-200 rounded-2xl p-5 text-xs text-zinc-700 space-y-2.5 shadow-sm">
              <div className="flex items-center space-x-2 text-black font-bold">
                <ShieldCheck className="w-4 h-4 text-yellow-600" />
                <span>Nairobi Commuter Boarding Directives</span>
              </div>
              <ul className="space-y-1.5 text-zinc-600">
                <li>• <strong className="text-black">Railways Stage:</strong> Access via Haile Selassie overpass; avoid dark unlit rail tracks after 20:00.</li>
                <li>• <strong className="text-black">Odeon / Tom Mboya:</strong> Board strictly inside queue railings; keep bags strapped forward.</li>
                <li>• <strong className="text-black">Kencom / City Hall:</strong> 24-hour illuminated zone with police reserve post at Supreme Court.</li>
              </ul>
            </div>
          </div>

          <div className="lg:col-span-6 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                CBD Stage & Safe Haven Map
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">
                Real-Time GeoGrid
              </span>
            </div>

            <MapView
              routes={filteredRoutes}
              selectedRoute={selectedRoute}
              onSelectRoute={handleSelectRoute}
              focusedLocation={focusedLocation}
            />
          </div>
        </div>
      </main>

      <footer className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-8 border-t border-zinc-200 text-center text-xs text-zinc-500">
        <p>© 2026 RouteShield • Commuter safety and fare transparency for Nairobi.</p>
      </footer>

      {isReportModalOpen && (
        <FareReportModal
          isOpen={isReportModalOpen}
          route={selectedRoute}
          routes={routes}
          onClose={() => setIsReportModalOpen(false)}
          onSuccess={() => {
            fetchLiveRoutes();
            setIsReportModalOpen(false);
          }}
        />
      )}

      {isUssdModalOpen && (
        <UssdSimulatorModal
          isOpen={isUssdModalOpen}
          onClose={() => setIsUssdModalOpen(false)}
        />
      )}
    </div>
  );
}
