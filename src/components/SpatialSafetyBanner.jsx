import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  PhoneCall, 
  Send, 
  X, 
  Navigation, 
  AlertTriangle,
  Lightbulb,
  ArrowRight
} from 'lucide-react';

export default function SpatialSafetyBanner({
  safeZoneName,
  stageName,
  onFocusSafeZone,
  onDismiss,
  userCoords
}) {
  const lat = userCoords?.lat || -1.2905;
  const lng = userCoords?.lng || 36.8242;
  const smsBody = encodeURIComponent(
    `EMERGENCY ALERT: I am feeling unsafe in Nairobi CBD near ${stageName || 'CBD Stage'}. Nearest Safe Zone: ${safeZoneName}. My location: https://maps.google.com/?q=${lat},${lng}. RouteShield SOS.`
  );

  return (
    <div className="sticky top-14 sm:top-16 z-30 px-3 sm:px-6 py-2 w-full animate-fadeIn">
      <div className="max-w-7xl mx-auto rounded-2xl bg-gradient-to-r from-rose-950/95 via-red-900/90 to-rose-950/95 border-2 border-rose-500 shadow-2xl shadow-rose-950/80 backdrop-blur-xl p-3 sm:p-4 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          
          {/* Alert Description */}
          <div className="flex items-start gap-3">
            <div className="p-2 sm:p-2.5 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse shrink-0">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-rose-300 bg-rose-500/20 px-2 py-0.5 rounded border border-rose-400/30">
                  UKO MBALI MAZEE!
                </span>
                <span className="text-[11px] sm:text-xs text-rose-200 font-semibold hidden xs:inline">
                  Spatial Distress Rerouting Active
                </span>
              </div>
              <p className="text-xs sm:text-sm font-bold text-white leading-tight">
                Move directly to illuminated refuge: <span className="text-amber-300 underline underline-offset-2">{safeZoneName || 'Co-op Bank House / Green Park Walkway'}</span>
              </p>
              <p className="text-[11px] text-rose-200/90 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Follow the highlighted red dashed evacuation line on your map. Active 24/7 CCTV & armed patrol.</span>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center flex-wrap gap-2 w-full md:w-auto justify-end">
            {onFocusSafeZone && (
              <button
                onClick={onFocusSafeZone}
                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Follow Safe Path</span>
              </button>
            )}

            <a
              href={`sms:?body=${smsBody}`}
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>SMS GPS</span>
            </a>

            <a
              href="tel:999"
              className="px-3.5 py-1.5 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-black text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition"
            >
              <PhoneCall className="w-3.5 h-3.5 text-white animate-bounce" />
              <span>Call 999</span>
            </a>

            <button
              onClick={onDismiss}
              className="p-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
