import React from 'react';
import { Shield, Phone, Radio, ExternalLink, Heart, AlertTriangle } from 'lucide-react';

export default function Footer({ onOpenUssd, onOpenReportModal }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-zinc-800/80 bg-black pt-12 pb-16 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Brand & Mission */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md">
                <Shield className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-lg font-black text-white">
                Route<span className="text-emerald-400">Shield</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed">
              Open Nairobi commuter protection, bounded peak fare telemetry, and spatial safe-zone routing built for Kenyan transit reality.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-400 font-semibold font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>PWA Offline Engine Active</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Transit Tools</h5>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => scrollTo('top')} className="hover:text-white transition">
                  Commuter Home
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('workspace')} className="hover:text-white transition">
                  Live Fare Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => scrollTo('safety')} className="hover:text-white transition">
                  24/7 Lit Safe Zones
                </button>
              </li>
              <li>
                <button onClick={onOpenReportModal} className="hover:text-emerald-400 transition">
                  Submit Crowdsourced Fare
                </button>
              </li>
              <li>
                <button onClick={onOpenUssd} className="hover:text-emerald-400 transition font-mono">
                  Dial USSD (*384*123#)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Emergency Contacts */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">24/7 Hotlines & Safety</h5>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center justify-between">
                <span>National Police:</span>
                <a href="tel:999" className="text-rose-400 hover:underline font-mono font-bold">999 / 112</a>
              </li>
              <li className="flex items-center justify-between">
                <span>Nairobi County Emergency:</span>
                <a href="tel:0202222181" className="text-zinc-200 hover:underline font-mono">020 2222181</a>
              </li>
              <li className="flex items-center justify-between">
                <span>Gender Violence Helpline:</span>
                <a href="tel:1195" className="text-amber-400 hover:underline font-mono font-bold">1195 (Toll Free)</a>
              </li>
              <li className="flex items-center justify-between">
                <span>St. John Ambulance:</span>
                <a href="tel:0721225285" className="text-zinc-200 hover:underline font-mono">0721 225 285</a>
              </li>
            </ul>
          </div>

          {/* Column 4: Innovation & Regulatory Disclaimers */}
          <div className="space-y-3">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">Innovation & Disclaimers</h5>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Developed as a transit safety and fair-fare initiative in collaboration with Cooperative University of Kenya (CUK) transit innovation researchers.
            </p>
            <p className="text-[11px] leading-relaxed text-zinc-400">
              Complies with NTSA commuter safety guidelines and Africa's Talking USSD protocol. Fares represent real-time commuter averages and standard Sacco tariffs.
            </p>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Telemetry */}
        <div className="pt-6 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-zinc-500">
          <div>
            &copy; {new Date().getFullYear()} RouteShield Nairobi Transit. Built for Kenyan Commuters.
          </div>
          <div className="flex items-center gap-3">
            <span>Workbox 30-Day OSM Cache</span>
            <span>•</span>
            <span>Africa's Talking Gateway (*384*123#)</span>
            <span>•</span>
            <span>SQLite WAL Engine</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
