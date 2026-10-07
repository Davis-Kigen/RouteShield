import React from 'react';
import { Shield, Radio, ArrowDown, MapPin, Sparkles, Lock } from 'lucide-react';

export default function LandingHero({ onExplore, onOpenUssd }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-zinc-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Nairobi Commuter Resilience Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans">
            Predictable fares. <br />
            Verified safe stages after dark.
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 leading-relaxed font-normal max-w-2xl">
            RouteShield protects daily Nairobi commuters from arbitrary peak surge pricing and unlit boarding risks. Sourced across major corridors, accessible online or completely offline via USSD.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onExplore}
              className="px-6 py-3 rounded-xl bg-white hover:bg-zinc-100 text-zinc-950 font-bold text-sm tracking-wide transition active:scale-95 flex items-center space-x-2 shadow-lg"
            >
              <span>Explore Corridors</span>
              <ArrowDown className="w-4 h-4 text-zinc-900" />
            </button>

            <button
              onClick={onOpenUssd}
              className="px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 font-mono text-sm font-semibold transition active:scale-95 flex items-center space-x-2"
            >
              <Radio className="w-4 h-4 text-amber-400" />
              <span>Dial *384*123# (Zero Data)</span>
            </button>
          </div>
        </div>

        {/* 3 Pillar Value Propositions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-12 pt-8 border-t border-zinc-800/60">
          <div className="space-y-1.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70">
            <div className="text-amber-400 font-bold text-sm font-mono">01. Surge Ceiling</div>
            <div className="text-white font-semibold text-sm">Anti-Gouging Caps</div>
            <p className="text-xs text-zinc-400 leading-normal">
              Verified fare corridors so conductors cannot arbitrarily hike prices when rain strikes.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70">
            <div className="text-amber-400 font-bold text-sm font-mono">02. Safe Havens</div>
            <div className="text-white font-semibold text-sm">Illuminated Boarding</div>
            <p className="text-xs text-zinc-400 leading-normal">
              24/7 floodlit pickup zones anchored near police booths and CCTV coverage.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/70">
            <div className="text-amber-400 font-bold text-sm font-mono">03. Dual Channel</div>
            <div className="text-white font-semibold text-sm">Inclusive USSD Dial</div>
            <p className="text-xs text-zinc-400 leading-normal">
              Works instantly on basic feature phones (Kabambe) with no active data bundles.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
