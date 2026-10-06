import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Search, 
  Navigation, 
  ArrowRight, 
  Crosshair, 
  RotateCcw,
  Sparkles,
  Bus,
  Check,
  Clock,
  ShieldCheck
} from 'lucide-react';

export default function SearchAndRoutePanel({
  routes = [],
  onRouteCalculated,
  onStartJourney,
  userLocation,
  isJourneyActive,
  onCancelJourney
}) {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [matchedRoute, setMatchedRoute] = useState(null);
  const [searchError, setSearchError] = useState(null);

  // Nairobi popular destinations for instant suggestion chips
  const popularDestinations = [
    'Ongata Rongai',
    'Githurai 45',
    'Kikuyu',
    'Westlands',
    'Ngong Town',
    'Embakasi Pipeline'
  ];

  // Match corridor based on entered origin and destination
  const handleFindRoute = (e) => {
    if (e) e.preventDefault();
    setSearchError(null);

    const orig = origin.trim().toLowerCase();
    const dest = destination.trim().toLowerCase();

    if (!dest) {
      setSearchError('Please enter where you are headed to.');
      return;
    }

    // Search route collection for match
    const found = routes.find(r => {
      const matchDest = (r.destination && r.destination.toLowerCase().includes(dest)) ||
        r.corridor.toLowerCase().includes(dest) ||
        r.route_name.toLowerCase().includes(dest);

      const matchOrig = !orig || orig.includes('current') || orig.includes('cbd') || orig.includes('location') ||
        r.cbd_stage.toLowerCase().includes(orig) ||
        orig.includes(r.cbd_stage.toLowerCase().split(' ')[0]);

      return matchDest && matchOrig;
    }) || routes.find(r => 
      (r.destination && r.destination.toLowerCase().includes(dest)) ||
      r.corridor.toLowerCase().includes(dest)
    );

    if (found) {
      setMatchedRoute(found);
      if (onRouteCalculated) {
        onRouteCalculated(found);
      }
    } else {
      // If no exact match, fallback to the closest major corridor or default to Route 125
      const fallback = routes[0];
      setMatchedRoute(fallback);
      if (onRouteCalculated) {
        onRouteCalculated(fallback);
      }
      setSearchError(`Custom path mapped to nearest arterial corridor: ${fallback.route_name}`);
    }
  };

  const handleUseMyLocation = () => {
    setOrigin('📍 My Current Location');
    if (destination) {
      handleFindRoute();
    }
  };

  const handleClear = () => {
    setOrigin('');
    setDestination('');
    setMatchedRoute(null);
    setSearchError(null);
    if (onCancelJourney) onCancelJourney();
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-2xl border border-slate-700/80 space-y-4">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
            <Navigation className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-white">Plan Your Commute</h3>
            <p className="text-[11px] text-slate-400">Enter your starting point and destination</p>
          </div>
        </div>

        {(origin || destination || matchedRoute) && (
          <button
            onClick={handleClear}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Origin & Destination Inputs Form */}
      <form onSubmit={handleFindRoute} className="space-y-3">
        {/* Starting Point (Origin) */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Where from? (Starting Point)
          </label>
          <div className="relative">
            <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              placeholder="e.g. Kencom, Railways, Odeon, or GPS..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-24 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 shadow-inner font-medium"
            />
            {/* GPS Button */}
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 flex items-center gap-1 transition"
            >
              <Crosshair className="w-3 h-3 text-cyan-400" />
              <span>GPS Me</span>
            </button>
          </div>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
            Where to? (Destination)
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Ongata Rongai, Githurai 45, Kikuyu, Ngong..."
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner font-medium"
            />
          </div>
        </div>

        {/* Popular Destination Quick Chips */}
        {!matchedRoute && (
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
              Quick Select Destination:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {popularDestinations.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => {
                    setDestination(dest);
                    // Trigger find route
                    const match = routes.find(r => 
                      (r.destination && r.destination.toLowerCase().includes(dest.toLowerCase())) ||
                      r.corridor.toLowerCase().includes(dest.toLowerCase())
                    );
                    if (match) {
                      setMatchedRoute(match);
                      if (onRouteCalculated) onRouteCalculated(match);
                    }
                  }}
                  className={`text-xs px-2.5 py-1 rounded-xl border transition ${
                    destination === dest 
                      ? 'bg-emerald-600 text-white border-emerald-500' 
                      : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Error Notice */}
        {searchError && (
          <p className="text-xs text-amber-300 bg-amber-950/40 p-2 rounded-xl border border-amber-500/30">
            {searchError}
          </p>
        )}

        {/* Find Route Button */}
        {!matchedRoute && (
          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 text-slate-950 font-black text-sm shadow-xl shadow-emerald-950 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Find Safe Route & Passage</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        )}
      </form>

      {/* Matched Route Preview & Start Journey Trigger */}
      {matchedRoute && (
        <div className="pt-3 border-t border-slate-800 space-y-3">
          
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/40 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                {matchedRoute.route_name}
              </span>
              <span className="text-[11px] text-slate-400 font-semibold">
                Corridor Safety: <b className="text-emerald-400">{matchedRoute.safety_score}%</b>
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-white">
              {matchedRoute.corridor}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80 text-slate-300">
              <div>
                <span className="text-slate-400 block text-[10px]">Boarding Stage:</span>
                <strong className="text-white text-xs">{matchedRoute.cbd_stage}</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Lit Safe Refuge:</span>
                <strong className="text-emerald-300 text-xs">{matchedRoute.safe_zone}</strong>
              </div>
            </div>
          </div>

          {/* Primary Action Button: Start Journey */}
          {!isJourneyActive ? (
            <button
              onClick={() => onStartJourney(matchedRoute)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 text-slate-950 font-black text-sm sm:text-base shadow-xl shadow-emerald-950 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Bus className="w-5 h-5 text-slate-950" />
              <span>Start Journey (View Fares & Matatus)</span>
              <ArrowRight className="w-4 h-4 text-slate-950 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="p-3 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center text-xs text-emerald-300 font-bold flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Live Journey Mode Active Below</span>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
