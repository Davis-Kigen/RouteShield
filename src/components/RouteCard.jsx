import React from 'react';
import { 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Zap, 
  Coins, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink 
} from 'lucide-react';

export default function RouteCard({ 
  route, 
  onOpenReportModal, 
  onFocusMap, 
  isOnline 
}) {
  if (!route) return null;

  return (
    <div className="bg-[#121215] border border-zinc-800 rounded-2xl p-5 sm:p-6 text-zinc-200 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center space-x-2.5 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-100 font-mono text-xs font-bold border border-zinc-700">
              {route.route_name}
            </span>
            <span className="text-xs text-zinc-400 uppercase tracking-wider font-medium">
              Verified Corridor
            </span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {route.corridor}
          </h2>
        </div>

        {/* Safety Badge */}
        <div className="px-3 py-1 rounded-lg bg-zinc-900 border border-zinc-700 text-xs font-medium text-zinc-300 flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-300"></span>
          <span>{route.safety_status}</span>
        </div>
      </div>

      {/* Fare Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Off Peak */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 sm:p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
            Off-Peak Fare
          </div>
          <div className="text-xl sm:text-2xl font-bold text-white">
            KES {route.off_peak_min}–{route.off_peak_max}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Normal CBD transit flow</div>
        </div>

        {/* Peak Surge Ceiling */}
        <div className="bg-zinc-900/80 border border-zinc-800 p-3.5 sm:p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400/90 mb-1">
            Peak Ceiling Guard
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-200">
            KES {route.peak_min}–{route.peak_max}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Max allowable surge rate</div>
        </div>
      </div>

      {/* Primary Key Locations */}
      <div className="space-y-3">
        <div className="bg-zinc-900/50 border border-zinc-800/80 p-3.5 rounded-xl flex items-start space-x-3">
          <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-zinc-400 font-medium block mb-0.5">Boarding Stage (CBD)</span>
            <span className="text-zinc-200 font-semibold">{route.cbd_stage}</span>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800/80 p-3.5 rounded-xl flex items-start space-x-3">
          <ShieldAlert className="w-4 h-4 text-amber-400/80 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-zinc-400 font-medium block mb-0.5">Nearest Monitored Haven</span>
            <span className="text-zinc-200 font-semibold">{route.safe_zone}</span>
          </div>
        </div>
      </div>

      {/* Official Advisory */}
      {route.advisory && (
        <div className="p-3.5 rounded-xl bg-zinc-900/80 border-l-2 border-amber-500/70 text-xs text-zinc-300 leading-relaxed">
          <span className="text-amber-400/90 font-bold block mb-1 uppercase tracking-wider text-[10px]">
            Stage Advisory
          </span>
          {route.advisory}
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onFocusMap}
          className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold tracking-wide transition active:scale-95 text-center"
        >
          View On Map
        </button>

        <button
          onClick={onOpenReportModal}
          className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold tracking-wide transition active:scale-95 text-center shadow-md"
        >
          Report Live Fare
        </button>
      </div>
    </div>
  );
}
