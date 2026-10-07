import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Bus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  Footprints, 
  ArrowRight, 
  Star, 
  PlusCircle, 
  Radio, 
  AlertCircle,
  Shield,
  Compass,
  Navigation
} from 'lucide-react';

export default function BottomSheet({
  routes = [],
  selectedRoute,
  onSelectRoute,
  onOpenReportModal,
  onOpenUssd,
  onFocusMap,
  onFocusSafeZone,
  emergencyActive,
  onToggleEmergency
}) {
  // Snap states: 'collapsed' (approx 110px), 'half' (approx 48vh), 'full' (approx 86vh)
  const [snapState, setSnapState] = useState('collapsed');
  const [dragStartY, setDragStartY] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSacco, setSelectedSacco] = useState('ALL');

  const sheetRef = useRef(null);

  // Available saccos for current route
  const saccos = selectedRoute?.saccos || [];
  const crowdsourced = selectedRoute?.crowdsourced || {};
  const timeline = selectedRoute?.timeline || [];

  // Filter routes for quick pills
  const filteredRoutes = routes.filter(r => 
    !searchQuery || 
    r.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.corridor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.destination && r.destination.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Touch Drag Handling
  const handleTouchStart = (e) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (dragStartY === null) return;
    const diff = dragStartY - e.changedTouches[0].clientY;
    setDragStartY(null);

    // If dragged UP significantly (> 40px)
    if (diff > 40) {
      if (snapState === 'collapsed') setSnapState('half');
      else if (snapState === 'half') setSnapState('full');
    } 
    // If dragged DOWN significantly (> 40px)
    else if (diff < -40) {
      if (snapState === 'full') setSnapState('half');
      else if (snapState === 'half') setSnapState('collapsed');
    }
  };

  // Height styles per snap state
  const getHeightClasses = () => {
    switch (snapState) {
      case 'collapsed':
        return 'h-[125px] sm:h-[135px]';
      case 'half':
        return 'h-[52vh] sm:h-[55vh]';
      case 'full':
        return 'h-[88vh] sm:h-[90vh]';
      default:
        return 'h-[125px]';
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl border-t border-zinc-700/80 rounded-t-[2.2rem] shadow-2xl flex flex-col transition-all duration-300 ease-out select-none ${getHeightClasses()}`}
    >
      {/* Draggable Handle Bar & Header */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full pt-3 pb-2 cursor-grab active:cursor-grabbing flex flex-col items-center shrink-0 border-b border-zinc-800/60"
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-600/80 hover:bg-slate-500 transition-colors mb-2" />
        
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {selectedRoute?.route_name || 'Routes'}
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[190px]">
              {selectedRoute?.destination || selectedRoute?.corridor || 'Nairobi Transit'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                if (snapState === 'collapsed') setSnapState('half');
                else if (snapState === 'half') setSnapState('full');
                else setSnapState('collapsed');
              }}
              className="p-1 rounded-lg bg-[#18181b] text-zinc-300 hover:text-white"
            >
              {snapState === 'full' ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Snap State 1: Collapsed View Header Bar */}
      {snapState === 'collapsed' && (
        <div className="px-4 py-2 space-y-2 overflow-hidden flex-1 flex flex-col justify-center">
          {/* Quick Route Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {routes.map((r) => {
              const isSelected = selectedRoute?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRoute(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-400'
                      : 'bg-[#18181b]/90 text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {r.route_name} ({r.destination || r.corridor.split('(')[0].replace('CBD to ', '')})
                </button>
              );
            })}
          </div>

          {/* Nearest Safe Stage Badge */}
          <div 
            onClick={() => setSnapState('half')}
            className="flex items-center justify-between text-[11px] p-2 rounded-xl bg-black/80 border border-emerald-900/40 text-zinc-300 cursor-pointer"
          >
            <div className="flex items-center gap-1.5 truncate">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-emerald-300 font-bold truncate">Safe Hub:</span>
              <span className="truncate">{selectedRoute?.safe_zone}</span>
            </div>
            <span className="text-emerald-400 font-bold text-[10px] pl-2 shrink-0">Tap to Expand ↑</span>
          </div>
        </div>
      )}

      {/* Snap State 2 & 3: Half-Expanded and Full-Expanded Content */}
      {snapState !== 'collapsed' && (
        <div className="px-4 py-3 overflow-y-auto space-y-4 flex-1 overscroll-contain">
          
          {/* Search input to quickly jump between corridors */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stage or destination (e.g. Rongai, Githurai, Kikuyu)..."
              className="w-full bg-black border border-zinc-700/80 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Route Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {filteredRoutes.map((r) => {
              const isSelected = selectedRoute?.id === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => onSelectRoute(r)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-950 ring-2 ring-emerald-400'
                      : 'bg-[#18181b] text-zinc-300 border border-zinc-700'
                  }`}
                >
                  {r.route_name}
                </button>
              );
            })}
          </div>

          {/* Fare Comparison Grid (Off-Peak vs Peak Surge vs Live Avg) */}
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-black border border-zinc-800 text-center">
              <span className="text-[10px] text-zinc-400 font-medium block">Off-Peak</span>
              <strong className="text-xs sm:text-sm text-white font-black block mt-0.5">
                KES {selectedRoute?.off_peak_min}-{selectedRoute?.off_peak_max}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/40 text-center">
              <span className="text-[10px] text-amber-300 font-medium block">Peak Cap</span>
              <strong className="text-xs sm:text-sm text-amber-300 font-black block mt-0.5">
                KES {selectedRoute?.peak_min}-{selectedRoute?.peak_max}
              </strong>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-center">
              <span className="text-[10px] text-emerald-300 font-medium block">Live Avg</span>
              <strong className="text-xs sm:text-sm text-emerald-300 font-black block mt-0.5">
                {crowdsourced.avgFare ? `KES ${crowdsourced.avgFare}` : 'KES --'}
              </strong>
            </div>
          </div>

          {/* Sacco Operator List */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <span>Verified Saccos on Corridor</span>
              <span className="text-[10px] text-emerald-400 font-medium">Speed Governed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {saccos.map((sacco, idx) => (
                <div 
                  key={idx}
                  className="p-2.5 rounded-xl bg-black/70 border border-zinc-800 flex items-center justify-between text-xs"
                >
                  <div>
                    <div className="flex items-center gap-1.5">
                      <strong className="text-white">{sacco.name}</strong>
                      <span className="text-[10px] text-amber-400 font-bold flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                        <span>{sacco.safety_rating}</span>
                      </span>
                    </div>
                    <span className="text-[10px] text-zinc-400 block">{sacco.pickup_bay}</span>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {sacco.cashless ? 'M-PESA' : 'CASH'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onOpenReportModal(selectedRoute)}
              className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Report Live Fare</span>
            </button>

            <button
              onClick={onFocusSafeZone}
              className="py-2.5 px-3 rounded-xl bg-[#18181b] hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Focus Safe Zone</span>
            </button>
          </div>

          {/* Snap State 3: Full-Expanded Multimodal Journey Timeline */}
          {snapState === 'full' && (
            <div className="pt-2 border-t border-zinc-800 space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-300">
                <div className="flex items-center gap-1.5 text-emerald-400">
                  <Navigation className="w-4 h-4" />
                  <span>Multimodal Journey Timeline</span>
                </div>
                <span className="text-[10px] text-zinc-400">Step-by-Step Safe Guide</span>
              </div>

              {/* Timeline steps */}
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-700">
                {timeline.map((step, idx) => (
                  <div key={idx} className="relative">
                    {/* Step indicator dot */}
                    <div className="absolute -left-6 top-0.5 w-4 h-4 rounded-full bg-[#09090b] border-2 border-emerald-400 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    </div>

                    <div className="bg-black/80 p-3 rounded-xl border border-zinc-800/90 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <strong className="text-white font-bold">{step.title}</strong>
                        {step.duration && (
                          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            {step.duration} {step.distance ? `• ${step.distance}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-300 leading-relaxed">
                        {step.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Full Stage Advisory */}
              <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 text-xs text-zinc-300 leading-relaxed">
                <strong className="text-amber-400 font-bold block mb-1">
                  Stage Vigilance Note:
                </strong>
                <p>{selectedRoute?.advisory}</p>
              </div>

              {/* Safe Zone Detailed Features */}
              <div className="p-3 rounded-xl bg-black border border-emerald-600/30 text-xs space-y-2">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified 24/7 Lit Safe Haven:</span>
                </div>
                <p className="text-white font-semibold">{selectedRoute?.safe_zone}</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px] text-emerald-300">
                  <span>✓ Continuous CCTV</span>
                  <span>✓ 24/7 Police Patrol</span>
                  <span>✓ High-Mast Floodlight</span>
                  <span>✓ Emergency Radio Net</span>
                </div>
              </div>

              {/* Emergency Hotline Quick Call */}
              <div className="pt-2 flex gap-2">
                <a
                  href="tel:999"
                  className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-black text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow-lg shadow-rose-950"
                >
                  <span>Police Hotline (999)</span>
                </a>
                <button
                  onClick={onOpenUssd}
                  className="px-4 py-2.5 rounded-xl bg-[#18181b] text-emerald-300 border border-emerald-500/30 font-bold text-xs flex items-center gap-1.5 active:scale-95"
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>*384*123#</span>
                </button>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
