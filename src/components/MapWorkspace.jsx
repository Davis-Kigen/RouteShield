import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Filter, 
  RefreshCw, 
  Shield, 
  Radio, 
  ArrowRight, 
  Check, 
  Layers, 
  AlertTriangle,
  Locate,
  Footprints,
  Bus
} from 'lucide-react';
import RouteCard from './RouteCard';
import MapView from './MapView';

export default function MapWorkspace({
  routes = [],
  selectedRoute,
  onSelectRoute,
  onOpenReportModal,
  onOpenUssd,
  focusedLocation,
  onFocusLocation,
  emergencyActive,
  userLocation,
  isRefreshing,
  onRefreshRoutes,
  isOnline
}) {
  const [startingPoint, setStartingPoint] = useState('Nairobi CBD / Kencom');
  const [destinationQuery, setDestinationQuery] = useState('');
  const [selectedSacco, setSelectedSacco] = useState('ALL');

  // Quick stage presets for Starting Point
  const quickStartStages = [
    'Nairobi CBD',
    'Kencom',
    'Railways Station',
    'Odeon Cinema',
    'Ambassadeur',
    'OTC / Mfangano'
  ];

  // Extract all distinct Saccos from all routes
  const allSaccos = useMemo(() => {
    const set = new Set();
    routes.forEach(r => {
      (r.saccos || []).forEach(s => set.add(s.name));
    });
    return ['ALL', ...Array.from(set)];
  }, [routes]);

  // Filter routes based on search and Sacco selection
  const filteredRoutes = useMemo(() => {
    const q = destinationQuery.toLowerCase().trim();
    return routes.filter((r) => {
      const matchesSearch = !q || 
        r.id.toLowerCase().includes(q) ||
        r.route_name.toLowerCase().includes(q) ||
        r.corridor.toLowerCase().includes(q) ||
        (r.destination && r.destination.toLowerCase().includes(q)) ||
        r.cbd_stage.toLowerCase().includes(q) ||
        r.safe_zone.toLowerCase().includes(q);

      const matchesSacco = selectedSacco === 'ALL' || 
        (r.saccos && r.saccos.some(s => s.name === selectedSacco));

      return matchesSearch && matchesSacco;
    });
  }, [routes, destinationQuery, selectedSacco]);

  const handleSelectStage = (stage) => {
    setStartingPoint(stage);
    // Find matching route for stage
    const match = routes.find(r => r.cbd_stage.toLowerCase().includes(stage.toLowerCase()));
    if (match) {
      onSelectRoute(match);
      if (onFocusLocation && match.cbd_lat) {
        onFocusLocation([match.cbd_lat, match.cbd_lng]);
      }
    }
  };

  return (
    <section id="workspace" className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* Workspace Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>The Core App Workspace</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Integrated Map & Fare Intelligence Suite
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Filter corridors by Sacco, inspect bounded peak surge fares, and track illuminated safe zones.
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2 shrink-0">
          
        </div>
      </div>

      {/* Main Grid: Left Search & Route Cards, Right Full-Height Leaflet Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Floating Search Suite & Cards (Desktop lg:col-span-5 or 6) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Dual Input Search Suite */}
          <div className="glass-card rounded-3xl p-4 sm:p-5 shadow-xl space-y-3.5 border border-zinc-800">
            
            {/* Starting Point Input */}
            <div className="relative">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Starting Point / Pickup Stage:
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
                <input
                  type="text"
                  value={startingPoint}
                  onChange={(e) => setStartingPoint(e.target.value)}
                  placeholder="e.g. Kencom, Railways, Odeon..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner font-medium"
                />
              </div>

              {/* Quick Starting Stages pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-2 pb-0.5 no-scrollbar">
                {quickStartStages.map((stg) => (
                  <button
                    key={stg}
                    onClick={() => handleSelectStage(stg)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border whitespace-nowrap transition ${
                      startingPoint.includes(stg)
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-500/50'
                        : 'bg-[#09090b] text-zinc-400 border-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    {stg}
                  </button>
                ))}
              </div>
            </div>

            {/* Destination / Stage Input */}
            <div className="relative pt-1">
              <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                Destination / Transit Corridor:
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  value={destinationQuery}
                  onChange={(e) => setDestinationQuery(e.target.value)}
                  placeholder="Search Rongai, Githurai, Kikuyu, Ngong, Pipeline, Waiyaki..."
                  className="w-full bg-black border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner font-medium"
                />
                {destinationQuery && (
                  <button
                    onClick={() => setDestinationQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-400 hover:text-white"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Interactive Sacco Filter Chips */}
            <div className="pt-2 border-t border-zinc-800/80">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Filter className="w-3 h-3 text-emerald-400" />
                  <span>Filter by Verified Sacco:</span>
                </span>
                <span className="text-[10px] text-zinc-500">
                  {filteredRoutes.length} Corridors Match
                </span>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {allSaccos.map((sacco) => {
                  const isSelected = selectedSacco === sacco;
                  return (
                    <button
                      key={sacco}
                      onClick={() => setSelectedSacco(sacco)}
                      className={`text-xs font-bold px-3 py-1.5 rounded-xl border whitespace-nowrap transition active:scale-95 ${
                        isSelected
                          ? 'bg-emerald-600 text-white border-emerald-500 shadow-md shadow-emerald-950'
                          : 'bg-black text-zinc-300 border-zinc-800 hover:bg-[#18181b]'
                      }`}
                    >
                      {sacco === 'ALL' ? 'All Saccos' : sacco}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Route Selection Pills */}
            <div className="pt-1 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {filteredRoutes.map((route) => {
                const isSelected = selectedRoute?.id === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => {
                      onSelectRoute(route);
                      if (onFocusLocation && route.cbd_lat) {
                        onFocusLocation([route.cbd_lat, route.cbd_lng]);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900 ring-2 ring-emerald-400'
                        : 'bg-[#09090b] text-zinc-300 hover:bg-[#18181b] border border-zinc-800'
                    }`}
                  >
                    <span>{route.route_name}</span>
                    <span className="text-[10px] opacity-75 font-normal">
                      ({route.destination || route.corridor.split('(')[0].replace('CBD to ', '')})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Route Card Details */}
          <RouteCard
            route={selectedRoute}
            onOpenReportModal={onOpenReportModal}
            onFocusMap={(r) => {
              if (onFocusLocation && r?.cbd_lat) {
                onFocusLocation([r.cbd_lat, r.cbd_lng]);
              }
            }}
            onFocusSafeZone={() => {
              if (onFocusLocation && selectedRoute?.safe_zone_lat) {
                onFocusLocation([selectedRoute.safe_zone_lat, selectedRoute.safe_zone_lng]);
              }
            }}
            isOnline={isOnline}
          />

          {/* Commuter Safety Checklist Quick Widget */}
          <div className="glass-card rounded-3xl p-4 sm:p-5 border border-zinc-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2.5">
              <Shield className="w-4 h-4" />
              <span className="uppercase tracking-wider">Nairobi Commuter Safety Shield Protocol</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-zinc-300">
              <div className="p-2.5 rounded-xl bg-black/70 border border-zinc-800/80">
                <strong className="text-white block mb-0.5">1. Overpass Safe Path</strong>
                <span>At Railways, use the lit overhead pedestrian bridge. Never cross rail lines.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/70 border border-zinc-800/80">
                <strong className="text-white block mb-0.5">2. Barrier Queuing</strong>
                <span>At Odeon/Ngala, stay inside steel guide rails. Keep bag zipped on your front.</span>
              </div>
              <div className="p-2.5 rounded-xl bg-black/70 border border-zinc-800/80">
                <strong className="text-white block mb-0.5">3. Guarded Zones</strong>
                <span>Kencom & Supreme Court have 24/7 lit guard posts and active county CCTV.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Full-Height Interactive Leaflet Map (Desktop) */}
        <div className="lg:col-span-6 space-y-3 sticky top-20">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Nairobi Transit Canvas</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Selected:</span>
              <strong className="text-emerald-400 font-mono">{selectedRoute?.route_name || 'All'}</strong>
            </div>
          </div>

          <MapView
            routes={filteredRoutes}
            selectedRoute={selectedRoute}
            onSelectRoute={onSelectRoute}
            focusedLocation={focusedLocation}
            emergencyActive={emergencyActive}
            userLocation={userLocation}
          />
        </div>

      </div>
    </section>
  );
}
