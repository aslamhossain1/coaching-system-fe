// @ts-nocheck
"use client";

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";
import { useMemo } from "react";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

function monthLabel(date) {
  return date.toLocaleDateString("en-US", { month: "short" });
}

export default function AdminAnalyticsCharts({ fees = [], attendance = [] }) {
  const { revenueLabels, revenueSeries } = useMemo(() => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i -= 1) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(d);
    }

    const labels = months.map((d) => monthLabel(d));
    const series = months.map((d) => {
      const month = d.getMonth();
      const year = d.getFullYear();

      return fees.reduce((sum, fee) => {
        if (!fee?.is_paid) return sum;
        const sourceDate = fee.paid_date || fee.due_date;
        if (!sourceDate) return sum;
        const feeDate = new Date(sourceDate);
        if (feeDate.getMonth() !== month || feeDate.getFullYear() !== year) return sum;
        return sum + Number(fee.amount || 0);
      }, 0);
    });

    return { revenueLabels: labels, revenueSeries: series };
  }, [fees]);

  const attendanceSeries = useMemo(() => {
    return attendance.reduce(
      (acc, item) => {
        const status = (item.status || "").toLowerCase();
        if (status === "present") acc.present += 1;
        if (status === "absent") acc.absent += 1;
        if (status === "late") acc.late += 1;
        return acc;
      },
      { present: 0, absent: 0, late: 0 }
    );
  }, [attendance]);

  const lineData = {
    labels: revenueLabels,
    datasets: [
      {
        label: "Revenue",
        data: revenueSeries,
        borderColor: "#2563eb",
        backgroundColor: "rgba(37, 99, 235, 0.14)",
        fill: true,
        tension: 0.35,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: "#1d4ed8",
      },
    ],
  };

  const barData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        label: "Attendance",
        data: [attendanceSeries.present, attendanceSeries.absent, attendanceSeries.late],
        borderRadius: 10,
        backgroundColor: ["#16a34a", "#ef4444", "#f59e0b"],
      },
    ],
  };

  return (
    <section className="grid gap-5 xl:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Monthly Revenue</h3>
            <p className="text-sm text-slate-500">Income trend over the last 6 months</p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Live</span>
        </div>

        <div className="h-72">
          <Line
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(148, 163, 184, 0.2)" },
                },
                x: {
                  grid: { display: false },
                },
              },
            }}
          />
        </div>
      </article>

      <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold text-slate-900 font-[var(--font-poppins)]">Attendance Overview</h3>
            <p className="text-sm text-slate-500">Present, absent and late distribution</p>
          </div>
          <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">This Cycle</span>
        </div>

        <div className="h-72">
          <Bar
            data={barData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: { color: "rgba(148, 163, 184, 0.2)" },
                },
                x: {
                  grid: { display: false },
                },
              },
            }}
          />
        </div>
      </article>
    </section>
  );
}

