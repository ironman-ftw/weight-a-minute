import React, { useEffect, useState } from 'react';

import Header from './components/Header';
import MerchantPortal from './pages/MerchantPortal';
import LMOApp from './pages/LMOApp';
import PublicSearch from './pages/PublicSearch';
import AdminAnalytics from './pages/AdminAnalytics';

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function App() {
  const [activeRole, setActiveRole] = useState('merchant');
  const [instruments, setInstruments] = useState([]);

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

  // Allows QR/public verification links such as:
  // http://localhost:5173/?verify=DI-2026-XXXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const verifyId = params.get('verify');

    if (verifyId) {
      setSearchId(verifyId);
      setActiveRole('public');
    }
  }, []);

  const handleRoleChange = (role) => {
    setActiveRole(role);
  };

  return (
    <div className="min-h-screen bg-[#fffdf8] text-[#171717]">
      <Header
        activeRole={activeRole}
        onRoleChange={handleRoleChange}
      />

      {/* MERCHANT PORTAL */}
      {activeRole === 'merchant' && (
        <MerchantPortal
          instruments={instruments}
          onRegister={async (application) => {
            const res = await fetch(
              `${API_BASE}/instruments/register`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(application),
              }
            );

            const data = await res.json();

            if (!res.ok) {
              throw new Error(
                data.error || 'Failed to register instrument'
              );
            }

            alert(
              `Application Created! Digital ID: ${data.digitalId}`
            );

            await fetchInstruments();
          }}
        />
      )}

      {/* LMO APP */}
      {activeRole === 'lmo' && (
        <LMOApp
          instruments={instruments}
          onInspectSubmit={async (inspection) => {
            const res = await fetch(
              `${API_BASE}/verification/submit`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(inspection),
              }
            );

            const data = await res.json();

            if (!res.ok) {
              throw new Error(
                data.error || 'Failed to submit verification'
              );
            }

            alert(
              `Instrument ${inspection.digitalId} verification ${
                inspection.passStatus
                  ? 'APPROVED'
                  : 'REJECTED'
              }`
            );

            await fetchInstruments();
          }}
        />
      )}

      {/* PUBLIC SEARCH */}
      {activeRole === 'public' && (
        <PublicSearch
          searchedRecord={searchedRecord}
          initialSearchId={searchId}
          onSearch={async (digitalId) => {
            try {
              const res = await fetch(
                `${API_BASE}/public/verify/${encodeURIComponent(
                  digitalId
                )}`
              );

              if (!res.ok) {
                setSearchedRecord('NOT_FOUND');
                return;
              }

              const data = await res.json();
              setSearchedRecord(data);
            } catch (error) {
              console.error(
                'Public Search Error:',
                error
              );
              setSearchedRecord('NOT_FOUND');
            }
          }}
        />
      )}

      {/* ADMIN ANALYTICS */}
      {activeRole === 'admin' && (
        <AdminAnalytics
          instruments={instruments}
        />
      )}
    </div>
  );
}