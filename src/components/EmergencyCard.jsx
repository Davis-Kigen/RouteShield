import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Send, 
  Phone, 
  AlertTriangle, 
  CheckCircle2, 
  Navigation, 
  Lightbulb, 
  X,
  Radio,
  Eye
} from 'lucide-react';

export default function EmergencyCard({ 
  currentRoute, 
  userCoords, 
  onClose,
  onFocusSafeZone 
}) {
  const [beaconStatus, setBeaconStatus] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Default to Route 125 safe zone or general CBD safe hub
  const safeZoneName = currentRoute?.safe_zone || 'Co-op Bank House / Green Park Walkway (Haile Selassie Ave)';
  const stageName = currentRoute?.cbd_stage || 'Railways Bus Station / Haile Selassie';

  // Construct SMS distress text
  const lat = userCoords?.lat || (currentRoute?.safe_zone_lat ?? -1.2905);
  const lng = userCoords?.lng || (currentRoute?.safe_zone_lng ?? 36.8242);
  const smsBody = encodeURIComponent(
    `ROUTE SHIELD ASSIST: I am navigating near ${stageName}. Heading toward lit Safe Haven: ${safeZoneName}. Location approx: https://maps.google.com/?q=${lat},${lng}. Sent via RouteShield Nairobi.`
  );

  const handleSendBeacon = async (e) => {
    e.preventDefault();
    if (!phoneInput.trim()) {
      setBeaconStatus({ type: 'error', message: 'Enter your phone number to signal the escort network.' });
      return;
    }

    setIsSubmitting(true);
    setBeaconStatus(null);

    try {
      const response = await fetch('/api/emergency', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneInput.trim(),
          route_id: currentRoute?.id || 'CBD_ACTIVE',
          latitude: lat,
          longitude: lng,
          details: `Direct Web Haven Beacon near ${stageName}`
        })
      });

      if (!response.ok) throw new Error('Network error logging beacon');

      setBeaconStatus({
        type: 'success',
        message: 'Discreet signal registered with CBD safety network. Keep moving toward the lit zone.'
      });
      setPhoneInput('');
    } catch (err) {
      setBeaconStatus({
        type: 'error',
        message: 'Could not reach server. Dial *384*123# immediately for zero-data offline SOS.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/95 border border-teal-500/30 p-6 shadow-2xl backdrop-blur-md transition-all duration-300">
      {/* Subtle Calming Ambience Accent */}
      <div className="absolute -top-16 -right-16 w-44 h-44 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner: Guardian Header */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 shadow-sm">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
                Guardian Escort Active
              </span>
              <span className="text-xs text-slate-400">Nairobi CBD Guard Net</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
              Verified Safe Haven Guide
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close safe haven guide"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safe Zone Highlight Box */}
      <div className="mt-4 bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2 text-teal-400 text-xs font-semibold uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nearest Lit & Guarded Haven</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-600/30 font-semibold">
            24/7 Guarded
          </span>
        </div>

        <p className="text-base font-bold text-slate-100 mb-1">
          {safeZoneName}
        </p>

        <p className="text-xs text-slate-400 mb-3">
          Corridor: {stageName}
        </p>

        {/* Physical Safety Features Checklist */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            High-Mast Floodlit
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            Active CCTV
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            Police Post Proximity (&lt;100m)
          </span>
        </div>

        {/* Primary Hero Action: Map Navigation */}
        {onFocusSafeZone && (
          <button
            onClick={onFocusSafeZone}
            className="mt-3.5 w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-teal-950/60 active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            Guide Me to Safe Zone on Live Map
          </button>
        )}
      </div>

      {/* Secondary Protective Actions: SMS & Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {/* SMS Broadcast Button */}
        <a
          href={`sms:?body=${smsBody}`}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 text-slate-200 hover:text-white font-semibold text-xs transition active:scale-95"
        >
          <Send className="w-3.5 h-3.5 text-teal-400" />
          <span>Share Location via SMS</span>
        </a>

        {/* Call Police Dispatch */}
        <a
          href="tel:999"
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/40 border border-slate-700/70 hover:border-rose-500/40 text-slate-200 hover:text-rose-200 font-semibold text-xs transition active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 text-rose-400" />
          <span>Call Police Dispatch (999)</span>
        </a>
      </div>

      {/* Discreet Web Beacon Signal Form */}
      <form onSubmit={handleSendBeacon} className="mt-4 bg-slate-950/60 rounded-2xl p-3 border border-slate-800">
        <label className="block text-[11px] font-semibold text-slate-300 mb-1.5">
          Request Silent Commuter Escort Signal:
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Your phone # (e.g. 0712345678)"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-teal-400 font-mono"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-teal-600 disabled:opacity-50 text-slate-200 hover:text-white text-xs font-bold rounded-lg border border-slate-700 hover:border-teal-500 transition shrink-0"
          >
            {isSubmitting ? 'Sending...' : 'Signal Haven'}
          </button>
        </div>

        {beaconStatus && (
          <div
            className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-2 ${
              beaconStatus.type === 'success'
                ? 'bg-teal-950/60 border border-teal-500/40 text-teal-300'
                : 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{beaconStatus.message}</span>
          </div>
        )}
      </form>

      {/* Practical Ground Protocol */}
      <p className="mt-3 text-[11px] text-slate-400 leading-normal">
        <strong className="text-slate-300">Safety Practice:</strong> Keep to continuous high-mast illumination. In case of sudden surge or darkness, proceed inside lit banking halls, petrol station lobbies, or manned security desks.
      </p>
    </div>
  );
}
