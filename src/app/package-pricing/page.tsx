// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

const plans = [
  ["Starter", "2000 BDT / month", "For small coaching centers up to 300 students."],
  ["Growth", "2500 BDT / month", "For growing institutes with advanced workflows."],
  ["Pro", "4000 BDT / month", "Best for large institutes with multi-role operations."],
  ["Enterprise", "Custom", "Custom deployment, support, and integrations."],
];

export default function PackagePricingPage() {
  return (
    <MarketingPageLayout
      activePath="/package-pricing"
      title="Flexible Packages & Pricing"
      subtitle="Choose a package that fits your student volume and institute requirements."
    >
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map(([name, price, note], idx) => (
          <article
            key={name}
            className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm ${idx === 2 ? "ring-2 ring-indigo-300" : ""}`}
          >
            <h3 className="text-2xl font-semibold text-cyan-700 font-[var(--font-poppins)]">{name}</h3>
            <p className="mt-4 text-3xl font-semibold text-slate-900 font-[var(--font-poppins)]">{price}</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">{note}</p>
            <button className="mt-6 w-full rounded-xl bg-gradient-to-r from-indigo-700 to-cyan-500 px-4 py-2.5 text-sm font-semibold text-white">
              Choose Plan
            </button>
          </article>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
