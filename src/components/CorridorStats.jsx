import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Navigation, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { DEMO_CORRIDOR } from '../data/demoCorridor';

export default function CorridorStats() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-6">
      {/* Sacco Price Transparency Comparison */}
      <div className="lg:col-span-2 bg-white rounded-3xl border-2 border-black p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b-2 border-zinc-200">
            <div>
              <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-black text-yellow-400">
                FAIR FARE RADAR
              </span>
              <h3 className="text-base sm:text-lg font-black text-black mt-1">
                Lang'ata Corridor Operator Ceilings
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-zinc-500">Live 15m Sync</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {DEMO_CORRIDOR.saccos.map((sacco) => (
              <div 
                key={sacco.id} 
                className="rounded-2xl border-2 border-zinc-200 p-4 bg-zinc-50 hover:border-black transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-black text-sm">{sacco.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      Regulated
                    </span>
                  </div>

                  <p className="text-xs text-zinc-600 mb-3 font-medium">
                    {sacco.tagline}
                  </p>

                  <div className="space-y-1.5 text-xs font-mono bg-white p-2.5 rounded-xl border border-zinc-200">
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-bold">Standard Fare:</span>
                      <strong className="text-black">{sacco.off_peak}</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-zinc-500 font-bold">Peak Ceiling:</span>
                      <strong className="text-black bg-yellow-400/40 px-1 rounded">{sacco.peak_ceiling}</strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-zinc-200 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-600 font-semibold truncate">
                    Drop: <strong className="text-black">{sacco.cbd_stage.split('/')[0]}</strong>
                  </span>
                  <span className="text-zinc-500 text-[10px] font-bold">Fleet: {sacco.fleet_type.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-200 flex items-center gap-2 text-xs text-zinc-700 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
          <span>Fares monitored against commuter community alerts to prevent informal tout exploitation.</span>
        </div>
      </div>

      {/* Arrival Safe Walkway Guidance */}
      <div className="bg-white rounded-3xl border-2 border-black p-5 sm:p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b-2 border-zinc-200">
            <span className="text-[10px] font-mono font-black uppercase px-2 py-0.5 rounded bg-yellow-400 text-black">
              ARRIVAL DIRECTIVE
            </span>
            <span className="text-xs font-bold text-zinc-600">CBD Transit Hub</span>
          </div>

          <h3 className="text-base font-black text-black mt-2">
            Lit Safe-Zone Connection
          </h3>

          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
            Alighting at <strong>Railways Terminal</strong>? Follow the verified high-mast walkway:
          </p>

          <div className="mt-3 space-y-2">
            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-yellow-400 text-xs font-black flex items-center justify-center shrink-0">
                1
              </span>
              <span className="text-xs font-bold text-black">
                Stay on illuminated concourse toward Co-op Bank House.
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-yellow-400 text-xs font-black flex items-center justify-center shrink-0">
                2
              </span>
              <span className="text-xs font-bold text-black">
                Cross Haile Selassie at manned roundabout traffic post.
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-black text-yellow-400 text-xs font-black flex items-center justify-center shrink-0">
                3
              </span>
              <span className="text-xs font-bold text-black">
                Connect directly into continuous Moi Avenue street lighting.
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 rounded-2xl bg-yellow-400 border border-black flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />
          <p className="text-[11px] font-black text-black leading-tight">
            Avoid unlit shortcuts behind the station after 8:30 PM.
          </p>
        </div>
      </div>
    </div>
  );
}
