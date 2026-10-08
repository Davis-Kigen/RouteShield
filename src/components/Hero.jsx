import React from 'react';
import { ShieldCheck, Navigation, AlertTriangle, Eye, ArrowDown } from 'lucide-react';

export default function Hero({ onExploreCorridor, onOpenEmergency }) {
  return (
    <div className="relative overflow-hidden bg-white border-2 border-black rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl mb-6">
      {/* Background Accent Grid / Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-400 border border-black text-xs font-mono font-black uppercase text-black">
          <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
          Civic Transit Intelligence • Nairobi
        </div>
        <span className="text-xs font-mono font-bold text-zinc-500">
          Demo Route: Co-operative University ➔ CBD (Lang'ata Rd)
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Pitch Headline & Value Proposition */}
        <div className="lg:col-span-8 space-y-4">
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-black leading-[1.15]">
            Real-Time Wayfinding & Fare Transparency for Nairobi Commuters.
          </h1>
          <p className="text-sm sm:text-base text-zinc-700 font-medium max-w-2xl leading-relaxed">
            Standard navigation tools don’t recognize informal SACCO routes, peak fare surges, or unlit drop-off points. 
            <strong> RouteShield</strong> tracks verified matatu corridors, flags night caution stretches, and guarantees fair price ceilings.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExploreCorridor}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black hover:bg-zinc-800 text-yellow-400 font-black text-sm border-2 border-black shadow-lg transition active:scale-95"
            >
              <Navigation className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
              <span>Explore Live Corridor</span>
              <ArrowDown className="w-4 h-4 text-yellow-400" />
            </button>

            <button
              onClick={onOpenEmergency}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-sm border-2 border-black shadow-lg transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Verified Lit Safe Havens</span>
            </button>
          </div>
        </div>

        {/* Corridor Quick Metrics Card */}
        <div className="lg:col-span-4 bg-zinc-50 border-2 border-black rounded-2xl p-5 space-y-3.5 shadow-sm">
          <div className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 pb-2 border-b border-zinc-200">
            Active Corridor Telemetry
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700">Primary Operators</span>
            <span className="text-xs font-black text-black bg-zinc-200 px-2 py-0.5 rounded">Naboka & G-City</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700">Caution Checkpoint</span>
            <span className="text-xs font-black text-black bg-yellow-400/40 border border-yellow-500 px-2 py-0.5 rounded flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Lang'ata Cemetery
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-700">Destination Terminal</span>
            <span className="text-xs font-black text-black">Railways Bus Station</span>
          </div>

          <div className="pt-2 border-t border-zinc-200 flex items-center justify-between text-xs font-mono">
            <span className="text-zinc-500 font-bold">Price Protection:</span>
            <strong className="text-emerald-700 font-black">Capped at KES 100</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
