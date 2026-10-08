import React from 'react';
import { 
  ShieldCheck, 
  Radio, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Zap, 
  Shield, 
  Bus,
  Search
} from 'lucide-react';

export default function HeroSection({
  onFindRoute,
  onOpenUssd,
  onOpenReportModal,
  totalRoutes = 5,
  isOnline = true
}) {
  return (
    <section id="top" className="relative overflow-hidden pt-6 pb-8 sm:pt-10 sm:pb-12 border-b border-zinc-800/80 bg-gradient-to-b from-slate-900/60 via-slate-950 to-slate-950">
      {/* Ambient background glow elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Top Ticker Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#09090b]/90 border border-emerald-500/40 text-xs font-semibold text-emerald-300 shadow-md backdrop-blur-md">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">Nairobi Transit Shield 2.0</span>
            <span className="text-zinc-500">•</span>
            <span className="text-zinc-300">Live Peak Surge Protection & Offline Routing</span>
          </div>

          <div className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#09090b]/80 border border-zinc-800 text-xs text-zinc-400 font-medium">
            <Radio className="w-3 h-3 text-emerald-400" />
            <span>USSD Fallback: <b className="text-white font-mono"></b></span>
          </div>
        </div>

        {/* Hero Title & Main Pitch */}
        <div className="text-center max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.15]">
            Commute <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">Safely & Transparently</span> Across Nairobi
          </h1>
          
          <p className="text-sm sm:text-lg md:text-xl text-zinc-300 font-medium leading-relaxed max-w-3xl mx-auto">
            Say goodbye to conductor surge extortion and dark stage alleys. RouteShield delivers 
            <strong className="text-emerald-400 font-semibold"> bounded peak fares</strong>, 
            <strong className="text-teal-300 font-semibold"> 24/7 floodlit safe zones</strong>, and an 
            <strong className="text-white font-semibold"> offline-ready PWA + USSD dialer</strong> that keeps you protected even with zero mobile data.
          </p>

          {/* Dual Call-To-Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 sm:pt-4">
            
          </div>
        </div>

        {/* Value Highlights Ticker Bar */}
        <div className="mt-8 sm:mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {/* Card 1 */}
          <div className="glass-card rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 mx-auto mb-1.5">
              <Bus className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">{totalRoutes} Core Corridors</div>
            <div className="text-[11px] text-zinc-400">Rongai, Thika, Waiyaki & more</div>
          </div>

          {/* Card 2 */}
          <div className="glass-card rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-teal-500/20 text-teal-400 mx-auto mb-1.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">Bounded Fares</div>
            <div className="text-[11px] text-zinc-400">Guards against rush hour surge</div>
          </div>

          {/* Card 3 */}
          <div className="glass-card rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 mx-auto mb-1.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">24/7 Lit Safe Zones</div>
            <div className="text-[11px] text-zinc-400">High-mast lights & police posts</div>
          </div>

          {/* Card 4 */}
          <div className="glass-card rounded-2xl p-3.5 text-center">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 mx-auto mb-1.5">
              <Zap className="w-4 h-4" />
            </div>
            <div className="text-base sm:text-lg font-black text-white">Zero-Data Ready</div>
            <div className="text-[11px] text-zinc-400">Offline PWA + </div>
          </div>
        </div>

      </div>
    </section>
  );
}
