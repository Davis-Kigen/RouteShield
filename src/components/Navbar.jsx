import React from 'react';
import { Shield, ShieldAlert, PhoneCall, Wifi, WifiOff, Radio } from 'lucide-react';

export default function Navbar({
  isOnline,
  emergencyActive,
  onToggleEmergency,
  onOpenUssd
}) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
            <Shield className="w-6 h-6 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-black tracking-tight text-white">
                Route<span className="text-emerald-400">Shield</span>
              </h1>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 border border-emerald-500/30">
                NAIROBI
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Verified Safe Corridors & Fares
            </p>
          </div>
        </div>

        {/* Status Indicators & Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Online/Offline Badge */}
          <div
            className={`flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full font-medium border ${
              isOnline
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-700/50'
                : 'bg-amber-950/40 text-amber-300 border-amber-700/50'
            }`}
            title={isOnline ? 'Connected to live Nairobi transit server' : 'Offline mode active - using local cached data'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden xs:inline">ONLINE</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden xs:inline">OFFLINE MODE</span>
              </>
            )}
          </div>

          {/* USSD *384*123# Button */}
          <button
            onClick={onOpenUssd}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-semibold text-emerald-300 border border-emerald-500/30 shadow-sm"
            title="Dial USSD gateway for basic phones"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono tracking-wider">*384*123#</span>
          </button>

          {/* Emergency SOS Button */}
          <button
            onClick={onToggleEmergency}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 ${
              emergencyActive
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 ring-2 ring-amber-300 animate-bounce'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/50 hover:shadow-rose-600/30 ring-1 ring-rose-400/50'
            }`}
          >
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span className="uppercase">
              {emergencyActive ? 'Dismiss SOS' : "I'M LOST / UNSAFE AREA"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

