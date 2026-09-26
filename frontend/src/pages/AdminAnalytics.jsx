import React from 'react';

export default function AdminAnalytics({ instruments = [] }) {
  const totalRegistered = instruments.length;

  const verified = instruments.filter(
    (item) => item.verificationStatus === 'Verified'
  ).length;

  const rejected = instruments.filter(
    (item) => item.verificationStatus === 'Rejected'
  ).length;

  const pending = Math.max(
    totalRegistered - verified - rejected,
    0
  );

  const verificationRate =
    totalRegistered > 0
      ? Math.round((verified / totalRegistered) * 100)
      : 0;

  const rejectionRate =
    totalRegistered > 0
      ? Math.round((rejected / totalRegistered) * 100)
      : 0;

  const categoryData = getCategoryData(instruments);

  return (
    <main className="min-h-screen bg-[#fffdf8] px-6 py-8">
      <div className="mx-auto max-w-[1536px]">

        {/* Dashboard Header */}
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">

          <div>
            <h2 className="font-serif text-[26px] font-bold text-[#171717]">
              State Compliance Dashboard
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">

            <select className="h-[42px] min-w-[150px] border border-[#d9c7a7] bg-[#fffdf8] px-4 text-[14px] text-[#444] outline-none">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This year</option>
            </select>

            <select className="h-[42px] min-w-[135px] border border-[#d9c7a7] bg-[#fffdf8] px-4 text-[14px] text-[#444] outline-none">
              <option>All Districts</option>
              <option>Lucknow</option>
              <option>Kanpur</option>
              <option>Ayodhya</option>
            </select>

            <button
              type="button"
              onClick={() => window.print()}
              className="h-[42px] border border-[#d9c7a7] bg-[#fffdf8] px-5 text-[14px] font-semibold text-[#333] hover:bg-[#f4ede2]"
            >
              ↑ Export Report
            </button>

          </div>
        </div>

        {/* KPI CARDS */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <KpiCard
            title="TOTAL REGISTERED"
            value={totalRegistered}
            suffix=""
            type="registered"
          />

          <KpiCard
            title="VERIFIED"
            value={verified}
            suffix={`${verificationRate}% of total`}
            type="verified"
          />

          <KpiCard
            title="PENDING REVIEW"
            value={pending}
            suffix={`${totalRegistered ? Math.round((pending / totalRegistered) * 100) : 0}% of total`}
            type="pending"
          />

          <KpiCard
            title="REJECTION RATE"
            value={`${rejectionRate}%`}
            suffix={rejected === 1 ? '▲ 1 case' : `▲ ${rejected} cases`}
            type="rejected"
          />

        </section>

        {/* CHARTS */}
        <section className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.45fr_1fr]">

          {/* Registrations by Category */}
          <div className="border border-[#d9c7a7] bg-[#fffdf8] p-5">

            <h3 className="text-[14px] font-semibold uppercase tracking-wide text-[#777]">
              REGISTRATIONS BY CATEGORY
            </h3>

            <CategoryChart data={categoryData} />

          </div>

          {/* Status Split */}
          <div className="border border-[#d9c7a7] bg-[#fffdf8] p-5">

            <h3 className="text-[14px] font-semibold uppercase tracking-wide text-[#777]">
              STATUS SPLIT
            </h3>

            <StatusDonut
              verified={verified}
              pending={pending}
              rejected={rejected}
              total={totalRegistered}
            />

          </div>

        </section>

        {/* DISTRICT-WISE COMPLIANCE */}
        <section className="mt-5 border border-[#d9c7a7] bg-[#fffdf8]">

          <div className="px-5 pb-3 pt-5">
            <h3 className="text-[14px] font-semibold uppercase tracking-wide text-[#777]">
              DISTRICT-WISE COMPLIANCE
            </h3>
          </div>

          <div className="overflow-x-auto">

            <table className="w-full border-collapse">

              <thead>
                <tr className="border-b-2 border-[#861f2b]">
                  <th className="px-5 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-[#666]">
                    DISTRICT
                  </th>

                  <th className="px-5 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-[#666]">
                    REGISTERED
                  </th>

                  <th className="px-5 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-[#666]">
                    VERIFIED
                  </th>

                  <th className="px-5 py-2.5 text-left text-[13px] font-semibold uppercase tracking-wide text-[#666]">
                    COMPLIANCE
                  </th>
                </tr>
              </thead>

              <tbody>

                <DistrictRow
                  district="Lucknow"
                  registered={totalRegistered}
                  verified={verified}
                />

                <DistrictRow
                  district="Kanpur"
                  registered={0}
                  verified={0}
                />

              </tbody>

            </table>

          </div>
        </section>

        {/* RECENT ACTIVITY */}
        <section className="mt-5 border border-[#d9c7a7] bg-[#fffdf8]">

          <div className="px-5 pb-3 pt-5">
            <h3 className="text-[14px] font-semibold uppercase tracking-wide text-[#777]">
              RECENT ACTIVITY
            </h3>
          </div>

          <div className="px-5 pb-4">

            {instruments.length > 0 ? (
              instruments
                .slice()
                .reverse()
                .slice(0, 5)
                .map((instrument, index) => (
                  <ActivityRow
                    key={
                      instrument.digitalId ||
                      instrument._id ||
                      index
                    }
                    instrument={instrument}
                  />
                ))
            ) : (
              <p className="py-5 text-[14px] text-[#777]">
                No recent activity.
              </p>
            )}

          </div>

        </section>

        {/* FOOTER */}
        <footer className="mt-16 border-t border-[#d9c7a7] py-5 text-center text-[13px] text-[#888]">
          Prototype for Smart India Hackathon 2026.Team Name-Weight A Minute.
        </footer>

      </div>
    </main>
  );
}


