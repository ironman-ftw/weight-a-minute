import React, { useState } from 'react';

export default function LMOApp({
  instruments,
  onInspectSubmit,
}) {
  const [selectedInstrument, setSelectedInstrument] = useState(null);

  const inspectionRecords = instruments.map((instrument) => ({
    ...instrument,
    merchant: instrument.merchantName || '—',
    instrumentId: instrument.digitalId || '—',
    status: getLMOStatus(instrument),
  }));

  const handleInspect = (instrument) => {
    setSelectedInstrument(instrument);
  };

  if (selectedInstrument) {
    return (
      <InspectionForm
        instrument={selectedInstrument}
        onBack={() => setSelectedInstrument(null)}
        onSubmit={async (data) => {
          await onInspectSubmit(data);
          setSelectedInstrument(null);
        }}
      />
    );
  }

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto max-w-[1536px]">

        <section className="overflow-hidden border border-[#d9c7a7] bg-[#fffdf8]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse">

              <thead>
                <tr className="border-b-2 border-[#861f2b]">
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    S.NO
                  </th>
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    INSTRUMENT ID
                  </th>
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    MERCHANT
                  </th>
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    CATEGORY
                  </th>
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    STATUS
                  </th>
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    ACTION
                  </th>
                </tr>
              </thead>

              <tbody>
                {inspectionRecords.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-14 text-center text-[16px] text-[#777]"
                    >
                      No instruments are currently awaiting inspection.
                    </td>
                  </tr>
                ) : (
                  inspectionRecords.map((instrument, index) => (
                    <tr
                      key={
                        instrument.digitalId ||
                        instrument._id ||
                        index
                      }
                      className="border-b border-[#e3d7c2] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-[17px] text-[#171717]">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-mono text-[16px] text-[#333]">
                        {instrument.instrumentId}
                      </td>

                      <td className="px-6 py-4 text-[17px] text-[#171717]">
                        {instrument.merchant}
                      </td>

                      <td className="px-6 py-4 text-[17px] text-[#171717]">
                        {instrument.category || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge status={instrument.status} />
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleInspect(instrument)}
                          className="border border-[#d9c7a7] bg-[#fffdf8] px-5 py-2.5 text-[16px] font-semibold text-[#333] transition hover:border-[#861f2b] hover:bg-[#f4ede2]"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </section>

        <p className="mt-8 text-center text-[14px] text-[#777]">
          Select an instrument and use Inspect to record the verification result.
        </p>

      </div>
    </main>
  );
}

function InspectionForm({
  instrument,
  onBack,
  onSubmit,
}) {
  const [actualReading, setActualReading] = useState('');
  const [standardReading, setStandardReading] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (passStatus) => {
    if (!actualReading || !standardReading) {
      alert('Please enter both actual and standard readings.');
      return;
    }


    setSubmitting(true);

    try {
      await onSubmit({
        digitalId: instrument.digitalId,
        actualReading: Number(actualReading),
        standardReading: Number(standardReading),
        passStatus,
        lat: 28.6139,
        lng: 77.209,
      });
    } catch (error) {
      console.error(error);
      alert('Failed to submit verification.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto max-w-[1100px]">

        <button
          type="button"
          onClick={onBack}
          className="mb-6 text-[16px] font-semibold text-[#861f2b] hover:underline"
        >
          ← Back to Inspection List
        </button>

        <section className="border border-[#d9c7a7] bg-[#fffdf8]">

          <div className="border-b-2 border-[#861f2b] px-7 py-5">
            <h2 className="font-serif text-[25px] font-bold text-[#171717]">
              Instrument Inspection
            </h2>

            <p className="mt-1 text-[15px] text-[#777]">
              Record verification measurements for the selected instrument.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 p-7 md:grid-cols-2">

            <InfoField
              label="Instrument ID"
              value={instrument.digitalId || '—'}
            />

            <InfoField
              label="Merchant"
              value={instrument.merchantName || '—'}
            />

            <InfoField
              label="Category"
              value={instrument.category || '—'}
            />

            <InfoField
              label="Serial Number"
              value={instrument.serialNumber || '—'}
            />

            <div>
              <label
                htmlFor="actualReading"
                className="mb-2 block text-[16px] font-medium text-[#555]"
              >
                Actual Reading
              </label>

              <input
                id="actualReading"
                type="number"
                step="any"
                value={actualReading}
                onChange={(e) => setActualReading(e.target.value)}
                placeholder="Enter actual reading"
                className="h-[54px] w-full border border-[#d9c7a7] bg-white px-5 text-[17px] text-[#171717] outline-none focus:border-[#861f2b]"
              />
            </div>

            <div>
              <label
                htmlFor="standardReading"
                className="mb-2 block text-[16px] font-medium text-[#555]"
              >
                Standard Reading
              </label>

              <input
                id="standardReading"
                type="number"
                step="any"
                value={standardReading}
                onChange={(e) => setStandardReading(e.target.value)}
                placeholder="Enter standard reading"
                className="h-[54px] w-full border border-[#d9c7a7] bg-white px-5 text-[17px] text-[#171717] outline-none focus:border-[#861f2b]"
              />
            </div>

          </div>


          <div className="flex justify-end gap-3 border-t border-[#e3d7c2] px-7 py-5">

            <button
              type="button"
              onClick={() => handleSubmit(false)}
              disabled={submitting}
              className="border border-[#a62b25] px-7 py-3 text-[16px] font-semibold text-[#a62b25] transition hover:bg-[#fbe1df] disabled:opacity-50"
            >
              Reject
            </button>

            <button
              type="button"
              onClick={() => handleSubmit(true)}
              disabled={submitting}
              className="bg-[#861f2b] px-7 py-3 text-[16px] font-semibold text-white transition hover:bg-[#711923] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Approve & Verify'}
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}

function InfoField({ label, value }) {
  return (
    <div>
      <label className="mb-2 block text-[16px] font-medium text-[#555]">
        {label}
      </label>

      <div className="flex h-[54px] items-center border border-[#d9c7a7] bg-[#f8f4eb] px-5 text-[17px] text-[#333]">
        {value}
      </div>
    </div>
  );
}

function getLMOStatus(instrument) {
  if (instrument.verificationStatus === 'Verified') {
    return 'Verified';
  }

  if (instrument.verificationStatus === 'Rejected') {
    return 'Rejected';
  }

  if (
    instrument.verificationStatus === 'Pending Application' ||
    instrument.verificationStatus === 'Pending'
  ) {
    return 'Awaiting';
  }

  return instrument.verificationStatus || 'Awaiting';
}

function StatusBadge({ status }) {
  const styles = {
    Awaiting: 'bg-[#fbe9d8] text-[#a75b19]',
    Scheduled: 'bg-[#e5f1e7] text-[#4f7b54]',
    Verified: 'bg-[#e5f1e7] text-[#28702f]',
    Rejected: 'bg-[#fbe1df] text-[#a62b25]',
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-1.5 text-[14px] font-semibold ${
        styles[status] || 'bg-[#f0ece5] text-[#666]'
      }`}
    >
      {status}
    </span>
  );
}