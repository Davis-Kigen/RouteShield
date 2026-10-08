import React from 'react';
import { 
  WifiOff, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  PlusCircle, 
  Radio, 
  CheckCircle, 
  Phone, 
  Award, 
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  MapPin
} from 'lucide-react';

export default function ValueSections({ 
  onOpenReportModal, 
  onOpenUssd,
  onFindRoute 
}) {
  return (
    <div id="safety" className="py-12 sm:py-16 space-y-16 max-w-7xl mx-auto px-4 sm:px-6">
      
      {/* SECTION 1: Why RouteShield Over Traditional Maps (3-Column Feature Grid) */}
      <section id="why-routeshield" className="space-y-8">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Nairobi Commuter Advantage</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Why RouteShield Outclasses Traditional Navigation Apps
          </h2>
          <p className="text-zinc-400 text-xs sm:text-base leading-relaxed">
            Mainstream map services assume unlimited 5G data and ignore Nairobi matatu dynamics. 
            RouteShield was engineered directly for the streets of Nairobi CBD.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Offline-First PWA */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
              <WifiOff className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              1. Offline-First PWA Architecture
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Never get stranded when internet bundles deplete or signal drops along Waiyaki Way or Lang'ata. RouteShield caches OpenStreetMap tiles, transit stages, and safe zones directly into browser memory for 30-day persistence in airplane mode.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Zero data consumption on cached routes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>Auto-syncs offline reports when reconnected</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Bounded Peak Fare Intelligence */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              2. Bounded Peak Fare Intelligence
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Matatu conductors ruthlessly double or triple fares during sudden evening rain or rush hour gridlock. RouteShield provides verifiable off-peak bounds and peak surge ceilings, giving commuters bargaining power against extortion.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified NTSA & Sacco benchmark caps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Crowdsourced live stage fares in real time</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Emergency Safe-Zone Rerouting */}
          <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 space-y-4 relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30 shadow-lg shadow-rose-500/10">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-white">
              3. Emergency Safe-Zone Rerouting
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Standard GPS algorithms route pedestrians down dark, perilous alleys like Kirinyaga Rd or unlit railway lines. RouteShield routes you exclusively through 24/7 high-mast floodlit areas with active police posts and banking hall security.
            </p>
            <ul className="text-xs text-zinc-400 space-y-1.5 pt-2 border-t border-zinc-800">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>One-tap instant SMS location beacon</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Direct hotlines to Police 999 and County Dispatch</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* SECTION 2: Crowdsourced Fare Submission & Verification Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-950/80 via-slate-900 to-teal-950/80 border border-emerald-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          
          <div className="space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>Community-Driven Transit Defense</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Keep Nairobi Fares Fair — Report What You Paid Today
            </h3>
            <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
              Every fare entry logged by a commuter at Kencom, Odeon, or Railways recalibrates our live averages and prevents conductor overcharging. Anonymous, instantaneous, and offline-queued.
            </p>
            
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-zinc-400">
              <span className="flex items-center gap-1.5">
                <strong className="text-emerald-400 font-mono text-sm">180+</strong> Reports Today
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <strong className="text-white font-mono text-sm">KES 45</strong> Avg Commuter Savings
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <strong className="text-teal-400 font-mono text-sm">100%</strong> Anonymous
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            
      </section>

      {/* SECTION 4: Verified Nairobi Sacco Fleet Standards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
            Monitored Nairobi Sacco Fleet Networks:
          </span>
          <span className="text-[11px] text-emerald-400 font-semibold">
            Speed Governors & Passenger Manifest Compliant
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { name: 'Super Metro', corridor: 'Thika / Waiyaki / Ngong', rating: '4.9 ★' },
            { name: 'Rembo Shuttle', corridor: 'Lang\'ata / Ongata Rongai', rating: '4.8 ★' },
            { name: 'Metro Trans', corridor: 'Waiyaki / Kikuyu', rating: '4.8 ★' },
            { name: 'Forward Travellers', corridor: 'Outering / Embakasi', rating: '4.6 ★' },
            { name: 'KBS Express', corridor: 'City Center / Inter-CBD', rating: '4.7 ★' }
          ].map((sacco, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-[#09090b]/60 border border-zinc-800 text-center space-y-1 hover:border-zinc-700 transition"
            >
              <span className="text-xs font-black text-white block">{sacco.name}</span>
              <span className="text-[10px] text-zinc-400 block truncate">{sacco.corridor}</span>
              <span className="text-[10px] text-amber-400 font-bold font-mono">{sacco.rating} Safety</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
