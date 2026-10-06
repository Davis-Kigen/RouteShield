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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
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
              <p className="text-xs text-slate-400">
                Manage transit corridors, offline landmarks, Africa's Talking USSD protocol, and database telemetry.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportData}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition"
              title="Download entire database as JSON"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Export JSON</span>
            </button>
            <button
              onClick={loadAdminData}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Refresh telemetry"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toast Notification */}
        {notification && (
          <div className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between ${
            notification.type === 'error' ? 'bg-rose-950/80 text-rose-300 border-b border-rose-800' : 'bg-emerald-950/80 text-emerald-300 border-b border-emerald-800'
          }`}>
            <span>{notification.msg}</span>
            <button onClick={() => setNotification(null)} className="text-xs underline ml-2">Dismiss</button>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-slate-900/60 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>Overview & Telemetry</span>
          </button>
          <button
            onClick={() => setActiveTab('corridors')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'corridors'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bus className="w-3.5 h-3.5" />
            <span>Transit Corridors ({corridors.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('landmarks')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'landmarks'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Landmarks & Safe Havens ({landmarks.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'alerts'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>Live SOS Dispatches ({alerts.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('developer_guide')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'developer_guide'
                ? 'border-emerald-400 text-emerald-300 bg-slate-800/60'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3.5 h-3.5 text-cyan-400" />
            <span>Developer & Dataset Guide</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stat Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Corridors</span>
                  <p className="text-2xl font-black text-white mt-1">{stats?.totalRoutes ?? corridors.length}</p>
                  <span className="text-[10px] text-emerald-400">Arterials mapped</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Landmarks</span>
                  <p className="text-2xl font-black text-cyan-400 mt-1">{stats?.totalLandmarks ?? landmarks.length}</p>
                  <span className="text-[10px] text-cyan-300">Offline rescue pins</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Fare Reports</span>
                  <p className="text-2xl font-black text-amber-400 mt-1">{stats?.totalReports ?? 0}</p>
                  <span className="text-[10px] text-amber-300">Crowdsourced fares</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">SOS Alerts</span>
                  <p className="text-2xl font-black text-rose-400 mt-1">{stats?.totalAlerts ?? alerts.length}</p>
                  <span className="text-[10px] text-rose-300">Active rescue logs</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">USSD Users</span>
                  <p className="text-2xl font-black text-emerald-400 mt-1">{stats?.totalSubscribers ?? 1}</p>
                  <span className="text-[10px] text-emerald-300">Enrolled phones</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                  <span className="text-[11px] text-slate-400 uppercase font-semibold">Overcharges</span>
                  <p className="text-2xl font-black text-purple-400 mt-1">{stats?.totalOvercharges ?? overcharges.length}</p>
                  <span className="text-[10px] text-purple-300">Conductor flags</span>
                </div>
              </div>

              {/* Data Ingestion Status Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <h3 className="text-sm font-bold text-white">RouteShield Production Database Status</h3>
                  </div>
                  <p className="text-xs text-slate-300">
                    Database: <code className="font-mono text-cyan-300">backend/routeshield.db</code> (SQLite 3 WAL Mode).
                    Supports concurrent Africa's Talking USSD sessions, real-time Web PWA requests, and offline sync reconciliation.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('corridors')}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition"
                  >
                    Add Transit Route
                  </button>
                  <button
                    onClick={() => setActiveTab('developer_guide')}
                    className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs transition"
                  >
                    Read Dev Architecture
                  </button>
                </div>
              </div>

              {/* Live Alerts Stream */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Recent Emergency SOS Dispatches</span>
                </h4>
                {alerts.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    No active SOS dispatches logged yet. The distress beacon is operational.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {alerts.slice(0, 5).map((alert, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950/80 border border-rose-900/40 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 font-mono text-[10px] font-bold border border-rose-700">
                            SOS #{alert.id}
                          </span>
                          <div>
                            <span className="font-bold text-white">{alert.phone_number}</span>
                            <span className="text-slate-400 text-[11px] ml-2">({alert.details || 'Distress Call'})</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {alert.timestamp || 'Just now'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: CORRIDORS */}
          {activeTab === 'corridors' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Transit Corridors & Stage Termini</h3>
                  <p className="text-xs text-slate-400">View, edit, or register new commuter corridors into SQLite.</p>
                </div>
                <button
                  onClick={() => setShowAddCorridor(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Corridor</span>
                </button>
              </div>

              {/* Add Corridor Form Modal */}
              {showAddCorridor && (
                <form onSubmit={handleCreateCorridor} className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Register New Nairobi Transit Corridor</span>
                    <button type="button" onClick={() => setShowAddCorridor(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Route ID (e.g. 111)</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.id}
                        onChange={e => setNewCorridor({...newCorridor, id: e.target.value})}
                        placeholder="111"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Route Name</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.route_name}
                        onChange={e => setNewCorridor({...newCorridor, route_name: e.target.value})}
                        placeholder="Route 111"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Destination</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.destination}
                        onChange={e => setNewCorridor({...newCorridor, destination: e.target.value})}
                        placeholder="Ngong Town"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Corridor Description</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.corridor}
                        onChange={e => setNewCorridor({...newCorridor, corridor: e.target.value})}
                        placeholder="CBD to Ngong Town (via Ngong Rd & Dagoretti)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">CBD Boarding Stage & Bay</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.cbd_stage}
                        onChange={e => setNewCorridor({...newCorridor, cbd_stage: e.target.value})}
                        placeholder="Railways Bus Terminus Bay 5"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Off-Peak Min (KES)</label>
                      <input
                        type="number"
                        value={newCorridor.off_peak_min}
                        onChange={e => setNewCorridor({...newCorridor, off_peak_min: parseInt(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Off-Peak Max (KES)</label>
                      <input
                        type="number"
                        value={newCorridor.off_peak_max}
                        onChange={e => setNewCorridor({...newCorridor, off_peak_max: parseInt(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Peak Min (KES)</label>
                      <input
                        type="number"
                        value={newCorridor.peak_min}
                        onChange={e => setNewCorridor({...newCorridor, peak_min: parseInt(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Peak Cap (KES)</label>
                      <input
                        type="number"
                        value={newCorridor.peak_max}
                        onChange={e => setNewCorridor({...newCorridor, peak_max: parseInt(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Active Saccos (comma separated)</label>
                      <input
                        type="text"
                        value={newCorridor.saccos_text}
                        onChange={e => setNewCorridor({...newCorridor, saccos_text: e.target.value})}
                        placeholder="Super Metro, City Shuttle, Metro Trans"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Nearest Safe Haven Post</label>
                      <input
                        type="text"
                        required
                        value={newCorridor.safe_zone}
                        onChange={e => setNewCorridor({...newCorridor, safe_zone: e.target.value})}
                        placeholder="Railways Police Post (24/7 Lit)"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCorridor(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                    >
                      Save Corridor to Database
                    </button>
                  </div>
                </form>
              )}

              {/* Corridors Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold border-b border-slate-800 text-[10px]">
                    <tr>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">Destination</th>
                      <th className="px-4 py-3">CBD Stage</th>
                      <th className="px-4 py-3">Fare Bounds</th>
                      <th className="px-4 py-3">Safe Haven</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {corridors.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-900/50 transition">
                        <td className="px-4 py-3 font-mono font-bold text-emerald-400">
                          {r.route_name}
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">
                          {r.destination || r.corridor}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {r.cbd_stage}
                        </td>
                        <td className="px-4 py-3 font-mono">
                          KES {r.off_peak_min}-{r.off_peak_max} / {r.peak_min}-{r.peak_max}
                        </td>
                        <td className="px-4 py-3 text-emerald-300 text-[11px]">
                          {r.safe_zone}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleDeleteCorridor(r.id, r.route_name)}
                            className="p-1.5 rounded-lg bg-rose-950/50 text-rose-400 hover:bg-rose-900/60 border border-rose-800/50 transition"
                            title="Delete Corridor"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: LANDMARKS */}
          {activeTab === 'landmarks' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-white">Recognizable Nairobi Landmarks & Safe Zones</h3>
                  <p className="text-xs text-slate-400">
                    Used by the offline "I'm Lost" engine to pinpoint location without GPS or mobile data.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddLandmark(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Landmark</span>
                </button>
              </div>

              {/* Add Landmark Form */}
              {showAddLandmark && (
                <form onSubmit={handleCreateLandmark} className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/40 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Register Recognizable Nairobi Structure</span>
                    <button type="button" onClick={() => setShowAddLandmark(false)} className="text-slate-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Landmark Name</label>
                      <input
                        type="text"
                        required
                        value={newLandmark.name}
                        onChange={e => setNewLandmark({...newLandmark, name: e.target.value})}
                        placeholder="e.g. Afya Centre"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Category</label>
                      <input
                        type="text"
                        value={newLandmark.category}
                        onChange={e => setNewLandmark({...newLandmark, category: e.target.value})}
                        placeholder="Transit Hub / Landmark"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">CBD Sector / Area</label>
                      <input
                        type="text"
                        value={newLandmark.cbd_area}
                        onChange={e => setNewLandmark({...newLandmark, cbd_area: e.target.value})}
                        placeholder="Tom Mboya St / Haile Selassie"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Latitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newLandmark.lat}
                        onChange={e => setNewLandmark({...newLandmark, lat: parseFloat(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Longitude</label>
                      <input
                        type="number"
                        step="0.000001"
                        value={newLandmark.lng}
                        onChange={e => setNewLandmark({...newLandmark, lng: parseFloat(e.target.value)})}
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Nearest Safe Haven</label>
                      <input
                        type="text"
                        value={newLandmark.nearest_safe_zone}
                        onChange={e => setNewLandmark({...newLandmark, nearest_safe_zone: e.target.value})}
                        placeholder="Central Police Station"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-semibold block mb-1">Nearest Stage</label>
                      <input
                        type="text"
                        value={newLandmark.nearest_stage}
                        onChange={e => setNewLandmark({...newLandmark, nearest_stage: e.target.value})}
                        placeholder="Kencom Stage"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddLandmark(false)}
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs"
                    >
                      Save Landmark
                    </button>
                  </div>
                </form>
              )}

              {/* Landmarks Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {landmarks.map((l) => (
                  <div key={l.id} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-xs">{l.name}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                        {l.category}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{l.cbd_area}</p>
                    <div className="pt-1.5 border-t border-slate-800/80 text-[10px] space-y-0.5">
                      <p className="text-emerald-400">🛡️ Safe Haven: <span className="text-slate-300">{l.nearest_safe_zone}</span></p>
                      <p className="text-cyan-400">🚏 Nearest Stage: <span className="text-slate-300">{l.nearest_stage}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOS ALERTS & OVERCHARGES */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-black text-white">Emergency SOS Beacons & Commuter Flags</h3>
                <p className="text-xs text-slate-400">
                  Real-time telemetry gathered from the web app distress button and Africa's Talking USSD (*384*123#).
                </p>
              </div>

              {/* SOS Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" />
                  <span>SOS Distress Logs ({alerts.length})</span>
                </span>
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
                      <tr>
                        <th className="px-4 py-3">Alert ID</th>
                        <th className="px-4 py-3">Contact</th>
                        <th className="px-4 py-3">Coordinates</th>
                        <th className="px-4 py-3">Route / Landmark</th>
                        <th className="px-4 py-3">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {alerts.map((a) => (
                        <tr key={a.id} className="hover:bg-slate-900/50">
                          <td className="px-4 py-2.5 font-mono text-rose-400 font-bold">#{a.id}</td>
                          <td className="px-4 py-2.5 font-bold text-white">{a.phone_number}</td>
                          <td className="px-4 py-2.5 font-mono text-[11px] text-slate-400">
                            {a.latitude.toFixed(4)}, {a.longitude.toFixed(4)}
                          </td>
                          <td className="px-4 py-2.5 text-cyan-300">{a.route_id}</td>
                          <td className="px-4 py-2.5 text-slate-300 text-[11px]">{a.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Overcharge Reports Table */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  <span>Conductor Overcharge Flags ({overcharges.length})</span>
                </span>
                {overcharges.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-center">
                    No overcharge complaints filed via USSD or web yet.
                  </p>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
                        <tr>
                          <th className="px-4 py-3">Report ID</th>
                          <th className="px-4 py-3">Phone</th>
                          <th className="px-4 py-3">Route</th>
                          <th className="px-4 py-3">Plate / Details</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/80 text-slate-300">
                        {overcharges.map((o) => (
                          <tr key={o.id}>
                            <td className="px-4 py-2.5 font-mono text-purple-400">#{o.id}</td>
                            <td className="px-4 py-2.5 font-bold text-white">{o.phone_number}</td>
                            <td className="px-4 py-2.5 text-slate-300">{o.route_id}</td>
                            <td className="px-4 py-2.5 text-amber-300">{o.vehicle_reg || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: DEVELOPER & DATASET GUIDE */}
          {activeTab === 'developer_guide' && (
            <div className="space-y-6 text-xs text-slate-300">
              
              {/* Architecture Intro */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-3">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <Terminal className="w-4 h-4" />
                  <span>RouteShield Engineering & Data Architecture</span>
                </div>
                <p className="leading-relaxed">
                  RouteShield is engineered as a zero-dependency, local-first Nairobi transit safety system. It relies on a high-performance 
                  <strong> SQLite 3</strong> database running on Express.js with <strong>better-sqlite3</strong>, paired with a React PWA frontend.
                </p>
              </div>

              {/* 1. Database & Dataset Structure */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span>1. How Data is Stored & Seeded</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <strong className="text-emerald-400 text-xs block">Database File Location:</strong>
                    <code className="block p-2 rounded bg-slate-900 text-cyan-300 font-mono text-[11px]">
                      backend/routeshield.db
                    </code>
                    <p className="text-[11px] text-slate-400">
                      Auto-created on backend start. If missing, it automatically seeds initial routes from <code className="text-slate-300">frontend/src/data/routes.json</code> and populates 12 Nairobi landmarks.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <strong className="text-cyan-400 text-xs block">Core Database Tables:</strong>
                    <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                      <li>• <b className="text-white">routes</b>: Corridors, stages, fares, saccos, paths</li>
                      <li>• <b className="text-white">landmarks</b>: Recognized buildings for offline rescue</li>
                      <li>• <b className="text-white">ussd_subscribers</b>: Enrolled phones & language</li>
                      <li>• <b className="text-white">emergency_alerts</b>: SOS telemetry dispatches</li>
                      <li>• <b className="text-white">fare_reports</b>: Crowdsourced commuter fare inputs</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* 2. Adding Data Manually vs Programmatically */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>2. How to Add or Update Routes & Stages</span>
                </h4>
                <div className="space-y-2.5">
                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <strong className="text-amber-400 text-xs">Method A: Through this Admin UI (No code needed)</strong>
                    <p className="text-[11px] text-slate-300">
                      Switch to the <strong>"Transit Corridors"</strong> tab above and click <strong>"New Corridor"</strong>. Enter the route name, destination, boarding bay, fare bounds, and active Saccos. Changes persist instantly in SQLite.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
                    <strong className="text-amber-400 text-xs">Method B: Through REST API</strong>
                    <p className="text-[11px] text-slate-300">
                      Send a <code className="text-cyan-300">POST /api/admin/routes</code> JSON payload:
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] overflow-x-auto">
{`curl -X POST http://localhost:5000/api/admin/routes \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "111",
    "route_name": "Route 111",
    "corridor": "CBD to Ngong Town",
    "destination": "Ngong Town",
    "cbd_stage": "Railways Terminus Bay 5",
    "safe_zone": "Railways Police Post",
    "off_peak_min": 50,
    "off_peak_max": 80,
    "peak_min": 100,
    "peak_max": 150,
    "saccos": ["Super Metro", "City Shuttle"]
  }'`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* 3. Africa's Talking USSD Integration */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>3. Africa's Talking USSD Webhook Integration</span>
                </h4>
                <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                  <p className="leading-relaxed">
                    When you purchase a USSD channel (e.g. <code>*384*123#</code>) in your 
                    <a href="https://africastalking.com" target="_blank" rel="noreferrer" className="text-cyan-400 underline ml-1">
                      Africa's Talking Dashboard
                    </a>, configure the Callback URL to:
                  </p>
                  <code className="block p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px]">
                    https://your-public-domain.com/ussd (POST method)
                  </code>
                  <div className="space-y-1.5 text-[11px]">
                    <p><strong>Protocol Flow Enforced in <code>backend/server.js</code>:</strong></p>
                    <ol className="list-decimal list-inside space-y-1 text-slate-400">
                      <li><b className="text-slate-200">First Dial:</b> Opt-in prompt ("1. Opt in (Jiunge)").</li>
                      <li><b className="text-slate-200">Language Screen:</b> Choice of (1. Kiswahili, 2. English).</li>
                      <li><b className="text-slate-200">Main Menu:</b> (1. Find Stage, 2. Fare Estimate, 3. I'm Lost, 4. Report Overcharge, 5. Go back).</li>
                      <li><b className="text-slate-200">Final Step:</b> Sends instructions/SMS dispatch and returns <code>END &lt;message&gt;</code>.</li>
                    </ol>
                  </div>

                  <div className="pt-2">
                    <span className="text-[10px] text-slate-400 block mb-1 font-semibold uppercase">
                      Test locally without spending airtime:
                    </span>
                    <pre className="p-2.5 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] overflow-x-auto">
{`curl -X POST http://localhost:5000/ussd \\
  -H "Content-Type: application/json" \\
  -d '{"phoneNumber": "+254712345678", "text": ""}'`}
                    </pre>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>RouteShield Engine v2.0 • Nairobi Commuter Safety Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
}
