import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  CheckCircle, AlertTriangle, QrCode, Shield, FileText, 
  MapPin, Camera, Smartphone, Search, Users, Layers, Activity
} from 'lucide-react';

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [activeRole, setActiveRole] = useState('merchant');
  const [instruments, setInstruments] = useState([]);
  
  // Form & Search States
  const [newApp, setNewApp] = useState({ category: 'Electronic Scale (10kg)', modelNumber: '', serialNumber: '', merchantName: '' });
  const [inspectionData, setInspectionData] = useState({ actualReading: '', standardReading: '', gpsCaptured: false });
  const [searchId, setSearchId] = useState('');
  const [searchedRecord, setSearchedRecord] = useState(null);

  // Fetch Instruments on Load
  const fetchInstruments = async () => {
    try {
      const res = await fetch(`${API_BASE}/instruments`);
      const data = await res.json();
      setInstruments(data);
    } catch (err) {
      console.error("API Error:", err);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  // Merchant Application Submit
  const handleApply = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/instruments/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newApp)
      });
      const data = await res.json();
      alert(`Application Created! Digital ID: ${data.digitalId}`);
      setNewApp({ category: 'Electronic Scale (10kg)', modelNumber: '', serialNumber: '', merchantName: '' });
      fetchInstruments();
    } catch (err) {
      alert("Failed to submit application");
    }
  };

  // LMO Field Inspection Submit
  const handleVerifySubmission = async (digitalId, passStatus) => {
    try {
      await fetch(`${API_BASE}/verification/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          digitalId,
          actualReading: Number(inspectionData.actualReading) || 5.0,
          standardReading: Number(inspectionData.standardReading) || 5.0,
          passStatus,
          lat: 28.6139,
          lng: 77.2090
        })
      });
      alert(`Instrument ${digitalId} verification ${passStatus ? 'APPROVED' : 'REJECTED'}`);
      setInspectionData({ actualReading: '', standardReading: '', gpsCaptured: false });
      fetchInstruments();
    } catch (err) {
      alert("Failed to record verification result");
    }
  };

  // Public Search
  const handlePublicSearch = async () => {
    try {
      const res = await fetch(`${API_BASE}/public/verify/${searchId.trim()}`);
      if (!res.ok) {
        setSearchedRecord('NOT_FOUND');
        return;
      }
      const data = await res.json();
      setSearchedRecord(data);
    } catch (err) {
      setSearchedRecord('NOT_FOUND');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans">
      <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-bold text-xl">WAM</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Weight-A-Minute <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">SIH 2026</span>
              </h1>
              <p className="text-xs text-slate-400">Legal Metrology Verification Platform</p>
            </div>
          </div>

          <div className="flex bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
            <button 
              onClick={() => setActiveRole('merchant')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeRole === 'merchant' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Users size={14}/> Merchant Portal
            </button>
            <button 
              onClick={() => setActiveRole('lmo')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeRole === 'lmo' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Smartphone size={14}/> LMO App
            </button>
            <button 
              onClick={() => setActiveRole('public')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeRole === 'public' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <QrCode size={14}/> Public Search
            </button>
            <button 
              onClick={() => setActiveRole('admin')} 
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${activeRole === 'admin' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              <Activity size={14}/> Admin Analytics
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-6">
        {activeRole === 'merchant' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-800/60 p-4 rounded-xl border border-slate-700">
              <div>
                <h2 className="text-lg font-bold text-white">Merchant Application Portal</h2>
                <p className="text-sm text-slate-400">Submit instruments forLegal Metrology Verification</p>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 h-fit">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <FileText className="text-blue-400" size={18}/> New Instrument
                </h3>
                <form onSubmit={handleApply} className="space-y-4">
                <div>
                 <label className="text-xs text-slate-400 block mb-1"> Merchant Name </label>

                 <input
                  type="text"
                  placeholder="e.g. Sharma Supermarket"
                  value={newApp.merchantName}
                  onChange={e => setNewApp({...newApp, merchantName: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" required
                  />
                </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Category</label>
                    <select 
                      value={newApp.category} 
                      onChange={e => setNewApp({...newApp, category: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm"
                    >
                      <option>Electronic Scale (10kg)</option>
                      <option>Weighbridge (50 Ton)</option>
                      <option>Fuel Dispensing Pump</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Model Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. W-200" 
                      value={newApp.modelNumber} 
                      onChange={e => setNewApp({...newApp, modelNumber: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Serial Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. SN-9981-A" 
                      value={newApp.serialNumber} 
                      onChange={e => setNewApp({...newApp, serialNumber: e.target.value})}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm" 
                      required
                    />
                  </div>
                  <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 rounded-lg text-sm">
                    Submit & Pay Fee
                  </button>
                </form>
              </div>

              <div className="md:col-span-2 bg-slate-800 p-5 rounded-xl border border-slate-700">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Layers className="text-blue-400" size={18}/> Registered Instruments
                </h3>
                <div className="space-y-3">
                  {instruments.map(inst => (
                    <div key={inst.digitalId} className="bg-slate-900 p-4 rounded-lg border border-slate-700/80 flex flex-col sm:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-blue-400">{inst.digitalId}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                            inst.verificationStatus === 'Verified' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                          }`}>
                            {inst.verificationStatus}
                          </span>
                        </div>
                        <h4 className="font-semibold text-slate-200 text-sm mt-1">{inst.category}</h4>
                        <p className="text-xs text-slate-400">Serial: {inst.serialNumber} | Model: {inst.modelNumber}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeRole === 'lmo' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-800 p-5 rounded-xl border border-slate-700 space-y-4">
              <h3 className="font-semibold text-white border-b border-slate-700 pb-2">LMO Inspection Tasks</h3>
              {instruments.filter(i => i.verificationStatus === 'Pending Application').map(inst => (
                <div key={inst.digitalId} className="bg-slate-900 p-4 rounded-xl border border-slate-700 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-mono text-xs text-indigo-400 font-bold">{inst.digitalId}</span>
                      <h4 className="font-bold text-white">{inst.category}</h4>
                      <p className="text-xs text-slate-400">Merchant: {inst.merchantName}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="number" 
                      placeholder="Standard Weight (kg)" 
                      onChange={e => setInspectionData({...inspectionData, standardReading: e.target.value})}
                      className="bg-slate-800 border border-slate-700 p-2 text-sm rounded text-white" 
                    />
                    <input 
                      type="number" 
                      placeholder="Observed Weight (kg)" 
                      onChange={e => setInspectionData({...inspectionData, actualReading: e.target.value})}
                      className="bg-slate-800 border border-slate-700 p-2 text-sm rounded text-white" 
                    />
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleVerifySubmission(inst.digitalId, true)}
                      className="flex-1 bg-emerald-600 text-white font-semibold py-2 rounded text-xs"
                    >
                      PASS & STAMP
                    </button>
                    <button 
                      onClick={() => handleVerifySubmission(inst.digitalId, false)}
                      className="flex-1 bg-red-600 text-white font-semibold py-2 rounded text-xs"
                    >
                      REJECT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeRole === 'public' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 space-y-4">
              <h2 className="text-xl font-bold text-white">Public Verification Search</h2>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Digital ID (e.g. DI-2026-XXXXX)" 
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white"
                />
                <button onClick={handlePublicSearch} className="bg-emerald-600 px-5 py-2 rounded-lg text-sm font-semibold">
                  Verify
                </button>
              </div>

              {searchedRecord && searchedRecord !== 'NOT_FOUND' && (
                <div className="bg-slate-900 p-5 rounded-xl border border-slate-700 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm text-emerald-400 font-bold">{searchedRecord.digitalId}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-xs">
                      {searchedRecord.verificationStatus}
                    </span>
                  </div>
                  <p className="text-sm"><strong>Merchant:</strong> {searchedRecord.merchantName}</p>
                  <p className="text-sm"><strong>Category:</strong> {searchedRecord.category}</p>
                  <p className="text-sm"><strong>Expires On:</strong> {searchedRecord.expiryDate ? new Date(searchedRecord.expiryDate).toLocaleDateString() : 'N/A'}</p>
                </div>
              )}

              {searchedRecord === 'NOT_FOUND' && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm text-center">
                  No valid verification record found for ID: {searchId}
                </div>
              )}
            </div>
          </div>
        )}

        {activeRole === 'admin' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Total Registered</span>
                <div className="text-2xl font-bold mt-1">{instruments.length}</div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Verified</span>
                <div className="text-2xl font-bold text-emerald-400 mt-1">
                  {instruments.filter(i => i.verificationStatus === 'Verified').length}
                </div>
              </div>
              <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
                <span className="text-xs text-slate-400">Pending</span>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {instruments.filter(i => i.verificationStatus === 'Pending Application').length}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}