import React, { useState } from 'react';

const categories = [
  'Electronic Scale (10kg)',
  'Fuel Dispensing Pump',
  'Weighbridge (50 Ton)',
];

const merchantNames = {
  'Electronic Scale (10kg)': [
    'Sharma Supermarket',
    'Khandelwal Traders',
    'City Mart',
  ],

  'Fuel Dispensing Pump': [
    'Sharma Fuel Station',
    'Highway Fuel Point',
    'City Petroleum',
  ],

  'Weighbridge (50 Ton)': [
    'Apex Logistics & Weighing',
    'National Transport Yard',
    'City Freight Services',
  ],
};

function getMerchantName(category) {
  const names = merchantNames[category];

  if (!names || names.length === 0) {
    return 'Registered Merchant';
  }

  // Pick one automatically for the prototype
  return names[Math.floor(Math.random() * names.length)];
}

export default function MerchantPortal({
  instruments,
  onRegister,
}) {
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    category: 'Electronic Scale (10kg)',
    modelNumber: '',
    serialNumber: '',
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm((previous) => ({
      ...previous,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.modelNumber.trim() || !form.serialNumber.trim()) {
      alert('Please enter the model number and serial number.');
      return;
    }

    setSubmitting(true);

    try {
      await onRegister({
        category: form.category,
        modelNumber: form.modelNumber,
        serialNumber: form.serialNumber,
        merchantName: getMerchantName(form.category),
      });

      setForm({
        category: 'Electronic Scale (10kg)',
        modelNumber: '',
        serialNumber: '',
      });

      setShowForm(false);
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-10">
      <div className="mx-auto max-w-[1536px]">

        {/* Page heading */}
        <div className="mb-7 flex items-center justify-between">
          <h2 className="font-serif text-[27px] font-bold text-[#171717]">
            Registered Instruments
          </h2>

          <button
            type="button"
            onClick={() => setShowForm((previous) => !previous)}
            className="bg-[#861f2b] px-7 py-3.5 text-[16px] font-bold text-white transition hover:bg-[#711923]"
          >
            + New Registration
          </button>
        </div>

        {/* Registered instruments */}
        <section className="overflow-hidden border border-[#d9c7a7] bg-[#fffdf8]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse">
              <thead>
                <tr className="border-b-2 border-[#861f2b]">
                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    S.NO
                  </th>

                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    CERTIFICATE NO.
                  </th>

                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    CATEGORY
                  </th>

                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    SERIAL
                  </th>

                  <th className="px-6 py-4 text-left text-[15px] font-semibold uppercase tracking-wide text-[#666]">
                    STATUS
                  </th>
                </tr>
              </thead>

              <tbody>
                {instruments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-[16px] text-[#777]"
                    >
                      No instruments registered yet.
                    </td>
                  </tr>
                ) : (
                  instruments.map((instrument, index) => (
                    <tr
                      key={instrument.digitalId || instrument._id || index}
                      className="border-b border-[#e3d7c2] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-[17px] text-[#171717]">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-mono text-[16px] text-[#333]">
                        {instrument.digitalId || '—'}
                      </td>

                      <td className="px-6 py-4 text-[17px] text-[#171717]">
                        {instrument.category || '—'}
                      </td>

                      <td className="px-6 py-4 font-mono text-[16px] text-[#333]">
                        {instrument.serialNumber || '—'}
                      </td>

                      <td className="px-6 py-4">
                        <StatusBadge
                          status={instrument.verificationStatus}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Registration form */}
        {showForm && (
          <section className="mt-5 border border-[#d9c7a7] bg-[#fffdf8] p-7">
            <h3 className="mb-6 font-serif text-[21px] font-bold tracking-wide text-[#555]">
              NEW REGISTRATION — FORM
            </h3>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-[1.1fr_1fr_1fr_auto] md:items-end"
            >
              {/* Category */}
              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-[16px] font-medium text-[#555]"
                >
                  Category
                </label>

                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="h-[56px] w-full border border-[#d9c7a7] bg-[#fffdf8] px-5 text-[17px] text-[#171717] outline-none focus:border-[#861f2b]"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model number */}
              <div>
                <label
                  htmlFor="modelNumber"
                  className="mb-2 block text-[16px] font-medium text-[#555]"
                >
                  Model No.
                </label>

                <input
                  id="modelNumber"
                  name="modelNumber"
                  type="text"
                  value={form.modelNumber}
                  onChange={handleChange}
                  placeholder="W-200"
                  required
                  className="h-[56px] w-full border border-[#d9c7a7] bg-[#fffdf8] px-5 text-[17px] text-[#171717] outline-none placeholder:text-[#777] focus:border-[#861f2b]"
                />
              </div>

              {/* Serial number */}
              <div>
                <label
                  htmlFor="serialNumber"
                  className="mb-2 block text-[16px] font-medium text-[#555]"
                >
                  Serial No.
                </label>

                <input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  value={form.serialNumber}
                  onChange={handleChange}
                  placeholder="SN-9981-A"
                  required
                  className="h-[56px] w-full border border-[#d9c7a7] bg-[#fffdf8] px-5 text-[17px] text-[#171717] outline-none placeholder:text-[#777] focus:border-[#861f2b]"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="h-[56px] bg-[#861f2b] px-8 text-[17px] font-bold text-white transition hover:bg-[#711923] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </form>
          </section>
        )}

      </div>
    </main>
  );
}

function StatusBadge({ status }) {
  const normalizedStatus = status || 'Pending';

  const styles = {
    Verified: 'bg-[#e5f1e7] text-[#28702f]',
    Rejected: 'bg-[#fbe9d8] text-[#c24d09]',
    'Pending Application': 'bg-[#fff0c9] text-[#996500]',
    Pending: 'bg-[#fff0c9] text-[#996500]',
  };

  return (
    <span
      className={`inline-flex rounded-full px-4 py-1.5 text-[14px] font-semibold ${
        styles[normalizedStatus] || 'bg-gray-100 text-gray-700'
      }`}
    >
      {normalizedStatus}
    </span>
  );
}