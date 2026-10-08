import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Server, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  Download, 
  ShieldAlert, 
  Radio, 
  Terminal, 
  ExternalLink, 
  X, 
  CheckCircle, 
  RefreshCw, 
  HelpCircle, 
  MapPin, 
  Bus, 
  Code, 
  AlertTriangle,
  FileText,
  DollarSign,
  Users,
  Compass,
  ChevronRight
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose, onDataUpdated }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('overview'); // overview | corridors | landmarks | alerts | developer_guide
  const [stats, setStats] = useState(null);
  const [corridors, setCorridors] = useState([]);
  const [landmarks, setLandmarks] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [overcharges, setOvercharges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // New corridor modal form state
  const [showAddCorridor, setShowAddCorridor] = useState(false);
  const [newCorridor, setNewCorridor] = useState({
    id: '',
    route_name: '',
    corridor: '',
    destination: '',
    cbd_stage: '',
    safe_zone: '',
    off_peak_min: 50,
    off_peak_max: 80,
    peak_min: 100,
    peak_max: 150,
    safety_score: 88,
    safety_status: 'Monitored Route',
    advisory: 'Standard passenger safety guidelines apply.',
    saccos_text: 'Super Metro, Rembo Shuttle',
    warnings_text: 'Board inside queue barricades. Avoid crossing unlit highways after 8 PM.'
  });

  // New landmark form state
  const [showAddLandmark, setShowAddLandmark] = useState(false);
  const [newLandmark, setNewLandmark] = useState({
    id: '',
    name: '',
    category: 'Commercial Hub',
    cbd_area: 'Central Business District',
    lat: -1.2864,
    lng: 36.8236,
    nearest_safe_zone: 'Central Police Station',
    nearest_stage: 'Kencom Stage',
    advisory: 'High foot-traffic corridor. Remain alert to snatchers.'
  });

  // Fetch admin overview and collections
  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [overviewRes, routesRes, landmarksRes] = await Promise.all([
        fetch('/api/admin/overview'),
        fetch('/api/routes'),
        fetch('/api/landmarks')
      ]);

      if (overviewRes.ok) {
        const overviewData = await overviewRes.json();
        setStats(overviewData.stats || {});
        setAlerts(overviewData.recentAlerts || []);
        setOvercharges(overviewData.recentOvercharges || []);
      }

      if (routesRes.ok) {
        const routesData = await routesRes.json();
        setCorridors(routesData);
      }

      if (landmarksRes.ok) {
        const landmarksData = await landmarksRes.json();
        setLandmarks(landmarksData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error connecting to backend Admin API.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const showToast = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Add new corridor
  const handleCreateCorridor = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...newCorridor,
        saccos: newCorridor.saccos_text.split(',').map(s => s.trim()).filter(Boolean),
        warnings: newCorridor.warnings_text.split('.').map(w => w.trim()).filter(Boolean),
        path_coords: [
          [-1.2864, 36.8236],
          [-1.2950, 36.8210],
          [-1.3200, 36.8000]
        ]
      };

      const res = await fetch('/api/admin/routes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Corridor ${newCorridor.route_name} created successfully!`);
        setShowAddCorridor(false);
        loadAdminData();
        if (onDataUpdated) onDataUpdated();
      } else {
        const err = await res.json();
        showToast(err.error || 'Failed to create corridor.', 'error');
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Delete corridor
  const handleDeleteCorridor = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete Corridor ${name} (${id})?`)) return;
    try {
      const res = await fetch(`/api/admin/routes/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast(`Corridor ${name} removed.`);
        loadAdminData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Add new landmark
  const handleCreateLandmark = async (e) => {
    e.preventDefault();
    try {
      const id = newLandmark.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const payload = { ...newLandmark, id };

      const res = await fetch('/api/admin/landmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showToast(`Landmark ${newLandmark.name} added to offline database!`);
        setShowAddLandmark(false);
        loadAdminData();
        if (onDataUpdated) onDataUpdated();
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  // Export JSON Database
  const handleExportData = async () => {
    try {
      const res = await fetch('/api/admin/export');
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `routeshield_dataset_backup_${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Database exported as JSON backup.');
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#09090b] border border-zinc-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-[#09090b]/90 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 text-slate-950 font-black shadow-md shadow-cyan-900/30">
              <Database className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white">RouteShield Developer & Admin Hub</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  SQLite Local Engine
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Manage transit corridors, offline landmarks, Africa's Talking USSD protocol, and database telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
        </div>

      </div>
    </div>
  );
}
