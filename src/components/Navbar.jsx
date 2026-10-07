import React from 'react';
import { Shield, Radio, ShieldAlert } from 'lucide-react';

export default function Navbar({
  emergencyActive,
  onToggleEmergency,
  onOpenUssd
}) {
  return (
    <header className="sticky top-0 z-40 bg-[#0d0e12]/95 backdrop-blur-xl border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-white">
            <Shield className="w-4 h-4 text-amber-400" />
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white font-sans">
            Route<span className="text-zinc-400 font-normal">Shield</span>
          </span>
        </div>

        {/* Global Controls */}
        <div className="flex items-center space-x-2.5">
          <button
            onClick={onOpenUssd}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-mono font-medium transition"
          >
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            <span>*384*123#</span>
          </button>

          <button
            onClick={onToggleEmergency}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition ${
              emergencyActive
                ? 'bg-zinc-800 text-zinc-100 border border-zinc-600'
                : 'bg-white hover:bg-zinc-100 text-zinc-950 shadow'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
            <span>{emergencyActive ? 'Close Guide' : 'Safe Haven Guide'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
