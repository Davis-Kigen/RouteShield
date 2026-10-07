import React, { useState, useEffect, useRef } from 'react';
import { X, PhoneCall, RotateCcw, Radio } from 'lucide-react';

export default function UssdSimulatorModal({ isOpen = true, onClose }) {
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

  if (isOpen === false) return null;

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
      setScreenText('END Service unavailable. Ensure backend server is running on port 5000.');
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

  const handleKeypadPress = (val) => {
    if (sessionActive && !isEndSession) {
      setUserInput((prev) => prev + val);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm rounded-3xl border-2 border-black bg-white p-6 shadow-2xl flex flex-col items-center">
        {/* Modal Topbar */}
        <div className="w-full flex items-center justify-between pb-3 border-b-2 border-zinc-200">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-black stroke-[2.5]" />
            <span className="text-xs font-black uppercase tracking-wider text-black">
              USSD Offline Terminal
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-black transition"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Vintage / High-Contrast Phone Screen */}
        <div className="w-full mt-4 rounded-2xl bg-zinc-950 border-2 border-black p-4 shadow-inner min-h-[190px] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800 pb-1.5 mb-2">
            <span>GSM 2G • KABAMBE</span>
            <span className="text-yellow-400 font-bold">*384*123#</span>
          </div>

          <pre className="font-mono text-xs text-white whitespace-pre-wrap break-words leading-relaxed overflow-y-auto max-h-40 selection:bg-yellow-400 selection:text-black">
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
                className="w-full rounded-lg bg-zinc-900 border border-zinc-700 px-3 py-1.5 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-yellow-400"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-yellow-400 px-3.5 py-1 text-xs font-black text-black hover:bg-yellow-300 disabled:opacity-50 transition shadow"
              >
                Send
              </button>
            </form>
          )}
        </div>

        {/* Feature Phone Number Pad */}
        <div className="w-full grid grid-cols-3 gap-2 mt-4 pt-2 border-t border-zinc-200">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleKeypadPress(key)}
              className="py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-mono font-bold text-sm border border-zinc-300 active:scale-95 transition text-center"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="w-full mt-4 flex flex-col gap-2">
          {!sessionActive ? (
            <button
              onClick={handleDial}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-black hover:bg-zinc-800 text-yellow-400 font-black py-3 text-sm transition shadow-lg active:scale-95"
            >
              <PhoneCall className="w-4 h-4 stroke-[2.5]" />
              <span>Dial *384*123# (Free)</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-black font-bold py-2.5 text-xs border border-zinc-300 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Session</span>
            </button>
          )}

          <div className="flex items-center justify-between text-[11px] text-zinc-500 px-1 mt-1 font-mono">
            <span>Caller MSISDN:</span>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="bg-transparent text-right font-mono text-[11px] text-zinc-800 font-bold focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
