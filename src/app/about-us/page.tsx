// @ts-nocheck
import MarketingPageLayout from "@/components/marketing/MarketingPageLayout";

const values = [
  ["Mission", "Help every coaching institute digitize operations with simple, reliable software."],
  ["Vision", "Build the most trusted education operations platform for South Asia."],
  ["Reliability", "Secure cloud data, role-based access, and stable performance at scale."],
  ["Support", "Dedicated onboarding and local support for admins, teachers, and staff."],
];

const stats = [
  ["600+", "Institutes"],
  ["50K+", "Students"],
  ["6K+", "Teachers"],
  ["25K+", "Guardians"],
];

export default function AboutUsPage() {
  return (
    <MarketingPageLayout
      activePath="/about-us"
      title="About Edutrack"
      subtitle="We are building practical tools that help institutes save time and improve academic operations."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {values.map(([title, description]) => (
          <article key={title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-2xl font-semibold text-slate-900 font-[var(--font-poppins)]">{title}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
          </article>
        ))}
      </div>

      <div className="mt-6 grid gap-4 rounded-3xl bg-gradient-to-r from-[#070d67] via-[#15508d] to-[#20c49d] p-6 text-white sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([value, label]) => (
          <div key={label} className="rounded-2xl bg-white/10 p-4 text-center">
            <p className="text-3xl font-semibold font-[var(--font-poppins)]">{value}</p>
            <p className="mt-1 text-sm text-blue-100">{label}</p>
          </div>
        ))}
      </div>
    </MarketingPageLayout>
  );
}
