import React, { useState, useRef } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MapView from './components/MapView';
import CorridorStats from './components/CorridorStats';
import EmergencyCard from './components/EmergencyCard';
import { Info } from 'lucide-react';

export default function App() {
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const mapSectionRef = useRef(null);

  const handleScrollToMap = () => {
    if (mapSectionRef.current) {
      mapSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-black flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar onOpenEmergency={() => setIsEmergencyOpen(true)} />

      {/* Main Pitch & Demo Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col">
        
        {/* 1. Hero Pitch Section */}
        <Hero 
          onExploreCorridor={handleScrollToMap}
          onOpenEmergency={() => setIsEmergencyOpen(true)}
        />

        {/* 2. Interactive Map & Live Simulation */}
        <section ref={mapSectionRef} className="w-full mb-6">
          <MapView />
        </section>

        {/* 3. Fair Fare Radar & Safe Walkway Guidance */}
        <section className="w-full mb-6">
          <CorridorStats />
        </section>

        {/* Commuter Directives Footer */}
        <footer className="bg-white rounded-2xl border-2 border-black p-4 text-xs font-medium text-zinc-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-auto">
          <div className="flex items-center gap-2 text-black font-bold">
            <Info className="w-4 h-4 text-yellow-500 stroke-[2.5] shrink-0" />
            <span>Nairobi Civic Transit Safety Initiative: Monitored with CUK Commuter Registry.</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-500">RouteShield v2.4 (Live Web Engine)</span>
        </footer>
      </main>

      {/* Emergency / Safe Stage Guidance Modal */}
      {isEmergencyOpen && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <EmergencyCard 
              onClose={() => setIsEmergencyOpen(false)}
              onFocusSafeZone={() => setIsEmergencyOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
