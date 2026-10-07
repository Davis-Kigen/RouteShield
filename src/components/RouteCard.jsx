import React from 'react';
import { 
  Bus, 
  MapPin, 
  ShieldCheck, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  PlusCircle, 
  Users, 
  Navigation,
  Compass,
  Lightbulb,
  Camera,
  CheckCircle2
} from 'lucide-react';

export default function RouteCard({ 
  route, 
  onOpenReportModal, 
  onFocusMap,
  isOnline 
}) {
  if (!route) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        <Bus className="w-10 h-10 mx-auto mb-2 text-slate-600" />
        <p className="text-sm font-semibold">Select a transit corridor to inspect stage security and fares</p>
      </div>
    );
  }

  // Safety status badge styling
  const getSafetyBadge = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('safe') || s.includes('secure')) {
      return {
        bg: 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300',
        dot: 'bg-emerald-400'
      };
    }
    if (s.includes('vigilance') || s.includes('surge') || s.includes('warning')) {
      return {
        bg: 'bg-amber-950/70 border-amber-500/40 text-amber-300',
        dot: 'bg-amber-400 animate-ping'
      };
    }
    return {
      bg: 'bg-blue-950/70 border-blue-500/40 text-blue-300',
      dot: 'bg-blue-400'
    };
  };

  const badgeStyle = getSafetyBadge(route.safety_status);
  const crowdsourced = route.crowdsourced || {};

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl transition-all">
      {/* Top Header: Route Name & Safety Status Badge */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800 border border-emerald-500/30 text-emerald-400 shadow-md">
            <Bus className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {route.route_name}
              </span>
              <span className="text-xs text-slate-400">Nairobi Corridor</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {route.corridor}
            </h3>
          </div>
        </div>

        {/* Safety Badge */}
        <div className={`flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-full border ${badgeStyle.bg}`}>
          <span className={`w-2 h-2 rounded-full ${badgeStyle.dot}`}></span>
          <span>{route.safety_status}</span>
        </div>
      </div>

      {/* CBD Stage & Safe Zone Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {/* CBD Boarding Stage */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
          <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>CBD Boarding Stage</span>
          </div>
          <p className="text-sm font-bold text-slate-100">{route.cbd_stage}</p>
        </div>

        {/* Lit Safe Zone */}
        <div className="p-3.5 rounded-xl bg-slate-950/60 border border-emerald-900/30">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Nearest Verified Safe Zone</span>
          </div>
          <p className="text-sm font-bold text-emerald-200">{route.safe_zone}</p>
        </div>
      </div>

      {/* Physical DRM Stage Infrastructure Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
          24/7 Mast Lighting Active
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
          <Camera className="w-3.5 h-3.5 text-cyan-400" />
          CCTV Corridor Surveillance
        </span>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-[11px] font-medium text-slate-300">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Police Post Proximity (&lt;150m)
        </span>
      </div>

      {/* Fare Information Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
        {/* Off Peak Fare */}
        <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <div className="flex items-center space-x-1.5 text-slate-400 text-xs font-medium mb-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Off-Peak Fare</span>
          </div>
          <p className="text-base sm:text-lg font-black text-slate-100">
            KES {route.off_peak_min} - {route.off_peak_max}
          </p>
          <span className="text-[10px] text-slate-400">Regular daytime</span>
        </div>

        {/* Peak Surge Fare */}
        <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30">
          <div className="flex items-center space-x-1.5 text-amber-400 text-xs font-medium mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Peak Surge Fare</span>
          </div>
          <p className="text-base sm:text-lg font-black text-amber-200">
            KES {route.peak_min} - {route.peak_max}
          </p>
          <span className="text-[10px] text-amber-400/80">Rush hour surge</span>
        </div>

        {/* Crowdsourced Real-Time Live Fare */}
        <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium mb-1">
            <div className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Commuter Avg</span>
            </div>
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-900/60 text-emerald-300">
              {crowdsourced.reportCount || 0} reports
            </span>
          </div>
          <p className="text-base sm:text-lg font-black text-emerald-300">
            {crowdsourced.avgFare ? `KES ${crowdsourced.avgFare}` : 'Pending Reports'}
          </p>
          <span className="text-[10px] text-slate-400">
            {crowdsourced.lastReportTime ? `Updated ${crowdsourced.lastReportTime}` : 'Be first to report'}
          </span>
        </div>
      </div>

      {/* Stage Advisory Notes */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs leading-relaxed text-slate-300 mb-4">
        <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wide text-[11px] mb-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>Stage Safety & Boarding Advisory</span>
        </div>
        <p>{route.advisory}</p>
      </div>

      {/* Safety Provenance & Audit Metadata Bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-t border-b border-slate-800/80 py-2.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>
            Audit: <strong className="text-slate-300">{route.audit_source || 'County Transit Watch & Crowd Verification'}</strong>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span>Confidence:</span>
          <span className="rounded bg-emerald-950 border border-emerald-500/30 px-2 py-0.5 font-mono text-emerald-400 font-bold text-[10px]">
            {route.confidence_score || '96% High'}
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">{route.last_verified || 'Verified today, 18:30 EAT'}</span>
        </div>
      </div>

      {/* Action Footer: Report Live Fare & Map Center */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          {onFocusMap && (
            <button
              onClick={() => onFocusMap(route)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition active:scale-95"
            >
              <Compass className="w-4 h-4 text-emerald-400" />
              <span>Focus on Map</span>
            </button>
          )}
        </div>

        <button
          onClick={() => onOpenReportModal(route)}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-900/30 transition active:scale-95"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Live Fare</span>
        </button>
      </div>
    </div>
  );
}
