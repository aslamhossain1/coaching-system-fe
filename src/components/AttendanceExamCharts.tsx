// @ts-nocheck
"use client";

import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AttendanceExamCharts({ attendanceRecords = [], exams = [] }) {
  const statusCount = attendanceRecords.reduce(
    (acc, record) => {
      const status = (record.status || "").toLowerCase();
      if (status === "present") acc.present += 1;
      else if (status === "absent") acc.absent += 1;
      else if (status === "late") acc.late += 1;
      return acc;
    },
    { present: 0, absent: 0, late: 0 }
  );

  const attendanceData = {
    labels: ["Present", "Absent", "Late"],
    datasets: [
      {
        data: [statusCount.present, statusCount.absent, statusCount.late],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  const limitedExams = exams.slice(0, 8);
  const examData = {
    labels: limitedExams.map((exam, index) => exam.title || `Exam ${index + 1}`),
    datasets: [
      {
        label: "Total Marks",
        data: limitedExams.map((exam) => exam.total_marks || 0),
        backgroundColor: "#6366f1",
        borderRadius: 6,
      },
    ],
  };

  return (
    <section className="grid gap-4 lg:grid-cols-2">
      <article className="glass rise-in rounded-2xl p-5">
        <h3 className="text-base font-semibold">Attendance Breakdown</h3>
        <p className="mb-4 text-sm text-slate-600">Present vs absent vs late records</p>
        <div className="mx-auto max-w-[280px]">
          <Doughnut data={attendanceData} />
        </div>
      </article>

      <article className="glass rise-in rounded-2xl p-5" style={{ animationDelay: "120ms" }}>
        <h3 className="text-base font-semibold">Exam Performance</h3>
        <p className="mb-4 text-sm text-slate-600">Total marks configured per exam</p>
        <div className="h-[260px]">
          <Bar
            data={examData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: { y: { beginAtZero: true } },
            }}
          />
        </div>
      </article>
    </section>
  );
}


