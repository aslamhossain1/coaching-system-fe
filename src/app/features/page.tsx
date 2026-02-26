// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

const featureCards = [
  ["Attendance Management", "Track class-wise and subject-wise attendance with real-time reports."],
  ["Exam & Result Tracking", "Create exams, publish results, and monitor student performance trends."],
  ["Homework System", "Assign homework, set deadlines, and review submissions quickly."],
  ["Guardian Access", "Give guardians secure access to attendance, notices, and fee updates."],
  ["Fees & Ledger", "Manage fee collection, dues, invoices, and month-end financial summaries."],
  ["Notifications", "Send instant alerts for routines, exams, payments, and announcements."],
];

export default function FeaturesPage() {
  return (
    <MarketingPageLayout
      activePath="/features"
      title="Features For Complete Coaching Operations"
      subtitle="Everything your institute needs to run faster, smarter, and fully digital."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {featureCards.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-cyan-100 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
          </article>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
