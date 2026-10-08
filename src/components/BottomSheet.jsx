import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Bus, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  TrendingUp, 
  Users, 
  Footprints, 
  ArrowRight, 
  Star, 
  PlusCircle, 
  Radio, 
  AlertCircle,
  Shield,
  Compass,
  Navigation
} from 'lucide-react';

export default function BottomSheet({
  routes = [],
  selectedRoute,
  onSelectRoute,
  onOpenReportModal,
  onOpenUssd,
  onFocusMap,
  onFocusSafeZone,
  emergencyActive,
  onToggleEmergency
}) {
  // Snap states: 'collapsed' (approx 110px), 'half' (approx 48vh), 'full' (approx 86vh)
  const [snapState, setSnapState] = useState('collapsed');
  const [dragStartY, setDragStartY] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSacco, setSelectedSacco] = useState('ALL');

  const sheetRef = useRef(null);

  // Available saccos for current route
  const saccos = selectedRoute?.saccos || [];
  const crowdsourced = selectedRoute?.crowdsourced || {};
  const timeline = selectedRoute?.timeline || [];

  // Filter routes for quick pills
  const filteredRoutes = routes.filter(r => 
    !searchQuery || 
    r.route_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.corridor.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.destination && r.destination.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Touch Drag Handling
  const handleTouchStart = (e) => {
    setDragStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (dragStartY === null) return;
    const diff = dragStartY - e.changedTouches[0].clientY;
    setDragStartY(null);

    // If dragged UP significantly (> 40px)
    if (diff > 40) {
      if (snapState === 'collapsed') setSnapState('half');
      else if (snapState === 'half') setSnapState('full');
    } 
    // If dragged DOWN significantly (> 40px)
    else if (diff < -40) {
      if (snapState === 'full') setSnapState('half');
      else if (snapState === 'half') setSnapState('collapsed');
    }
  };

  // Height styles per snap state
  const getHeightClasses = () => {
    switch (snapState) {
      case 'collapsed':
        return 'h-[125px] sm:h-[135px]';
      case 'half':
        return 'h-[52vh] sm:h-[55vh]';
      case 'full':
        return 'h-[88vh] sm:h-[90vh]';
      default:
        return 'h-[125px]';
    }
  };

  return (
    <div
      ref={sheetRef}
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#09090b]/95 backdrop-blur-2xl border-t border-zinc-700/80 rounded-t-[2.2rem] shadow-2xl flex flex-col transition-all duration-300 ease-out select-none ${getHeightClasses()}`}
    >
      {/* Draggable Handle Bar & Header */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="w-full pt-3 pb-2 cursor-grab active:cursor-grabbing flex flex-col items-center shrink-0 border-b border-zinc-800/60"
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-600/80 hover:bg-slate-500 transition-colors mb-2" />
        
        <div className="w-full px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {selectedRoute?.route_name || 'Routes'}
            </span>
            <span className="text-xs font-bold text-white truncate max-w-[190px]">
              {selectedRoute?.destination || selectedRoute?.corridor || 'Nairobi Transit'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
}