/* =========================================================
   KPI CARD
========================================================= */

function KpiCard({
  title,
  value,
  suffix,
  type,
}) {
  const isRejected = type === 'rejected';

  return (
    <div className="border border-[#d9c7a7] bg-[#fffdf8] px-5 py-5">

      <p className="text-[12px] font-semibold tracking-wide text-[#777]">
        {title}
      </p>

      <div className="mt-2 flex items-baseline gap-2">

        <span
          className={`font-serif text-[30px] font-bold ${
            isRejected
              ? 'text-[#b56a17]'
              : 'text-[#171717]'
          }`}
        >
          {value}
        </span>

        <span
          className={`text-[12px] font-semibold ${
            isRejected
              ? 'text-[#b56a17]'
              : 'text-[#4f7b54]'
          }`}
        >
          {suffix}
        </span>

      </div>

      <div className="mt-4 h-[10px] overflow-hidden bg-[#e8dfca]">

        {type === 'registered' && (
          <div className="flex h-full gap-1">
            <div className="w-1/3 bg-[#d8ceb4]" />
            <div className="w-1/3 bg-[#cfc3a5]" />
            <div className="w-1/3 bg-[#861f2b]" />
          </div>
        )}

        {type === 'verified' && (
          <div
            className="h-full bg-[#4f7b54]"
            style={{
              width: `${Math.max(
                8,
                Number(value) > 0 ? Number(value) / Math.max(1, Number(value)) * 50 : 0
              )}%`,
            }}
          />
        )}

        {type === 'pending' && (
          <div
            className="h-full bg-[#d8c99e]"
            style={{
              width: `${pendingBarWidth(value)}%`,
            }}
          />
        )}

        {type === 'rejected' && (
          <div
            className="h-full bg-[#b56a17]"
            style={{
              width: `${Math.max(8, Number(String(value).replace('%', '')))}%`,
            }}
          />
        )}

      </div>

    </div>
  );
}


/* =========================================================
   CATEGORY BAR CHART
========================================================= */

function CategoryChart({ data }) {
  const fallback = [
    { name: 'Elec. Scale', value: 1 },
    { name: 'Fuel Pump', value: 1 },
    { name: 'Weighbridge', value: 1 },
    { name: 'Water Meter', value: 1 },
    { name: 'Taximeter', value: 1 },
  ];

  const chartData = data.length > 0 ? data : fallback;

  const maxValue = Math.max(
    ...chartData.map((item) => item.value),
    1
  );

  return (
    <div className="mt-5">

      <div className="flex h-[190px] items-end justify-around gap-5 border-b border-[#d9c7a7] px-3">

        {chartData.map((item) => (
          <div
            key={item.name}
            className="flex h-full flex-1 flex-col items-center justify-end"
          >

            <div
              className="w-full max-w-[105px] bg-[#861f2b]"
              style={{
                height: `${Math.max(
                  10,
                  (item.value / maxValue) * 150
                )}px`,
              }}
            />

            <span className="mt-2 text-center text-[11px] text-[#777]">
              {item.name}
            </span>

          </div>
        ))}

      </div>

    </div>
  );
}


/* =========================================================
   STATUS DONUT
========================================================= */

