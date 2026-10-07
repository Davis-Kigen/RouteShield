import React from 'react';
import { MapPin, ShieldCheck } from 'lucide-react';

export default function RouteCard({ route, onOpenReportModal, onFocusMap }) {
  if (!route) return null;

  return (
    <div className="bg-white border-2 border-zinc-900 rounded-2xl p-6 text-zinc-900 shadow-xl space-y-5 h-full flex flex-col justify-between">
      <div className="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-zinc-200">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-md bg-yellow-400 text-black font-mono text-xs font-extrabold">
              {route.route_name}
            </span>
            <span className="text-xs text-zinc-500 uppercase tracking-wider font-bold">
              Nairobi Transit Corridor
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-black tracking-tight">
            {route.corridor}
          </h2>
        </div>

        <div className="px-3 py-1 rounded-lg bg-zinc-100 border border-zinc-200 text-xs font-bold text-zinc-700 flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
          <span>{route.safety_status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 mb-1 font-bold">
            Off-Peak Fare
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            KES {route.off_peak_min}–{route.off_peak_max}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Normal daily hours</div>
        </div>

        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-xl">
          <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-800 mb-1 font-bold">
            Peak Ceiling
          </div>
          <div className="text-2xl sm:text-3xl font-black text-black">
            KES {route.peak_min}–{route.peak_max}
          </div>
          <div className="text-[11px] text-zinc-600 mt-1 font-medium">Maximum surge rate</div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl flex items-start space-x-3">
          <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-zinc-500 font-semibold block mb-0.5">CBD Boarding Stage</span>
            <span className="text-black font-bold text-sm">{route.cbd_stage}</span>
          </div>
        </div>

        <div className="bg-zinc-50 border border-zinc-200 p-3.5 rounded-xl flex items-start space-x-3">
          <ShieldCheck className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="text-zinc-500 font-semibold block mb-0.5">Nearest Lit Safe Stage</span>
            <span className="text-black font-bold text-sm">{route.safe_zone}</span>
          </div>
        </div>
      </div>

      {route.advisory && (
        <div className="p-4 rounded-xl bg-zinc-50 border-l-4 border-yellow-400 text-xs text-zinc-800 leading-relaxed">
          <span className="text-black font-bold block mb-1 uppercase tracking-wider text-[10px]">
            Stage Advisory
          </span>
          {route.advisory}
        </div>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={onFocusMap}
          className="flex-1 py-3 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300 text-xs font-bold tracking-wide transition active:scale-95 text-center"
        >
          View On Map
        </button>

        <button
          onClick={onOpenReportModal}
          className="flex-1 py-3 px-4 rounded-xl bg-black hover:bg-zinc-800 text-yellow-400 text-xs font-black tracking-wide transition active:scale-95 text-center shadow-sm"
        >
          Report Live Fare
        </button>
      </div>
    </div>
  );
}
