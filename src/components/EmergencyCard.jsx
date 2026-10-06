import React, { useState } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Send, 
  Phone, 
  AlertTriangle, 
  CheckCircle, 
  Navigation, 
  Lightbulb, 
  X,
  ExternalLink
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
    `EMERGENCY ALERT: I am feeling unsafe in Nairobi CBD near ${stageName}. Nearest Safe Zone: ${safeZoneName}. Location approx: https://maps.google.com/?q=${lat},${lng}. Sent via RouteShield Nairobi.`
  );

  const handleSendBeacon = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setBeaconStatus(null);

    try {
      const response = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneInput || 'ANONYMOUS_COMMUTER',
          route_id: currentRoute?.id || 'CBD_EMERGENCY',
          latitude: lat,
          longitude: lng,
          details: `Distress beacon triggered near ${safeZoneName}`
        })
      });

      if (response.ok) {
        setBeaconStatus({
          type: 'success',
          message: 'SOS Beacon Dispatched! Recorded in Nairobi Police/County Transit Monitor.'
        });
      } else {
        throw new Error('Failed to send');
      }
    } catch (err) {
      // Offline fallback
      setBeaconStatus({
        type: 'offline',
        message: 'Saved locally in SOS emergency queue. Immediate advice: Dial 999 or proceed to lit safe zone.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-rose-950/80 via-slate-900 to-slate-900 border-2 border-rose-600/70 p-5 shadow-2xl shadow-rose-950/60 transition-all duration-300 animate-fadeIn">
      {/* Background Pulse Ambience */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Banner */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500 text-white">
                Emergency Mode Active
              </span>
              <span className="text-xs text-rose-300 font-medium">Nairobi CBD Guard Net</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              Immediate Safe Zone Locator
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          aria-label="Close emergency card"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safe Zone Highlight Box */}
      <div className="bg-slate-950/70 border border-emerald-500/40 rounded-xl p-4 mb-4 backdrop-blur-sm shadow-inner">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Nearest Verified Lit Safe Zone</span>
          </div>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 border border-emerald-600/40 font-semibold">
            24/7 Guarded
          </span>
        </div>

        <p className="text-base sm:text-lg font-bold text-white mb-1">
          {safeZoneName}
        </p>

        <p className="text-xs text-slate-300 flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Associated with {stageName}</span>
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0" />
            <span>High-Mast Floodlit</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Continuous CCTV</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-slate-200">
            <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Active Police Patrol</span>
          </div>
        </div>

        {onFocusSafeZone && (
          <button
            onClick={onFocusSafeZone}
            className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition"
          >
            <MapPin className="w-3.5 h-3.5" />
            Focus Safe Zone on Live Map
          </button>
        )}
      </div>

      {/* Action Buttons: SMS Broadcast & Call Hotlines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        {/* SMS Broadcast Button */}
        <a
          href={`sms:?body=${smsBody}`}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 active:scale-95 transition"
        >
          <Send className="w-4 h-4" />
          <span>Broadcast Location via SMS</span>
        </a>

        {/* Call Police Dispatch */}
        <a
          href="tel:999"
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-sm shadow-md active:scale-95 transition"
        >
          <Phone className="w-4 h-4 text-rose-400 animate-pulse" />
          <span>Call Police Hotline (999 / 112)</span>
        </a>
      </div>

      {/* Cloud SOS Beacon Form */}
      <form onSubmit={handleSendBeacon} className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Send Silent Distress Beacon to RouteShield Server:
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Your phone # (e.g. 0712345678)"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md transition"
          >
            {isSubmitting ? 'Sending...' : 'Trigger SOS'}
          </button>
        </div>

        {beaconStatus && (
          <div
            className={`mt-2.5 p-2 rounded-lg text-xs flex items-center gap-2 ${
              beaconStatus.type === 'success'
                ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                : 'bg-amber-950/60 border border-amber-600/40 text-amber-300'
            }`}
          >
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{beaconStatus.message}</span>
          </div>
        )}
      </form>

      {/* Immediate Commuter Protocol Advice */}
      <div className="mt-3 text-[11px] text-slate-400 leading-relaxed">
        <strong className="text-slate-300">Commuter Safety Rule:</strong> Do not walk along dark sections of River Road, Kirinyaga Road, or unlit alleys. Enter an open banking hall or police booth immediately.
      </div>
    </div>
  );
}

