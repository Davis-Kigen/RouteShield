import React from 'react';
import { Shield, ShieldCheck, PhoneCall, Wifi, WifiOff, Radio } from 'lucide-react';

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
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                DRM Verified
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Verified Safe Corridors & Fares
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Online/Offline Status Indicator */}
          <div
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                : 'bg-amber-950/60 border-amber-600/50 text-amber-300'
            }`}
            title={isOnline ? 'Online mode active' : 'Offline cache mode active'}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Offline Cache</span>
              </>
            )}
          </div>

          {/* USSD *384*123# Button */}
          <button
            onClick={onOpenUssd}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-xs font-semibold text-emerald-300 border border-emerald-500/30 shadow-sm"
            title="Dial USSD gateway for zero-data access"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-mono tracking-wider">*384*123#</span>
          </button>

          {/* Guardian Safe Haven Guide Button */}
          <button
            onClick={onToggleEmergency}
            className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 ${
              emergencyActive
                ? 'bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/50'
                : 'bg-teal-600 hover:bg-teal-500 text-white shadow-teal-950/50 border border-teal-400/40'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>
              {emergencyActive ? 'Close Haven Guide' : 'Safe Haven Guide'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
