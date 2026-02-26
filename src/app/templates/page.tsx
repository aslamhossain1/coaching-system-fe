// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

const templateCards = [
  ["School Template", "Ready dashboard structure for school-level daily operations."],
  ["College Template", "Academic reporting, exam flow, and attendance for college setup."],
  ["Kindergarten Template", "Simple parent communication and student progress workflows."],
  ["Madrasah Template", "Tailored records and reporting modules for madrasah institutes."],
];

export default function TemplatesPage() {
  return (
    <MarketingPageLayout
      activePath="/templates"
      title="Ready-to-Use Institute Templates"
      subtitle="Launch faster with pre-configured templates for different education models."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {templateCards.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
            <button className="mt-5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              Use Template
            </button>
          </article>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
