import React from 'react';
import { 
  Bus, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Users, 
  Star, 
  PlusCircle, 
  Navigation, 
  CheckCircle,
  X,
  CreditCard,
  Building
} from 'lucide-react';

export default function ActiveJourneyHUD({
  route,
  onEndJourney,
  onOpenReportModal,
  onFocusSafeZone
}) {
  if (!route) return null;

  const crowdsourced = route.crowdsourced || {};
  const saccos = route.saccos || [];
  const timeline = route.timeline || [];
  const warnings = route.warnings || [
    "Board inside designated Sacco barricades after dusk.",
    "Verify conductor Sacco ID card before boarding."
  ];

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 shadow-2xl border-2 border-emerald-500/50 space-y-5 animate-fadeIn">
      
      {/* HUD Active Journey Header */}
      <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 font-black shadow-lg shadow-emerald-950">
            <Navigation className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950">
                Active Journey Mode
              </span>
              <span className="text-xs text-emerald-400 font-mono font-bold">
                {route.route_name}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white mt-0.5">
              {route.corridor}
            </h3>
          </div>
        </div>

        <button
          onClick={onEndJourney}
          className="p-2 rounded-xl bg-[#18181b] text-zinc-400 hover:text-white transition"
          title="End Journey & Return to Search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* 1. WHICH STAGE TO USE (Boarding Details) */}
      <div className="p-4 rounded-2xl bg-black/80 border border-zinc-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            <MapPin className="w-4 h-4" />
            <span>Designated Boarding Stage:</span>
          </div>
          <span className="text-[10px] text-zinc-400">Nairobi CBD</span>
        </div>
        <p className="text-base font-black text-white">{route.cbd_stage}</p>
        <p className="text-xs text-zinc-300">
          Walk to the boarding bay and queue in the designated lane.
        </p>
      </div>

      {/* 2. FARE CHARGES (Bounded Peak Surge Intelligence) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Verified Transit Fares:
          </span>
          <span className="text-[10px] text-amber-400 font-semibold">
            NTSA Extortion Cap Monitored
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Off Peak */}
          <div className="p-3.5 rounded-2xl bg-[#09090b]/90 border border-zinc-800 text-center">
            <div className="flex items-center justify-center gap-1 text-zinc-400 text-xs mb-1">
              <Clock className="w-3.5 h-3.5 text-zinc-400" />
              <span>Off-Peak Fare</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-white block">
              KES {route.off_peak_min} - {route.off_peak_max}
            </strong>
            <span className="text-[10px] text-zinc-500">Regular hours</span>
          </div>

          {/* Peak Surge Ceiling */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40 text-center">
            <div className="flex items-center justify-center gap-1 text-amber-400 text-xs mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
              <span>Peak Surge Cap</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-amber-300 block">
              KES {route.peak_min} - {route.peak_max}
            </strong>
            <span className="text-[10px] text-amber-400/80">Never pay above max</span>
          </div>

          {/* Live Commuter Avg */}
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-center">
            <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Avg Fare</span>
            </div>
            <strong className="text-lg sm:text-xl font-black text-emerald-300 block">
              {crowdsourced.avgFare ? `KES ${crowdsourced.avgFare}` : `KES ${route.off_peak_max}`}
            </strong>
            <span className="text-[10px] text-zinc-400">
              {crowdsourced.reportCount || 0} reports logged
            </span>
          </div>
        </div>
      </div>

      {/* 3. WHICH MATATU / BUS SACCO TO USE */}
      {saccos.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Which Matatu / Bus Sacco to Board:</span>
            <span className="text-[10px] text-emerald-400 font-semibold">Verified Fleets</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {saccos.map((sacco, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-black/90 border border-zinc-800 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <strong className="text-white text-sm font-bold">{sacco.name}</strong>
                    <span className="flex items-center gap-0.5 text-amber-400 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{sacco.safety_rating}</span>
                    </span>
                  </div>
                  <span className="text-xs text-zinc-400 block">{sacco.fleet_type}</span>
                </div>

                <div className="mt-2 pt-2 border-t border-zinc-800 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{sacco.pickup_bay}</span>
                  {sacco.cashless && (
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px]">
                      M-PESA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. VISUAL LANDMARKS & ROUTE SAFETY WARNINGS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Visual Landmarks */}
        <div className="p-3.5 rounded-2xl bg-black/70 border border-zinc-800 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px]">
            <Building className="w-4 h-4" />
            <span>Key Visual Landmarks on Path:</span>
          </div>
          <ul className="space-y-1 text-zinc-300">
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Start Landmark:</strong> {route.cbd_stage.split('/')[0]}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Corridor Safe Haven:</strong> {route.safe_zone.split('(')[0]}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Destination Landmark:</strong> {route.destination || 'Outer Terminus'}</span>
            </li>
          </ul>
        </div>

        {/* Safety Warnings & Guidelines */}
        <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Route Warnings & Guidelines:</span>
          </div>
          <p className="text-zinc-200 leading-relaxed">
            {route.advisory}
          </p>
          {warnings.length > 0 && (
            <div className="pt-1 text-[11px] text-amber-300/90 space-y-0.5">
              {warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span>⚠️</span>
                  <span>{w}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5. MULTIMODAL STEP-BY-STEP PROGRESS */}
      {timeline.length > 0 && (
        <div className="space-y-2.5 pt-2 border-t border-zinc-800">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-zinc-400">
            <span>Step-by-Step Multimodal Guidance:</span>
            <span className="text-[10px] text-emerald-400">Turn-by-Turn Safe Transit</span>
          </div>

          <div className="space-y-2">
            {timeline.map((step, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-black/80 border border-zinc-800 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-xs">
                    <strong className="text-white font-bold">{step.title}</strong>
                    {step.duration && (
                      <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        {step.duration}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">{step.instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-zinc-800">
        <button
          onClick={onFocusSafeZone}
          className="px-4 py-2.5 rounded-xl bg-[#18181b] hover:bg-slate-700 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Locate Safe Haven on 3D Map</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenReportModal(route)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-slate-950" />
            <span>Report What You Paid</span>
          </button>

          <button
            onClick={onEndJourney}
            className="px-4 py-2.5 rounded-xl bg-[#09090b] border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold transition active:scale-95 cursor-pointer"
          >
            <span>Finish Trip</span>
          </button>
        </div>
      </div>

    </div>
  );
}