function StatusDonut({
  verified,
  pending,
  rejected,
  total,
}) {
  const verifiedPercent =
    total > 0 ? (verified / total) * 100 : 0;

  const pendingPercent =
    total > 0 ? (pending / total) * 100 : 0;

  const rejectedPercent =
    total > 0 ? (rejected / total) * 100 : 0;

  const verifiedDeg = verifiedPercent * 3.6;

  const pendingDeg = pendingPercent * 3.6;

  const donutStyle = {
    background: `
      conic-gradient(
        #28702f 0deg ${verifiedDeg}deg,
        #d5b24b ${verifiedDeg}deg ${verifiedDeg + pendingDeg}deg,
        #b56a17 ${verifiedDeg + pendingDeg}deg 360deg
      )
    `,
  };

  return (
    <div className="flex items-center justify-center gap-10 py-4">

      <div className="relative h-[150px] w-[150px] rounded-full">

        <div
          className="absolute inset-0 rounded-full"
          style={donutStyle}
        />

        <div className="absolute inset-[28px] rounded-full bg-[#fffdf8]" />

      </div>

      <div className="space-y-4 text-[13px]">

        <Legend
          label="Verified"
          value={`${Math.round(verifiedPercent)}%`}
          className="bg-[#28702f]"
        />

        <Legend
          label="Pending"
          value={`${Math.round(pendingPercent)}%`}
          className="bg-[#d5b24b]"
        />

        <Legend
          label="Rejected"
          value={`${Math.round(rejectedPercent)}%`}
          className="bg-[#b56a17]"
        />

      </div>

    </div>
  );
}


/* =========================================================
   DISTRICT ROW
========================================================= */

function DistrictRow({
  district,
  registered,
  verified,
}) {
  const percentage =
    registered > 0
      ? Math.round((verified / registered) * 100)
      : 0;

  return (
    <tr className="border-b border-[#e3d7c2] last:border-b-0">

      <td className="px-5 py-3 text-[14px] text-[#333]">
        {district}
      </td>

      <td className="px-5 py-3 text-[14px] text-[#333]">
        {registered}
      </td>

      <td className="px-5 py-3 text-[14px] text-[#333]">
        {verified}
      </td>

      <td className="px-5 py-3">

        <div className="flex items-center gap-3">

          <div className="h-[6px] flex-1 max-w-[270px] bg-[#e8dfca]">
            <div
              className="h-full bg-[#5d7654]"
              style={{
                width: `${percentage}%`,
              }}
            />
          </div>

          <span className="text-[13px] text-[#555]">
            {registered > 0 ? `${percentage}%` : '—'}
          </span>

        </div>

      </td>

    </tr>
  );
}


/* =========================================================
   RECENT ACTIVITY
========================================================= */

function ActivityRow({ instrument }) {
  const verified =
    instrument.verificationStatus === 'Verified';

  const rejected =
    instrument.verificationStatus === 'Rejected';

  return (
    <div className="flex items-start gap-3 border-b border-[#e3d7c2] py-3 last:border-b-0">

      <span
        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
          verified
            ? 'bg-[#28702f]'
            : rejected
            ? 'bg-[#b56a17]'
            : 'bg-[#d5b24b]'
        }`}
      />

      <div>

        <p className="text-[14px] text-[#333]">

          <span className="font-mono font-semibold">
            {instrument.digitalId || 'Instrument'}
          </span>

          {' '}

          {verified
            ? 'verified by LMO, Lucknow Zone'
            : rejected
            ? 'rejected — calibration mismatch'
            : 'awaiting verification'}

        </p>

        <p className="text-[12px] text-[#888]">
          24 Sep 2026, 3:40 PM
        </p>

      </div>

    </div>
  );
}


/* =========================================================
   HELPERS
========================================================= */

function getCategoryData(instruments) {
  const counts = {};

  instruments.forEach((instrument) => {
    const category = instrument.category || 'Other';

    counts[category] =
      (counts[category] || 0) + 1;
  });

  return Object.entries(counts).map(
    ([name, value]) => ({
      name: shortenCategory(name),
      value,
    })
  );
}

function shortenCategory(category) {
  if (category.includes('Electronic Scale')) {
    return 'Elec. Scale';
  }

  if (category.includes('Fuel Dispensing')) {
    return 'Fuel Pump';
  }

  if (category.includes('Weighbridge')) {
    return 'Weighbridge';
  }

  if (category.includes('Water Meter')) {
    return 'Water Meter';
  }

  if (category.includes('Taximeter')) {
    return 'Taximeter';
  }

  return category.length > 14
    ? `${category.slice(0, 13)}…`
    : category;
}

function pendingBarWidth(value) {
  return value > 0 ? 35 : 0;
}

function Legend({
  label,
  value,
  className,
}) {
  return (
    <div className="flex items-center gap-3">

      <span
        className={`h-3 w-3 ${className}`}
      />

      <span className="min-w-[75px] text-[#555]">
        {label}
      </span>

      <span className="font-semibold text-[#333]">
        {value}
      </span>

    </div>
  );
}