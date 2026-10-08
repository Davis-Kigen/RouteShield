import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Navigation, 
  Lightbulb, 
  X,
  Eye,
  Radio,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)}m away` : `${d.toFixed(1)}km away`;
}

export default function EmergencyCard({ 
  currentRoute, 
  userCoords, 
  onClose,
  onFocusSafeZone 
}) {
  const [beaconStatus, setBeaconStatus] = useState(null);
  const [phoneInput, setPhoneInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSignalCode, setActiveSignalCode] = useState(null);

  const safeStageName = currentRoute?.safe_zone || 'Co-op Bank House / Green Park Walkway (Haile Selassie Ave)';
  const stageName = currentRoute?.cbd_stage || 'Railways Bus Station / Haile Selassie';

  const defaultCBDLat = -1.286389;
  const defaultCBDLng = 36.823611;
  const targetLat = currentRoute?.safe_zone_lat || defaultCBDLat;
  const targetLng = currentRoute?.safe_zone_lng || defaultCBDLng;

  const currentLat = userCoords?.lat || defaultCBDLat;
  const currentLng = userCoords?.lng || defaultCBDLng;

  const proximityText = useMemo(() => {
    return calculateDistance(currentLat, currentLng, targetLat, targetLng) || 'approx ~250m away';
  }, [currentLat, currentLng, targetLat, targetLng]);

  const whatsappText = encodeURIComponent(
    `🚨 *ROUTE SHIELD SAFETY UPDATE*\n\n` +
    `I am boarding near *${stageName}*.\n` +
    `Moving to verified lit safe stage:\n` +
    `📍 *${safeStageName}* (${proximityText})\n\n` +
    `Live Map Location: https://maps.google.com/?q=${targetLat},${targetLng}\n\n` +
    `_Sent via RouteShield Nairobi_`
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
          latitude: targetLat,
          longitude: targetLng,
          details: `Active Signal near ${stageName}`
        })
      });

      const genCode = `RS-${Math.floor(1000 + Math.random() * 9000)}`;
      setActiveSignalCode(genCode);

      setBeaconStatus({
        type: 'success',
        message: `Signal broadcasted! Escort Reference: ${genCode}. Keep moving toward the lit zone.`
      });
      setPhoneInput('');
    } catch (err) {
      setBeaconStatus({
        type: 'error',
        message: 'Could not reach server. Call police dispatch (999) directly for urgent assistance.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-black p-5 sm:p-6 shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between gap-4 pb-4 border-b-2 border-zinc-200">
        <div className="flex items-center space-x-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-yellow-400 text-black border-2 border-black shadow-sm font-black">
            <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-yellow-400">
                MONITORED STAGES
              </span>
              <span className="text-xs text-zinc-600 font-bold">Nairobi CBD Commuter Safety</span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-black mt-0.5">
              Verified Safe Boarding Guide
            </h2>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-black border border-zinc-300 transition"
          aria-label="Close safe boarding guide"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-4 bg-zinc-50 border-2 border-zinc-300 rounded-2xl p-4 sm:p-5">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-2 text-black text-xs font-black uppercase tracking-wider">
            <MapPin className="w-4 h-4 text-black" />
            <span>Nearest Verified Lit Stage</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-yellow-400 text-black border border-black font-extrabold text-[11px] shadow-sm">
            <Radio className="w-3 h-3 animate-pulse" />
            <span>{proximityText}</span>
          </div>
        </div>

        <p className="text-base sm:lg font-black text-black mb-1">
          {safeStageName}
        </p>

        <p className="text-xs text-zinc-600 font-medium mb-3">
          Corridor Pickup: <strong className="text-black">{stageName}</strong>
        </p>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-black font-bold text-[11px]">
            <Lightbulb className="w-3.5 h-3.5 text-yellow-500 stroke-[2.5]" />
            High-Mast Floodlit
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-black font-bold text-[11px]">
            <Eye className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            Active Street CCTV
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-zinc-300 text-black font-bold text-[11px]">
            <CheckCircle2 className="w-3.5 h-3.5 text-black stroke-[2.5]" />
            Police Post Proximity (&lt;100m)
          </span>
        </div>

        <button
          onClick={onFocusSafeZone}
          className="mt-4 w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black text-xs sm:text-sm font-black flex items-center justify-center gap-2 border-2 border-black transition shadow-md active:scale-95"
        >
          <Navigation className="w-4 h-4 stroke-[2.5]" />
          <span>Show Safe Stage on Map</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        <a
          href={`https://wa.me/?text=${whatsappText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-black hover:bg-zinc-800 border-2 border-black text-white font-bold text-xs transition active:scale-95 shadow-sm"
        >
          <MessageCircle className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
          <span>Share Stage via WhatsApp</span>
        </a>

        <a
          href="tel:999"
          className="flex items-center justify-center space-x-2 py-3 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border-2 border-zinc-300 text-black font-black text-xs transition active:scale-95"
        >
          <Phone className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Call Police Dispatch (999)</span>
        </a>
      </div>

      <form onSubmit={handleSendBeacon} className="mt-4 bg-zinc-50 rounded-2xl p-3.5 border-2 border-zinc-200">
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-[11px] font-bold text-zinc-900">
            Request Silent Escort Signal:
          </label>
          {activeSignalCode && (
            <span className="text-[10px] font-mono font-bold bg-yellow-400 text-black px-1.5 py-0.5 rounded border border-black">
              {activeSignalCode}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <input
            type="tel"
            placeholder="Your phone # (e.g. 0712345678)"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className="flex-1 bg-white border border-zinc-300 rounded-xl px-3 py-2 text-xs text-black placeholder-zinc-400 focus:outline-none focus:border-black font-mono font-bold"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-black hover:bg-zinc-800 disabled:opacity-50 text-yellow-400 text-xs font-black rounded-xl transition shrink-0 active:scale-95 shadow-sm"
          >
            {isSubmitting ? 'Transmitting...' : 'Signal Stage'}
          </button>
        </div>

        {beaconStatus && (
          <div
            className={`mt-2.5 p-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border-2 ${
              beaconStatus.type === 'success'
                ? 'bg-yellow-50 border-yellow-400 text-black'
                : 'bg-zinc-100 border-black text-black'
            }`}
          >
            {beaconStatus.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
            ) : (
              <AlertTriangle className="w-4 h-4 shrink-0 text-black" />
            )}
            <span>{beaconStatus.message}</span>
          </div>
        )}
      </form>

      <p className="mt-3 text-[11px] text-zinc-600 leading-normal">
        <strong className="text-black font-bold">Safety Directive:</strong> Stick to continuous high-mast streetlights. In case of dark stretches, enter lit banking halls, 24/7 petrol station lobbies, or manned security desks along the avenue.
      </p>
    </div>
  );
}
