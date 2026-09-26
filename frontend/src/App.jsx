import React, { useEffect, useState } from 'react';
import { Smartphone, Search, Activity } from 'lucide-react';

import Header from './components/Header';
import MerchantPortal from './pages/MerchantPortal';
import LMOApp from './pages/LMOApp';
import PublicSearch from './pages/PublicSearch';
import AdminAnalytics from './pages/AdminAnalytics';

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [activeRole, setActiveRole] = useState('merchant');
  const [instruments, setInstruments] = useState([]);

  const [newApp, setNewApp] = useState({
    category: 'Electronic Scale (10kg)',
    modelNumber: '',
    serialNumber: '',
    merchantName: 'Sharma Supermarket',
  });

  const [inspectionData, setInspectionData] = useState({
    actualReading: '',
    standardReading: '',
    gpsCaptured: false,
  });

  const [searchId, setSearchId] = useState('');
  const [searchedRecord, setSearchedRecord] = useState(null);

  const fetchInstruments = async () => {
    try {
      const res = await fetch(`${API_BASE}/instruments`);
      const data = await res.json();
      setInstruments(data);
    } catch (err) {
      console.error('API Error:', err);
    }
  };

  useEffect(() => {
    fetchInstruments();
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_BASE}/instruments/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newApp),
      });

      const data = await res.json();

      alert(`Application Created! Digital ID: ${data.digitalId}`);

      setNewApp({
        category: 'Electronic Scale (10kg)',
        modelNumber: '',
        serialNumber: '',
        merchantName: 'Sharma Supermarket',
      });

      fetchInstruments();
    } catch (err) {
      console.error(err);
      alert('Failed to submit application');
    }
  };

  const handleVerifySubmission = async (digitalId, passStatus) => {
    try {
      await fetch(`${API_BASE}/verification/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          digitalId,
          actualReading:
            Number(inspectionData.actualReading) || 5.0,
          standardReading:
            Number(inspectionData.standardReading) || 5.0,
          passStatus,
          lat: 28.6139,
          lng: 77.209,
        }),
      });

      alert(
        `Instrument ${digitalId} verification ${
          passStatus ? 'APPROVED' : 'REJECTED'
        }`
      );

      setInspectionData({
        actualReading: '',
        standardReading: '',
        gpsCaptured: false,
      });

      fetchInstruments();
    } catch (err) {
      console.error(err);
      alert('Failed to record verification result');
    }
  };

  const handlePublicSearch = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/public/verify/${searchId.trim()}`
      );

      if (!res.ok) {
        setSearchedRecord('NOT_FOUND');
        return;
      }

      const data = await res.json();
      setSearchedRecord(data);
    } catch (err) {
      console.error(err);
      setSearchedRecord('NOT_FOUND');
    }
  };

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#171717]">
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
      />

      {activeRole === 'merchant' && (
  <MerchantPortal
    instruments={instruments}
    onRegister={async (application) => {
      const res = await fetch(`${API_BASE}/instruments/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(application),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to register instrument');
      }

      alert(`Application Created! Digital ID: ${data.digitalId}`);

      await fetchInstruments();
    }}
  />
)}

      {activeRole === 'lmo' && (
  <LMOApp
    instruments={instruments}
    onInspectSubmit={async (inspection) => {
      const res = await fetch(`${API_BASE}/verification/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inspection),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || 'Failed to submit verification'
        );
      }

      alert(
        `Instrument ${inspection.digitalId} verification ${
          inspection.passStatus ? 'APPROVED' : 'REJECTED'
        }`
      );

      await fetchInstruments();
    }}
  />
)}

      {activeRole === 'public' && (
  <PublicSearch
    searchedRecord={searchedRecord}
    onSearch={async (digitalId) => {
      try {
        const res = await fetch(
          `${API_BASE}/public/verify/${encodeURIComponent(digitalId)}`
        );

        if (!res.ok) {
          setSearchedRecord('NOT_FOUND');
          return;
        }

        const data = await res.json();
        setSearchedRecord(data);
      } catch (error) {
        console.error('Public Search Error:', error);
        setSearchedRecord('NOT_FOUND');
      }
    }}
  />
)}

      {activeRole === 'admin' && (
  <AdminAnalytics
    instruments={instruments}
  />
)}
    </div>
  );
}
function PlaceholderPage({ icon, title, description }) {
  return (
    <main className="flex min-h-[500px] items-center justify-center px-6">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center border border-[#d9c7a7] text-[#861f2b]">
          {icon}
        </div>

        <h2 className="font-serif text-2xl font-bold">
          {title}
        </h2>

        <p className="mt-2 text-[#666]">
          {description}
        </p>
      </div>
    </main>
  );
}