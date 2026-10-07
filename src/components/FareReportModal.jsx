import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Coins, MapPin } from 'lucide-react';

export default function FareReportModal({
  isOpen = true,
  onClose,
  route,
  routes = [],
  onSuccess,
  onFareReported
}) {
  if (isOpen === false) return null;

  const routeList = routes.length > 0 ? routes : (route ? [route] : []);
  const [selectedRouteId, setSelectedRouteId] = useState(route?.id || routeList[0]?.id || '125');
  const [fareAmount, setFareAmount] = useState('');
  const [stageNote, setStageNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);

  const activeRoute = routeList.find((r) => r.id === selectedRouteId) || route;
  const quickFares = [50, 70, 80, 100, 120, 150, 200];

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
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
        text: `Fare logged! Current average for ${activeRoute?.route_name || 'Corridor'}: KES ${data.averageFare}`
      });

      if (onSuccess) onSuccess(payload.reported_fare, data.averageFare);
      if (onFareReported) onFareReported(selectedRouteId, payload.reported_fare, data.averageFare);

      setTimeout(() => {
        onClose();
        setStatusMessage(null);
        setFareAmount('');
        setStageNote('');
      }, 1500);

    } catch (err) {
      console.warn('Backend offline, queuing report locally:', err);
      const pending = JSON.parse(localStorage.getItem('routeshield_pending_fares') || '[]');
      pending.push({ ...payload, created_at: new Date().toISOString() });
      localStorage.setItem('routeshield_pending_fares', JSON.stringify(pending));

      setStatusMessage({
        type: 'success',
        text: 'Saved offline! RouteShield will sync automatically when back online.'
      });

      if (onSuccess) onSuccess(payload.reported_fare);
      if (onFareReported) onFareReported(selectedRouteId, payload.reported_fare);

      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1800);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white border-2 border-black rounded-3xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b-2 border-zinc-200">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-yellow-400 border border-black text-black">
              <Coins className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-black">Report Live Matatu Fare</h3>
              <p className="text-xs text-zinc-500">Crowdsource real-time prices for commuters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-black hover:bg-zinc-100 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Corridor Selection */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Select Nairobi Corridor:
            </label>
            <select
              value={selectedRouteId}
              onChange={(e) => setSelectedRouteId(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-black font-semibold focus:outline-none focus:border-black transition"
            >
              {routeList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.route_name} — {r.corridor}
                </option>
              ))}
            </select>
          </div>

          {/* Active Boarding Stage Info */}
          {activeRoute && (
            <div className="flex items-center gap-2 text-xs text-zinc-700 bg-zinc-100 p-2.5 rounded-xl border border-zinc-200">
              <MapPin className="w-4 h-4 text-black shrink-0" />
              <span>Standard CBD Stage: <strong className="text-black">{activeRoute.cbd_stage}</strong></span>
            </div>
          )}

          {/* Fare Amount Input */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Reported Fare (KES):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-sm">
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
                className="w-full bg-zinc-50 border-2 border-zinc-300 rounded-xl pl-14 pr-4 py-2.5 text-black font-black text-lg focus:outline-none focus:border-black transition"
                required
              />
            </div>

            {/* Quick Fare Pills */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {quickFares.map((amt) => {
                const isSelected = fareAmount === amt.toString();
                return (
                  <button
                    type="button"
                    key={amt}
                    onClick={() => setFareAmount(amt.toString())}
                    className={`text-xs px-3 py-1.5 rounded-lg font-bold border transition active:scale-95 ${
                      isSelected
                        ? 'bg-yellow-400 text-black border-black shadow-sm'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-300 hover:border-black hover:text-black'
                    }`}
                  >
                    KES {amt}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Stage / Operator Note */}
          <div>
            <label className="block text-xs font-bold text-zinc-800 mb-1.5">
              Stage Notes (Optional):
            </label>
            <input
              type="text"
              placeholder="e.g. Haile Selassie bay clear, matatus loading fast"
              value={stageNote}
              onChange={(e) => setStageNote(e.target.value)}
              className="w-full bg-zinc-50 border-2 border-zinc-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-black placeholder-zinc-400 focus:outline-none focus:border-black transition"
            />
          </div>

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 border-2 ${
                statusMessage.type === 'success'
                  ? 'bg-yellow-50 border-yellow-400 text-black'
                  : 'bg-zinc-100 border-black text-black'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-black" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-black" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Modal Action Buttons */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black text-xs font-bold border border-zinc-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 py-3 rounded-xl bg-black hover:bg-zinc-800 disabled:opacity-50 text-yellow-400 font-black text-xs uppercase tracking-wider transition active:scale-95 shadow-md"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Live Fare'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
