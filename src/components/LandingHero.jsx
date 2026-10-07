import React from 'react';
import { ArrowDown, PhoneCall } from 'lucide-react';

export default function LandingHero({ onExplore, onOpenUssd }) {
  return (
    <section className="relative bg-white pt-12 pb-14 sm:pt-16 sm:pb-20 border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-6">
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-black leading-[1.08] font-sans">
            Fair fares. <br />
            Safe stages <span className="underline decoration-yellow-400 decoration-4">after dark.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-600 leading-relaxed max-w-2xl font-normal">
            Real-time price caps and verified boarding points with streetlights, patrols, and CCTV across Nairobi. Available on the web or free via USSD.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-extrabold text-sm tracking-wide transition active:scale-95 flex items-center space-x-2 shadow-md"
            >
              <span>View Route Fares & Map</span>
              <ArrowDown className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenUssd}
              className="px-5 py-3.5 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono text-sm font-bold transition active:scale-95 flex items-center space-x-2.5 shadow-sm"
            >
              <PhoneCall className="w-4 h-4 text-black stroke-[2.5]" />
              <span>Dial *384*123# (Free)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-zinc-200">
          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">01 / Price Guard</div>
            <div className="text-black font-bold text-base mb-1">Peak & Off-Peak Limits</div>
            <p className="text-xs text-zinc-600 leading-normal">
              Official fare ranges so conductors cannot double prices during evening rush hours or rain.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">02 / Physical Safety</div>
            <div className="text-black font-bold text-base mb-1">Streetlit Boarding Zones</div>
            <p className="text-xs text-zinc-600 leading-normal">
              Verified stages under 24/7 high-mast streetlights, close to police posts and CCTV cameras.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-zinc-50 border border-zinc-200">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 mb-1">03 / Zero Data Required</div>
            <div className="text-black font-bold text-base mb-1">Kabambe USSD Support</div>
            <p className="text-xs text-zinc-600 leading-normal">
              Dial *384*123# on any mobile phone without an internet connection or airtime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
