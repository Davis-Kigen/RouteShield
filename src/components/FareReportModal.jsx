import React, { useState } from 'react';
import { X, CheckCircle, AlertCircle, TrendingUp, Bus, MapPin } from 'lucide-react';

export default function FareReportModal({
  isOpen,
  onClose,
  route,
  routes,
  onFareReported
}) {
  if (!isOpen) return null;

  const [selectedRouteId, setSelectedRouteId] = useState(route?.id || routes[0]?.id || '125');
  const [fareAmount, setFareAmount] = useState('');
  const [stageNote, setStageNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const activeRoute = routes.find(r => r.id === selectedRouteId) || route;

  const quickFares = [50, 70, 80, 100, 120, 150, 200];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fareAmount || isNaN(fareAmount) || parseInt(fareAmount, 10) <= 0) {
      setStatusMessage({ type: 'error', text: 'Please enter a valid fare amount.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    const payload = {
      route_id: selectedRouteId,
      reported_fare: parseInt(fareAmount, 10),
      stage_name: stageNote || activeRoute?.cbd_stage || 'Nairobi CBD Stage'
    };

    try {
      const res = await fetch('/api/fares/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Network error reporting fare');
      const data = await res.json();

      setStatusMessage({
        type: 'success',
        text: `Fare logged! Current average for ${activeRoute?.route_name}: KES ${data.averageFare}`
      });

      if (onFareReported) {
        onFareReported(selectedRouteId, payload.reported_fare, data.averageFare);
      }

      setTimeout(() => {
        onClose();
        setStatusMessage(null);
        setFareAmount('');
        setStageNote('');
      }, 1500);

    } catch (err) {
      // Offline fallback queuing
      console.warn('Backend unavailable, queuing report locally:', err);
      const pending = JSON.parse(localStorage.getItem('routeshield_pending_fares') || '[]');
      pending.push({ ...payload, created_at: new Date().toISOString() });
      localStorage.setItem('routeshield_pending_fares', JSON.stringify(pending));

      setStatusMessage({
        type: 'success',
        text: 'Saved offline! RouteShield will sync this report once network connection is restored.'
      });

      if (onFareReported) {
        onFareReported(selectedRouteId, payload.reported_fare);
      }

      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Live Matatu Fare</h3>
              <p className="text-xs text-slate-400">Crowdsource real-time rates for commuters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Corridor Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Nairobi Corridor:
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {routes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.route_name} - {r.corridor}
                </option>
              ))}
            </select>
          </div>

          {/* Current Stage Indicator */}
          {activeRoute && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Standard Stage: {activeRoute.cbd_stage}</span>
            </div>
          )}

          {/* Fare Amount Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Reported Fare (KES):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                KES
              </span>
              <input
                type="number"
                min="10"
                max="500"
                step="5"
                placeholder="e.g. 80"
                value={fareAmount}
                onChange={(e) => setFareAmount(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-14 pr-4 py-2.5 text-white font-bold text-base focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            {/* Quick Fare Presets */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {quickFares.map((amt) => (
                <button
                  type="button"
                  key={amt}
                  onClick={() => setFareAmount(amt.toString())}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition ${
                    fareAmount === amt.toString()
                      ? 'bg-emerald-600 text-white border-emerald-500 font-bold'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  KES {amt}
                </button>
              ))}
            </div>
          </div>

          {/* Stage / Operator Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Stage / Operator Notes (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Super Metro Bay 2, peak queue moving fast"
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/60 border border-emerald-600/40 text-emerald-300'
                  : 'bg-rose-950/60 border border-rose-600/40 text-rose-300'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-900/30 transition active:scale-95"
            >
              {isSubmitting ? 'Logging...' : 'Submit Live Fare'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

