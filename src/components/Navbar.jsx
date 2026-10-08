import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function Navbar({ emergencyActive, onToggleEmergency,  }) {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-yellow-400 font-black text-sm shadow-sm">
            RS
          </div>
          <span className="text-lg font-bold tracking-tight text-black font-sans">
            Route<span className="text-zinc-500 font-normal">Shield</span>
          </span>
        </div>

        <div className="flex items-center space-x-3">
          

          <button
            onClick={onToggleEmergency}
            className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold tracking-wide transition ${
              emergencyActive
                ? 'bg-zinc-900 text-white'
                : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-sm'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{emergencyActive ? 'Close Guide' : 'Safe Stage Guide'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
