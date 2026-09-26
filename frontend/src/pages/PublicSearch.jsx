import React, { useState } from 'react';

export default function PublicSearch({
  searchedRecord,
  onSearch,
}) {
  const [searchId, setSearchId] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!searchId.trim()) {
      alert('Please enter a Digital ID.');
      return;
    }

    setSearching(true);

    try {
      await onSearch(searchId.trim());
    } finally {
      setSearching(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto max-w-[1100px]">

        {/* Search Section */}
        <section className="border border-[#d9c7a7] bg-[#fffdf8] p-7">

          <h2 className="font-serif text-[27px] font-bold text-[#171717]">
            Verify Instrument
          </h2>

          <p className="mt-2 text-[16px] text-[#666]">
            Enter the Digital ID printed on the verification certificate.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex flex-col gap-3 md:flex-row"
          >
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="Enter Digital ID — e.g. DI-2026-59319"
              className="h-[56px] flex-1 border border-[#d9c7a7] bg-white px-5 text-[17px] text-[#171717] outline-none placeholder:text-[#888] focus:border-[#861f2b]"
            />

            <button
              type="submit"
              disabled={searching}
              className="h-[56px] bg-[#861f2b] px-9 text-[17px] font-bold text-white transition hover:bg-[#711923] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {searching ? 'Verifying...' : 'Verify'}
            </button>
          </form>

        </section>

        {/* Search Result */}
        {searchedRecord && searchedRecord !== 'NOT_FOUND' && (
          <CertificateCard record={searchedRecord} />
        )}

        {searchedRecord === 'NOT_FOUND' && (
          <section className="mt-6 border border-[#d9c7a7] bg-[#fffdf8] p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center border border-[#a62b25] text-[25px] text-[#a62b25]">
              !
            </div>

            <h3 className="mt-4 font-serif text-[23px] font-bold text-[#171717]">
              Certificate Not Found
            </h3>

            <p className="mt-2 text-[15px] text-[#666]">
              No verification record was found for the Digital ID entered.
            </p>
          </section>
        )}

      </div>
    </main>
  );
}

function CertificateCard({ record }) {
  const isVerified = record.verificationStatus === 'Verified';

  return (
    <section className="mt-6 overflow-hidden border border-[#d9c7a7] bg-[#fffdf8]">

      {/* Certificate Header */}
      <div className="flex items-center justify-between border-b-2 border-[#861f2b] px-7 py-5">
        <div>
          <h2 className="font-serif text-[23px] font-bold text-[#171717]">
            Certificate of Verification
          </h2>

          <p className="mt-1 text-[14px] text-[#777]">
            Digital verification record
          </p>
        </div>

        <span
          className={`rounded-full px-5 py-2 text-[14px] font-bold ${
            isVerified
              ? 'bg-[#e5f1e7] text-[#28702f]'
              : 'bg-[#fbe1df] text-[#a62b25]'
          }`}
        >
          {isVerified ? 'VERIFIED' : 'NOT VERIFIED'}
        </span>
      </div>

      {/* Certificate Details */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-6 p-7 md:grid-cols-2">

        <Detail
          label="Certificate / Digital ID"
          value={record.digitalId || '—'}
        />

        <Detail
          label="Merchant"
          value={record.merchantName || '—'}
        />

        <Detail
          label="Category"
          value={record.category || '—'}
        />

        <Detail
          label="Model Number"
          value={record.modelNumber || '—'}
        />

        <Detail
          label="Serial Number"
          value={record.serialNumber || '—'}
        />

        <Detail
          label="Verification Status"
          value={record.verificationStatus || '—'}
        />

        <Detail
          label="Valid From"
          value={formatDate(record.verificationDate)}
        />

        <Detail
          label="Valid Until"
          value={formatDate(record.expiryDate)}
        />

      </div>

      {/* Verification Notice */}
      <div className="border-t border-[#e3d7c2] bg-[#faf6ed] px-7 py-5">
        <p className="text-[14px] leading-6 text-[#666]">
          This digital record can be used to verify the current
          verification status of the registered measuring instrument.
        </p>
      </div>

    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="mb-1 text-[14px] font-semibold uppercase tracking-wide text-[#777]">
        {label}
      </p>

      <p className="text-[17px] text-[#171717]">
        {value}
      </p>
    </div>
  );
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}