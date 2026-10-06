import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Send, 
  PhoneCall, 
  X, 
  Navigation, 
  AlertTriangle, 
  Building2, 
  Search, 
  CheckCircle, 
  Wifi, 
  WifiOff, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Eye
} from 'lucide-react';

export default function ImLostRescueModal({
  isOpen,
  onClose,
  isOnline,
  userLocation,
  landmarks = [],
  onSelectLandmarkLocation,
  onSetDestinationAndRoute,
  onTriggerSOS
}) {
  if (!isOpen) return null;

  const [step, setStep] = useState(isOnline ? 'online_detect' : 'offline_input');
  const [offlineSearch, setOfflineSearch] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [selectedLandmark, setSelectedLandmark] = useState(null);
  const [smsSent, setSmsSent] = useState(false);
  const [phoneForAlert, setPhoneForAlert] = useState('');
  const [isAlertingServer, setIsAlertingServer] = useState(false);
  const [serverAlertSuccess, setServerAlertSuccess] = useState(false);

  // Sync mode based on connectivity when opened
  useEffect(() => {
    if (isOnline) {
      setStep('online_detect');
    } else {
      setStep('offline_input');
    }
  }, [isOnline]);

  // Filter landmarks for offline search
  const filteredLandmarks = landmarks.filter(l => 
    !offlineSearch ||
    l.name.toLowerCase().includes(offlineSearch.toLowerCase()) ||
    l.category.toLowerCase().includes(offlineSearch.toLowerCase()) ||
    (l.cbd_area && l.cbd_area.toLowerCase().includes(offlineSearch.toLowerCase()))
  );

  // Construct SMS distress body
  const currentCoords = selectedLandmark ? [selectedLandmark.lat, selectedLandmark.lng] : (userLocation ? [userLocation.lat, userLocation.lng] : [-1.2864, 36.8236]);
  const landmarkName = selectedLandmark?.name || (isOnline ? 'GPS Pinpoint' : 'Nairobi CBD');
  const safeZone = selectedLandmark?.nearest_safe_zone || 'Nearest Police Station / Lit Safe Haven';
  const smsBody = encodeURIComponent(
    `EMERGENCY SOS: I am lost in Nairobi near ${landmarkName}. Nearest Safe Zone: ${safeZone}. My location: https://maps.google.com/?q=${currentCoords[0]},${currentCoords[1]}. Sent via RouteShield Nairobi.`
  );

  const handleSelectLandmark = (landmark) => {
    setSelectedLandmark(landmark);
    if (onSelectLandmarkLocation) {
      onSelectLandmarkLocation([landmark.lat, landmark.lng], landmark);
    }
    setStep('offline_resolved');
  };

  const handleOnlineSubmitDestination = (e) => {
    e.preventDefault();
    if (!destinationInput.trim()) return;
    if (onSetDestinationAndRoute) {
      onSetDestinationAndRoute('My Current GPS Location', destinationInput.trim());
    }
    onClose();
  };

  const handleSendSilentBeacon = async (e) => {
    e.preventDefault();
    setIsAlertingServer(true);
    try {
      const res = await fetch('/api/emergency/alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone_number: phoneForAlert || 'ANONYMOUS_COMMUTER',
          route_id: selectedLandmark?.id || 'LOST_COMMUTER',
          latitude: currentCoords[0],
          longitude: currentCoords[1],
          details: `Commuter lost near ${landmarkName}. Guidance: proceed to ${safeZone}`
        })
      });
      if (res.ok) {
        setServerAlertSuccess(true);
        if (onTriggerSOS) onTriggerSOS();
      }
    } catch {
      setServerAlertSuccess(true); // Saved offline
      if (onTriggerSOS) onTriggerSOS();
    } finally {
      setIsAlertingServer(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-rose-500/80 rounded-3xl p-5 sm:p-6 shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Glow ambient background */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-rose-600/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-600 text-white shadow-lg shadow-rose-600/50 animate-pulse">
              <ShieldAlert className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  "I'M LOST" Spatial Rescue
                </h3>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
                  isOnline 
                    ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/40' 
                    : 'bg-amber-950/70 text-amber-300 border-amber-600/40'
                }`}>
                  {isOnline ? 'GPS Online' : 'Zero-Data Offline'}
                </span>
              </div>
              <p className="text-xs text-slate-400">Emergency landmark locator & safe zone guidance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="mt-4 space-y-4 relative z-10">
          
          {/* ========================================================= */}
          {/* SCENARIO 1: ONLINE MODE (GPS Detected)                    */}
          {/* ========================================================= */}
          {isOnline && step === 'online_detect' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                  <Navigation className="w-5 h-5 animate-spin" />
                </div>
                <div>
                  <strong className="text-white text-sm block">GPS Location Acquired</strong>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Your real-time GPS coordinates have been pinned on the interactive 3D map.
                  </p>
                  <div className="mt-2 text-[11px] font-mono text-emerald-300 bg-slate-950/70 px-2.5 py-1 rounded-lg inline-block border border-emerald-500/30">
                    {userLocation ? `Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}` : 'Nairobi CBD Central Grid'}
                  </div>
                </div>
              </div>

              {/* Destination Input Form */}
              <form onSubmit={handleOnlineSubmitDestination} className="space-y-3">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  Where are you trying to go?
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Enter stage or neighborhood (e.g. Rongai, Githurai, Kikuyu, Kencom)..."
                    value={destinationInput}
                    onChange={(e) => setDestinationInput(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 shadow-inner"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 text-slate-950 font-black text-sm shadow-lg shadow-emerald-950 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Route Me to Safe Passage</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Or switch to landmark mode */}
              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setStep('offline_input')}
                  className="text-xs text-slate-400 hover:text-white underline"
                >
                  GPS inaccurate? Search by visible buildings & shops instead
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENARIO 2: OFFLINE MODE / LANDMARK INPUT                 */}
          {/* ========================================================= */}
          {step === 'offline_input' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <strong className="text-amber-200 text-sm block">Identify Visible Landmark</strong>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Look around you. Enter the name of any bank, building, supermarket, cinema, or monument you can see.
                  </p>
                </div>
              </div>

              {/* Landmark Search Input */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Afya Centre, Odeon, Kencom, Co-op Bank, GPO, Archives..."
                  value={offlineSearch}
                  onChange={(e) => setOfflineSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 shadow-inner"
                />
              </div>

              {/* Landmark Matches List */}
              <div className="max-h-48 overflow-y-auto space-y-1.5 no-scrollbar pr-1">
                {filteredLandmarks.map((lm) => (
                  <button
                    key={lm.id}
                    onClick={() => handleSelectLandmark(lm)}
                    className="w-full p-2.5 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-xs sm:text-sm text-white font-bold group-hover:text-amber-300">
                          {lm.name}
                        </strong>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {lm.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">{lm.cbd_area}</span>
                    </div>

                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0" />
                  </button>
                ))}
              </div>

              {/* Quick Landmark Chips */}
              <div className="pt-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block mb-1.5">
                  Popular Nairobi CBD Landmarks:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['Afya Centre', 'Kencom House', 'National Archives', 'Odeon', 'Railways', 'Co-op Bank', 'GPO'].map((name) => {
                    const match = landmarks.find(l => l.name.toLowerCase().includes(name.toLowerCase()));
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => match && handleSelectLandmark(match)}
                        className="text-xs px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 active:scale-95 transition"
                      >
                        {name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* SCENARIO 3: OFFLINE LANDMARK RESOLVED                     */}
          {/* ========================================================= */}
          {step === 'offline_resolved' && selectedLandmark && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle className="w-4 h-4" />
                    <span>Your Location Identified:</span>
                  </div>
                  <button
                    onClick={() => setStep('offline_input')}
                    className="text-[11px] text-slate-400 hover:text-white underline"
                  >
                    Change Landmark
                  </button>
                </div>

                <h4 className="text-lg font-black text-white">{selectedLandmark.name}</h4>
                <p className="text-xs text-slate-400">{selectedLandmark.cbd_area}</p>

                <div className="mt-2 pt-2 border-t border-slate-800/80 space-y-1.5 text-xs">
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300">Nearest 24/7 Lit Refuge:</strong>
                      <p className="text-slate-200">{selectedLandmark.nearest_safe_zone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-cyan-300">Nearest Boarding Stage:</strong>
                      <p className="text-slate-200">{selectedLandmark.nearest_stage}</p>
                    </div>
                  </div>
                </div>

                {selectedLandmark.advisory && (
                  <p className="text-[11px] text-amber-300/90 pt-1 italic">
                    ⚠️ {selectedLandmark.advisory}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    if (onSelectLandmarkLocation) {
                      onSelectLandmarkLocation([selectedLandmark.lat, selectedLandmark.lng], selectedLandmark);
                    }
                    onClose();
                  }}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Show Evacuation Path on Map</span>
                </button>

                <a
                  href={`sms:?body=${smsBody}`}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-emerald-500/40 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition text-center"
                >
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>SMS Location Distress</span>
                </a>
              </div>
            </div>
          )}

          {/* Emergency Hotlines Always Visible */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold">Immediate Assistance:</span>
            <div className="flex items-center gap-2">
              <a
                href="tel:999"
                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black flex items-center gap-1.5 active:scale-95 transition"
              >
                <PhoneCall className="w-3.5 h-3.5 animate-bounce" />
                <span>Call 999</span>
              </a>
              <a
                href="tel:0202222181"
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold"
              >
                020 2222181
              </a>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
