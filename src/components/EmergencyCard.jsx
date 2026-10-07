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

  const safeZoneName = currentRoute?.safe_zone || 'Co-op Bank House / Green Park Walkway (Haile Selassie Ave)';
  const stageName = currentRoute?.cbd_stage || 'Railways Bus Station / Haile Selassie';

  const lat = userCoords?.lat || (currentRoute?.safe_zone_lat ?? -1.2905);
  const lng = userCoords?.lng || (currentRoute?.safe_zone_lng ?? 36.8242);
  const smsBody = encodeURIComponent(
    `ROUTE SHIELD ASSIST: I am near ${stageName}. Heading toward safe stage: ${safeZoneName}. Location: https://maps.google.com/?q=${lat},${lng}. Sent via RouteShield Nairobi.`
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
        message: 'Signal logged with CBD safety network. Keep moving toward the lit zone.'
      });
      setPhoneInput('');
    } catch (err) {
      setBeaconStatus({
        type: 'error',
        message: 'Server unreachable. Dial *384*123# immediately for zero-data offline SOS.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-black p-6 shadow-2xl transition-all duration-300">
      {/* Top Banner */}
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-zinc-200">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-400 text-black border border-black shadow-sm font-black">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-yellow-400">
                Guardian Net
              </span>
              <span className="text-xs text-zinc-600 font-bold">Nairobi CBD Commuter Safety</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-black mt-0.5">
              Verified Safe Haven Guide
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black border border-zinc-300 transition"
          aria-label="Close safe haven guide"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Safe Stage Highlight Box */}
      <div className="mt-4 bg-zinc-50 border-2 border-zinc-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-2 text-black text-xs font-black uppercase tracking-wider">
            <MapPin className="w-3.5 h-3.5" />
            <span>Nearest Streetlit & Guarded Haven</span>
          </div>
          <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-yellow-400 text-black border border-black font-extrabold">
            24/7 Monitored
          </span>
        </div>

        <p className="text-base font-black text-black mb-1">
          {safeZoneName}
        </p>

        <p className="text-xs text-zinc-600 font-medium mb-3">
          Corridor: {stageName}
        </p>

        {/* Physical Safety Features Checklist */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-zinc-800 font-bold text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-600 stroke-[2.5]" />
            High-Mast Floodlit
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-zinc-800 font-bold text-[11px]">
            <Eye className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            Active CCTV Coverage
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-zinc-800 font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            Police Post Proximity (&lt;100m)
          </span>
        </div>

        {/* Primary Action: Map Navigation */}
        {onFocusSafeZone && (
          <button
            onClick={onFocusSafeZone}
            className="mt-3.5 w-full py-3 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 border border-black transition shadow-sm active:scale-95"
          >
            <Navigation className="w-4 h-4 stroke-[2.5]" />
            Guide Me to Safe Stage on Map
          </button>
        )}
      </div>

      {/* Secondary Quick Dial Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <a
          href={`sms:?body=${smsBody}`}
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-bold text-xs transition active:scale-95"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Share Location via SMS</span>
        </a>

        <a
          href="tel:999"
          className="flex items-center justify-center space-x-2 py-2.5 px-3 rounded-xl bg-black hover:bg-zinc-800 border border-black text-yellow-400 font-black text-xs transition active:scale-95 shadow-sm"
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Call Police Dispatch (999)</span>
        </a>
      </div>

      {/* Discreet Web Beacon Signal Form */}
      <form onSubmit={handleSendBeacon} className="mt-4 bg-zinc-50 rounded-2xl p-3 border border-zinc-200">
        <label className="block text-[11px] font-bold text-zinc-800 mb-1.5">
          Request Silent Commuter Escort Signal:
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Your phone # (e.g. 0712345678)"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 bg-white border border-zinc-300 rounded-lg px-3 py-1.5 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-mono font-medium"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-3.5 py-1.5 bg-black hover:bg-zinc-800 disabled:opacity-50 text-white hover:text-yellow-400 text-xs font-black rounded-lg transition shrink-0"
          >
            {isSubmitting ? 'Sending...' : 'Signal Haven'}
          </button>
        </div>

        {beaconStatus && (
          <div
            className={`mt-2 p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 border ${
              beaconStatus.type === 'success'
                ? 'bg-yellow-50 border-yellow-400 text-black'
                : 'bg-zinc-100 border-black text-black'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <span>{beaconStatus.message}</span>
          </div>
        )}
      </form>

      {/* Practical Ground Protocol */}
      <p className="mt-3 text-[11px] text-zinc-600 leading-normal">
        <strong className="text-black font-bold">Safety Directive:</strong> Stick to continuous high-mast streetlights. In case of dark stretches, enter lit banking halls, 24/7 petrol station lobbies, or manned security desks along the avenue.
      </p>
    </div>
  );
}
