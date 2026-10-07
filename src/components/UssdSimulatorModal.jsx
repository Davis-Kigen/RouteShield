import React, { useState, useEffect, useRef } from 'react';
import { X, PhoneCall, RotateCcw, ShieldAlert, Radio } from 'lucide-react';

export default function UssdSimulatorModal({ isOpen, onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('+254700999888');
  const [sessionActive, setSessionActive] = useState(false);
  const [screenText, setScreenText] = useState('Dial *384*123# to initiate offline session');
  const [userInput, setUserInput] = useState('');
  const [inputHistory, setInputHistory] = useState([]);
  const [isEndSession, setIsEndSession] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (sessionActive && !isEndSession && inputRef.current) {
      inputRef.current.focus();
    }
  }, [sessionActive, isEndSession, screenText]);

  if (!isOpen) return null;

  const handleDial = async () => {
    setLoading(true);
    setSessionActive(true);
    setIsEndSession(false);
    setInputHistory([]);
    setUserInput('');

    try {
      const response = await fetch('/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          sessionId: `SIM_${Date.now()}`,
          serviceCode: '*384*123#',
          phoneNumber: phoneNumber,
          text: '',
        }),
      });

      const raw = await response.text();
      processResponse(raw);
    } catch (err) {
      setScreenText('END Gateway unreachable. Confirm backend is running on port 5000.');
      setIsEndSession(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!userInput.trim() || isEndSession || loading) return;

    setLoading(true);
    const updatedHistory = [...inputHistory, userInput.trim()];
    const textPayload = updatedHistory.join('*');

    try {
      const response = await fetch('/ussd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          sessionId: `SIM_${Date.now()}`,
          serviceCode: '*384*123#',
          phoneNumber: phoneNumber,
          text: textPayload,
        }),
      });

      const raw = await response.text();
      setInputHistory(updatedHistory);
      setUserInput('');
      processResponse(raw);
    } catch (err) {
      setScreenText('END Error transmitting USSD packet.');
      setIsEndSession(true);
    } finally {
      setLoading(false);
    }
  };

  const processResponse = (raw) => {
    if (raw.startsWith('CON ')) {
      setScreenText(raw.replace(/^CON\s*/, ''));
      setIsEndSession(false);
    } else if (raw.startsWith('END ')) {
      setScreenText(raw.replace(/^END\s*/, ''));
      setIsEndSession(true);
    } else {
      setScreenText(raw);
      setIsEndSession(true);
    }
  };

  const handleReset = () => {
    setSessionActive(false);
    setIsEndSession(false);
    setInputHistory([]);
    setUserInput('');
    setScreenText('Dial *384*123# to initiate offline session');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl border border-slate-700 bg-slate-950 p-6 shadow-2xl flex flex-col items-center">
        {/* Modal Topbar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">Offline USSD Protocol</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Feature Phone LCD Screen */}
        <div className="w-full mt-4 rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-inner min-h-[190px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 border-b border-slate-800/80 pb-1.5 mb-2">
            <span>SAFARICOM 2G/GSM</span>
            <span className="text-emerald-400 font-bold">*384*123#</span>
          </div>

          <pre className="font-mono text-xs text-emerald-300 whitespace-pre-wrap break-words leading-relaxed overflow-y-auto max-h-40 selection:bg-emerald-900">
            {loading ? 'Transmitting USSD packet...' : screenText}
          </pre>

          {sessionActive && !isEndSession && (
            <form onSubmit={handleSend} className="mt-3 flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Option (e.g. 1)"
                className="w-full rounded-lg bg-slate-950 border border-emerald-500/50 px-3 py-1.5 font-mono text-xs text-white focus:outline-none focus:border-emerald-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:opacity-50 transition"
              >
                Send
              </button>
            </form>
          )}
        </div>

        {/* Action Controls */}
        <div className="w-full mt-4 flex flex-col gap-2">
          {!sessionActive ? (
            <button
              onClick={handleDial}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 text-sm transition shadow-lg shadow-emerald-950/50"
            >
              <PhoneCall className="w-4 h-4" />
              Dial *384*123#
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2 text-xs transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Session
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-slate-500 px-1 mt-1">
            <span>MSISDN (Caller):</span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-transparent text-right font-mono text-[11px] text-slate-300 focus:outline-none focus:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
